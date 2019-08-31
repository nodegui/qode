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
                'src/helpers/qode_helpers.cc'
            ],
            "includes": [
                './config/qt.gypi'
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
                'node/node.gyp:libnode',
                'node/tools/v8_gypfiles/v8.gyp:v8',
                'node/tools/icu/icu-generic.gyp:icui18n',
                'node/tools/icu/icu-generic.gyp:icuuc',
            ],
            'conditions': [
                ['OS=="mac"', {
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
                }],
                ['OS=="win"', {
                    'sources': [
                        'src/qode.rc',
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
                            # A win32 GUI program use 2 and for CUI use 1.
                            'SubSystem': '1',
                        },
                    },
                    'msvs_disabled_warnings': [
                        # 4251,
                        # 4244,
                    ],
                    'libraries': [
                        'Dbghelp.lib',
                        'winmm.lib',
                        'Ws2_32.lib',
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
                        # '-Wl,--whole-archive,<(obj_dir)/node/libnode.a',
                        '-Wl,--no-whole-archive',
                        "-Wl,-rpath,'$$ORIGIN/lib'"
                    ],
                }],
            ],
        },
    ],
}
