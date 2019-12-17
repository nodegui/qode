{
    'variables': {
        'qt_home_dir%': '/usr/local/Cellar/qt/5.12.1/',
    },
    "cflags!": ["-fno-exceptions"],
    "cflags_cc!": ["-fno-exceptions"],
    'sources': [],
    'includes': [],
    'target_conditions': [
        ['OS=="mac"', {
            'xcode_settings': {
                'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
            },
            'include_dirs': [
                '<(qt_home_dir)/lib/QtCore.framework/Versions/5/Headers',
                '<(qt_home_dir)/lib/QtGui.framework/Versions/5/Headers',
                '<(qt_home_dir)/lib/QtWidgets.framework/Versions/5/Headers',
                '<(qt_home_dir)/lib/QtSvg.framework/Versions/5/Headers',
                '../deploy/darwin/include'
            ],
            'libraries': [
                '<(qt_home_dir)/lib/QtCore.framework/Versions/5/QtCore',
                '<(qt_home_dir)/lib/QtGui.framework/Versions/5/QtGui',
                '<(qt_home_dir)/lib/QtWidgets.framework/Versions/5/QtWidgets',
                '<(qt_home_dir)/lib/QtSvg.framework/Versions/5/QtSvg',
            ],
        }],
        ['OS=="linux"', {
            'include_dirs': [
                '<(qt_home_dir)/include',
                '<(qt_home_dir)/include/QtCore',
                '<(qt_home_dir)/include/QtGui',
                '<(qt_home_dir)/include/QtWidgets',
                '<(qt_home_dir)/include/QtSvg',
            ],
            'libraries': [
                '<(qt_home_dir)/lib/libQt5Core.so',
                '<(qt_home_dir)/lib/libQt5Gui.so',
                '<(qt_home_dir)/lib/libQt5Widgets.so',
                '<(qt_home_dir)/lib/libQt5Svg.so'
            ],
            'cflags':[
                '-fPIC'
            ],
        }],
        ['OS=="win"', {
            'msvs_settings': {
                'VCCLCompilerTool': {
                    'AdditionalOptions': [
                        '/GR-',
                        '/MT',
                        '/EHsc'
                    ]
                },
            },
            'include_dirs': [
                '<(qt_home_dir)/include',
                '<(qt_home_dir)/include/QtCore',
                '<(qt_home_dir)/include/QtGui',
                '<(qt_home_dir)/include/QtWidgets',
                '<(qt_home_dir)/include/QtSvg',
            ],
            'libraries': [
                '<(qt_home_dir)/lib/Qt5Core.lib',
                '<(qt_home_dir)/lib/Qt5Gui.lib',
                '<(qt_home_dir)/lib/Qt5Widgets.lib',
                '<(qt_home_dir)/lib/Qt5Svg.lib',
            ],
        }],
    ],
}
