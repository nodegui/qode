// Copyright 2017 Atul R. All rights reserved.

#include "qode.h"
#include "src/integration/node_integration.h"
#include "node/src/env-inl.h"
#include <string.h>
#include <stdlib.h>

std::string qodeVersion = "1.0.0";

namespace qode {
  QApplication* qtAppInstance = nullptr;
  static int qode_argc = 0;
  static char** qode_argv = nullptr;
  // The global instance of NodeIntegration.
  std::unique_ptr<NodeIntegration> g_node_integration;
  // Has we run message loop before.
  bool g_first_runloop = true;

  inline v8::Local<v8::String> ToV8String(node::Environment* env, const std::string str) {
   return v8::String::NewFromUtf8(
      env->isolate(), str.c_str(), v8::NewStringType::kNormal, static_cast<int>(str.length())
    ).ToLocalChecked();
  }

  bool InitWrapper(node::Environment* env) {
    v8::HandleScope handle_scope(env->isolate());
    v8::Local<v8::Value> versions = env->process_object()->Get(
        env->context(), ToV8String(env, "versions")
    ).ToLocalChecked();
    versions.As<v8::Object>()->Set(
      env->context(),
      ToV8String(env, "qode"),
      ToV8String(env, qodeVersion)
    ).ToChecked();

    versions.As<v8::Object>()->Set(
      env->context(),
      ToV8String(env, "qt(compiled)"),
      ToV8String(env, QT_VERSION_STR)
    ).ToChecked();

    
    versions.As<v8::Object>()->Set(
      env->context(),
      ToV8String(env, "qt(runtime)"),
      ToV8String(env, qVersion())
    ).ToChecked();

    return true;
  }

  bool RunLoopWrapper(node::Environment* env) {
    // Run uv loop for once before entering GUI message loop.
    if (g_first_runloop) {
      g_node_integration->UvRunOnce();
      g_first_runloop = false;
    }
    qtAppInstance->exec();
    // No need to keep uv loop alive.
    g_node_integration->ReleaseHandleRef();
    // Enter uv loop to handle unfinished uv tasks.
    return uv_run(env->event_loop(), UV_RUN_DEFAULT);
  }


  int Start(int argc, char* argv[]) {
    qode_argc = argc;
    qode_argv = argv;

    qtAppInstance = new QApplication(qode_argc, qode_argv);
    qtAppInstance->processEvents(); // Just run it once.
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

}  

