{
    'includes': [
        '../node/config.gypi',
        '../node/common.gypi',
    ],
    'variables': {
        # overrides node's config.gypi.
        'component': 'static_library',
        'library': 'static_library',
        'OPENSSL_PRODUCT': 'libopenssl.a',
        'node_target_type': 'static_library',
        'node_install_npm': 'false',
        'node_prefix': '',
        'uv_library': 'static_library',
        'uv_parent_path': '../node/deps/uv',
        'uv_use_dtrace': 'false',
        'V8_BASE': '',
        'v8_optimized_debug': 0,
        'v8_typed_array_max_size_in_heap': 0,
        'node_report': 'false',
        # 'v8_use_snapshot': 0
    },
    'target_defaults': {
        'includes': [
            './filename_rules.gypi',
        ],
        'include_dirs': [
            '../node/deps/v8/include',
        ],
        'target_conditions': [
            ['_target_name=="libnode" and OS=="win"', {
                # Force loading all objects of node, otherwise some built-in modules
                # won't load.
                'sources': [
                    # '../deps/node.def',
                ],
                'defines': [
                    # We want to export Node's symbols but do not wish to change its
                    # vc runtime settings.
                    'NODE_SHARED_MODE',
                    # ICU is built as static library and this has to be defined for its
                    # users on Windows.
                    'U_STATIC_IMPLEMENTATION=1',
                ],
            }],
            ['_target_name in ["libnode", "genrb", "genccode"] or _target_name.startswith("icu")', {
                # Somehow Node's gyp files are not adding the include dirs.
                'include_dirs': [
                    '../node/deps/icu-small/source/common',
                    '../node/deps/icu-small/source/i18n',
                    '../node/deps/icu-small/source/tools/toolutil',
                ],
            }],
            ['_target_name in ["libuv", "http_parser", "openssl", "openssl-cli", "cares", "libnode", "nghttp2", "zlib", "mksnapshot", "genrb", "genccode"] or _target_name.startswith("v8") or _target_name.startswith("icu")', {
                # Suppress all the warnings in Node.
                'msvs_settings': {
                    'VCCLCompilerTool': {
                        'WarningLevel': 0,
                    },
                },
                'msvs_disabled_warnings': [
                    # 4251,
                    # 4244,
                ],
                'xcode_settings': {
                    'WARNING_CFLAGS': [
                        '-Wno-deprecated-declarations',
                        '-Wno-undefined-var-template',
                        '-Wno-switch',
                        '-Wno-unused-function',
                        '-Wno-sign-compare',
                        '-Wno-implicit-function-declaration',
                    ],
                    'WARNING_CFLAGS!': [
                        '-W',
                        '-Wall',
                    ],
                },
                'cflags': [
                    '-Wno-deprecated-declarations',
                    '-Wno-switch',
                    '-Wno-unused-function',
                    '-Wno-sign-compare',
                    '-Wno-unused-but-set-variable',
                    '-Wno-maybe-uninitialized',
                ],
                'cflags_c': [
                    '-Wno-implicit-function-declaration',
                ],
                'cflags!': [
                    '-Wall',
                    '-Wextra',
                ],
            }],
        ],
    },
}
