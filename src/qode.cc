// Copyright 2017 Atul R. All rights reserved.

#include "src/qode.h"
#include "src/integration/node_integration.h"
#include "node/src/env-inl.h"
#include <string.h>
#include <stdlib.h>
#include <QApplication>

namespace qode {
  static int qode_argc = 0;
  static char** qode_argv = nullptr;
  // The global instance of NodeIntegration.
  std::unique_ptr<NodeIntegration> g_node_integration;
  // Has we run message loop before.
  bool g_first_runloop = true;

  bool InitWrapper(node::Environment* env) {
    return true;
  }

  bool RunLoopWrapper(node::Environment* env) {
    // Run uv loop for once before entering GUI message loop.
    if (g_first_runloop) {
      g_node_integration->UvRunOnce();
      g_first_runloop = false;
    }
    QApplication* app = new QApplication(qode_argc, qode_argv);
    app->exec();
    // No need to keep uv loop alive.
    g_node_integration->ReleaseHandleRef();
    // Enter uv loop to handle unfinished uv tasks.
    return uv_run(env->event_loop(), UV_RUN_DEFAULT);
  }


  int Start(int argc, char* argv[]) {
    qode_argc = argc;
    qode_argv = argv;
    // Prepare node integration.
    g_node_integration.reset(NodeIntegration::Create());
    g_node_integration->Init();

    // Set run loop and init function on node.
    node::InjectQode(&InitWrapper, &RunLoopWrapper);
    
    // Always enable GC this app is almost always running on desktop.
    v8::V8::SetFlagsFromString("--expose_gc", 11);

    int code = node::Start(qode_argc, qode_argv);

    // Clean up node integration and quit.
    g_node_integration.reset();
    return code;
  }

}  // namespace qode

