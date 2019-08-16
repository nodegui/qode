#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)
cd $DIRNAME/../../node/out/Release/
rm -rf ./linux

echo "Post Build: Making Qode portable..."

mkdir -p ./linux/lib

cp -rf $QT_INSTALL_DIR/lib/libQt5Core.so* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libQt5Gui.so* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libQt5Widgets.so* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libicu* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libQt5DBus.so* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libQt5XcbQpa.so* ./linux/lib/

mkdir -p ./linux/include

cp -rf $QT_INSTALL_DIR/include/QtWidgets ./linux/include/QtWidgets
cp -rf $QT_INSTALL_DIR/include/QtCore ./linux/include/QtCore
cp -rf $QT_INSTALL_DIR/include/QtGui ./linux/include/QtGui

echo "Copying plugins"
mkdir -p ./linux/plugins
cp -R "$QT_INSTALL_DIR/plugins/iconengines" "./linux/plugins/iconengines"
cp -R "$QT_INSTALL_DIR/plugins/imageformats" "./linux/plugins/imageformats"
cp -R "$QT_INSTALL_DIR/plugins/platformthemes" "./linux/plugins/platformthemes"
cp -R "$QT_INSTALL_DIR/plugins/platforms" "./linux/platforms"
# patchelfing platforms so that they can find right libs
patchelf --set-rpath "\$ORIGIN/../lib" ./linux/platforms/libqxcb.so

cp ./qode ./linux/qode

cd ./linux

strip qode

patchelf --set-rpath "\$ORIGIN/lib" qode



echo "Qode is ready!"