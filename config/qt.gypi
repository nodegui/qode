{
    'includes': [],
    'variables': {
        'qt_home_dir%': '/usr/local/Cellar/qt/5.12.1/',
    },
    'target_defaults': {
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
                    # install qt via homebrew only
                    '<(qt_home_dir)/include',
                    '<(qt_home_dir)/include/QtCore',
                    '<(qt_home_dir)/include/QtGui',
                    '<(qt_home_dir)/include/QtWidgets',
                ],
                'libraries': [
                    '<(qt_home_dir)/lib/QtCore.framework/QtCore',
                    '<(qt_home_dir)/lib/QtGui.framework/QtGui',
                    '<(qt_home_dir)/lib/QtWidgets.framework/QtWidgets',
                ],
            }],
            ['OS=="linux"', {
                'include_dirs': [
                    # install qt via homebrew only
                    '<(qt_home_dir)/include',
                    '<(qt_home_dir)/include/QtCore',
                    '<(qt_home_dir)/include/QtGui',
                    '<(qt_home_dir)/include/QtWidgets',
                ],
                'libraries': [
                    '<(qt_home_dir)/lib/libQt5Core.so',
                    '<(qt_home_dir)/lib/libQt5Gui.so',
                    '<(qt_home_dir)/lib/libQt5Widgets.so',
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
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/includes',
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/includes/QtCore',
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/includes/QtGui',
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/includes/QtWidgets',
                ],
                'libraries': [
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/lib/Qt5Core.lib',
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/lib/Qt5Gui.lib',
                    '<(qt_home_dir)/dep/qt-5.11.0/win32/msvc2017_64/lib/Qt5Widgets.lib',
                ],
            }],
        ],
    },
}
