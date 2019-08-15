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

md .\win\include
md .\win\include\QtWidgets
md .\win\include\QtCore
md .\win\include\QtGui

copy /y %QT_INSTALL_DIR%\include\QtWidgets .\win\include\QtWidgets\
copy /y %QT_INSTALL_DIR%\include\QtCore .\win\include\QtCore\
copy /y %QT_INSTALL_DIR%\include\QtGui .\win\include\QtGui\

copy .\qode.exe .\win\qode.exe

copy /y %QT_INSTALL_DIR%\bin\Qt5Core.dll .\win\Qt5Core.dll
copy /y %QT_INSTALL_DIR%\bin\Qt5Gui.dll .\win\Qt5Gui.dll
copy /y %QT_INSTALL_DIR%\bin\Qt5Widgets.dll .\win\Qt5Widgets.dll

md .\win\plugins

xcopy /y /E %QT_INSTALL_DIR%\plugins\iconengines .\win\iconengines\
xcopy /y /E %QT_INSTALL_DIR%\plugins\imageformats .\win\imageformats\
xcopy /y /E %QT_INSTALL_DIR%\plugins\platforms .\win\platforms\
xcopy /y /E %QT_INSTALL_DIR%\plugins\platformthemes .\win\platformthemes\
xcopy /y /E %QT_INSTALL_DIR%\plugins\styles .\win\styles\


echo "Qode is ready!"