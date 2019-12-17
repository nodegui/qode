@ECHO OFF
ECHO "Postbuild step for windows"
setlocal enabledelayedexpansion

set DIRNAME=%0\..
cd %DIRNAME%\..\..\node\out\Release

echo "Post Build: Making Qode portable..."
cd 

IF EXIST .\win rmdir /Q /S .\win

md .\win
md .\win\lib

echo %QT_INSTALL_DIR%

copy  %QT_INSTALL_DIR%\lib\Qt5Core.lib .\win\lib\Qt5Core.lib
copy  %QT_INSTALL_DIR%\lib\Qt5Gui.lib .\win\lib\Qt5Gui.lib
copy  %QT_INSTALL_DIR%\lib\Qt5Widgets.lib .\win\lib\Qt5Widgets.lib
copy  %QT_INSTALL_DIR%\lib\Qt5Svg.lib .\win\lib\Qt5Svg.lib

md .\win\include
md .\win\include\QtWidgets
md .\win\include\QtCore
md .\win\include\QtGui
md .\win\include\QtSvg

copy /y %QT_INSTALL_DIR%\include\QtWidgets .\win\include\QtWidgets\
copy /y %QT_INSTALL_DIR%\include\QtCore .\win\include\QtCore\
copy /y %QT_INSTALL_DIR%\include\QtGui .\win\include\QtGui\
copy /y %QT_INSTALL_DIR%\include\QtSvg .\win\include\QtSvg\

md .\win\plugins

xcopy /y /E %QT_INSTALL_DIR%\plugins\iconengines .\win\plugins\iconengines\
xcopy /y /E %QT_INSTALL_DIR%\plugins\imageformats .\win\plugins\imageformats\
xcopy /y /E %QT_INSTALL_DIR%\plugins\platforms .\win\plugins\platforms\
xcopy /y /E %QT_INSTALL_DIR%\plugins\platformthemes .\win\plugins\platformthemes\
xcopy /y /E %QT_INSTALL_DIR%\plugins\styles .\win\plugins\styles\

md .\win\bin

copy .\qode.exe .\win\bin\qode.exe

copy /y %QT_INSTALL_DIR%\bin\Qt5Core.dll .\win\bin\Qt5Core.dll
copy /y %QT_INSTALL_DIR%\bin\Qt5Gui.dll .\win\bin\Qt5Gui.dll
copy /y %QT_INSTALL_DIR%\bin\Qt5Widgets.dll .\win\bin\Qt5Widgets.dll
copy /y %QT_INSTALL_DIR%\bin\Qt5Svg.dll .\win\bin\Qt5Svg.dll
copy /y %QT_INSTALL_DIR%\bin\libEGL.dll .\win\bin\libEGL.dll
copy /y %QT_INSTALL_DIR%\bin\libGLESv2.dll .\win\bin\libGLESv2.dll

copy /y %QT_INSTALL_DIR%\bin\windeployqt.exe .\win\bin\windeployqt.exe
copy /y %QT_INSTALL_DIR%\bin\moc.exe .\win\bin\moc.exe
copy /y %QT_INSTALL_DIR%\bin\qmake.exe .\win\bin\qmake.exe

echo "Creating qt.conf for qt binaries"
@echo [Paths] > .\win\bin\qt.conf
@echo Prefix=.. >> .\win\bin\qt.conf

echo "Qode is ready!"