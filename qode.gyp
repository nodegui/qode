{
    'targets': [
        {
            'target_name': 'qode',
            'type': 'executable',
            'sources': [
                'src/main.cc',
                'src/qode.cc',
                'src/integration/node_integration.cc',
                'src/integration/node_integration_linux.cc',
                'src/integration/node_integration_mac.mm',
                'src/integration/node_integration_win.cc',
                '<(SHARED_INTERMEDIATE_DIR)/qode_javascript.cc',
            ],
            'include_dirs': [
                '.',
                'node/deps/uv/include',  # for uv.h
                'node/src',  # for node things,
            ],
            'defines': [
                'NODE_WANT_INTERNALS=1',
                'HAVE_OPENSSL=1',
                'HAVE_INSPECTOR=1',
                'NODE_SHARED_MODE',
            ],
            'dependencies': [
                'qode_js2c#host',
                'node/node.gyp:libnode',
                'node/tools/v8_gypfiles/v8.gyp:v8',
                'node/tools/icu/icu-generic.gyp:icui18n',
                'node/tools/icu/icu-generic.gyp:icuuc',
            ],
            'conditions': [
                ['OS=="mac"', {
                    'link_settings': {
                        'libraries': [ #qt stuff
                            '-Wl,-rpath,<!(echo $QN_QT_HOME_DIR)/lib/'
                        ],
                    },
                    'xcode_settings': {
                        # Generates symbols and strip the binary.
                        'DEBUG_INFORMATION_FORMAT': 'dwarf-with-dsym',
                        'DEPLOYMENT_POSTPROCESSING': 'YES',
                        'STRIP_INSTALLED_PRODUCT': 'YES',
                        'STRIPFLAGS': '-x',
                        # Force loading all objects of node, otherwise some built-in modules
                        # won't load.
                        'OTHER_LDFLAGS': [
                            '-Wl,-force_load,<(PRODUCT_DIR)/libnode.a',
                        ],
                    },
                    'include_dirs': [ #qt-stuff
                        # install qt via homebrew only
                        '<!(echo $QN_QT_HOME_DIR)/include',
                        '<!(echo $QN_QT_HOME_DIR)/include/QtCore',
                        '<!(echo $QN_QT_HOME_DIR)/include/QtWidgets',
                    ],
                    'libraries':[ #qt-stuff
                        '<!(echo $QN_QT_HOME_DIR)/lib/QtCore.framework/QtCore',
                        '<!(echo $QN_QT_HOME_DIR)/lib/QtWidgets.framework/QtWidgets',
                    ]
                }],
                ['OS=="win"', {
                    'sources': [
                        'src/qode.rc',
                        'deps/node.def',
                    ],
                    'msvs_settings': {
                        'VCManifestTool': {
                            # Manifest file.
                            'EmbedManifest': 'true',
                            'AdditionalManifestFiles': 'src/qode.exe.manifest'
                        },
                        'VCLinkerTool': {
                            # Using 5.01 would make Windows turn on compatibility mode for
                            # certain win32 APIs, which would return wrong results.
                            'MinimumRequiredVersion': '5.02',
                            # A win32 GUI program.
                            'SubSystem': '2',
                        },
                    },
                    'msvs_disabled_warnings': [
                        4251,
                        4244,
                    ],
                }],
                ['OS in "linux freebsd"', {
                    'libraries': [
                        '<!@(pkg-config gtk+-3.0 --libs)',
                    ],
                    'include_dirs': [
                        '<!@(pkg-config gtk+-3.0 --cflags-only-I | sed s/-I//g)',
                    ],
                    # Force loading all objects of node, otherwise some built-in modules
                    # won't load.
                    'ldflags': [
                        '-Wl,--whole-archive,<(obj_dir)/node/libnode.a',
                        '-Wl,--no-whole-archive',
                    ],
                }],
            ],
        },
        {
            'target_name': 'qode_js2c',
            'type': 'none',
            'toolsets': ['host'],
            'actions': [
                {
                    'action_name': 'qode_js2c',
                    'process_outputs_as_sources': 1,
                    'inputs': [
                        'deps/js2c.py',
                        'src/asar_archive.js',
                        'src/asar_monkey_patch.js',
                        'src/bootstrap.js',
                        'src/pickle.js',
                    ],
                    'outputs': [
                        '<(SHARED_INTERMEDIATE_DIR)/qode_javascript.cc',
                    ],
                    'action': [
                        'python',
                        'deps/js2c.py',
                        '<@(_outputs)',
                        '<@(_inputs)',
                    ],
                },
            ],
        },
    ],
}
