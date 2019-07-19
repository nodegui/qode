#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)

cd $DIRNAME/../../out/Release/

echo "Post Build: Making Qode portable..."

echo "Choosing Qt from $QT_INSTALL_DIR"

echo "Copying Frameworks"
mkdir -p ./darwin/lib
cp -R "$QT_INSTALL_DIR/lib/QtWidgets.framework" "./darwin/lib/QtWidgets.framework"
cp -R "$QT_INSTALL_DIR/lib/QtGui.framework" "./darwin/lib/QtGui.framework"
cp -R "$QT_INSTALL_DIR/lib/QtCore.framework" "./darwin/lib/QtCore.framework"
cp -R "$QT_INSTALL_DIR/lib/QtDBus.framework" "./darwin/lib/QtDBus.framework"
cp -R "$QT_INSTALL_DIR/lib/QtPrintSupport.framework" "./darwin/lib/QtPrintSupport.framework"
echo "Copying plugins"
mkdir -p ./darwin/plugins
cp -R "$QT_INSTALL_DIR/plugins/iconengines" "./darwin/plugins/iconengines"
cp -R "$QT_INSTALL_DIR/plugins/imageformats" "./darwin/plugins/imageformats"
cp -R "$QT_INSTALL_DIR/plugins/platforms" "./darwin/plugins/platforms"
cp -R "$QT_INSTALL_DIR/plugins/platformthemes" "./darwin/plugins/platformthemes"
cp -R "$QT_INSTALL_DIR/plugins/styles" "./darwin/plugins/styles"

# echo "Symlinking"
# mkdir -p ./darwin/include
# cd ./darwin/include
# ln -s  ../lib/QtCore.framework/Versions/5/Headers QtCore
# ln -s  ../lib/QtGui.framework/Versions/5/Headers QtGui
# ln -s  ../lib/QtWidgets.framework/Versions/5/Headers QtWidgets
# cd ../../

cp ./qode ./darwin/qode
cd ./darwin

install_name_tool -change  "$QT_INSTALL_DIR/lib/QtWidgets.framework/Versions/5/QtWidgets" "@rpath/QtWidgets.framework/Versions/5/QtWidgets" qode
install_name_tool -change  "$QT_INSTALL_DIR/lib/QtCore.framework/Versions/5/QtCore" "@rpath/QtCore.framework/Versions/5/QtCore" qode
install_name_tool -change  "$QT_INSTALL_DIR/lib/QtGui.framework/Versions/5/QtGui" "@rpath/QtGui.framework/Versions/5/QtGui" qode

install_name_tool -add_rpath "@loader_path/lib" qode
install_name_tool -add_rpath "$QT_INSTALL_DIR/lib/" qode

echo "Qode is ready!"