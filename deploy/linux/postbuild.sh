#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)
cd $DIRNAME/../../node/out/Release/

echo "Post Build: Making Qode portable..."

mkdir -p ./linux/lib

cp -rf $QT_INSTALL_DIR/lib/libQt5Core.so* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libQt5Gui.so* ./linux/lib/
cp -rf $QT_INSTALL_DIR/lib/libQt5Widgets.so* ./linux/lib/

mkdir -p ./linux/include

cp -rf $QT_INSTALL_DIR/include/QtWidgets ./linux/include/QtWidgets
cp -rf $QT_INSTALL_DIR/include/QtCore ./linux/include/QtCore
cp -rf $QT_INSTALL_DIR/include/QtGui ./linux/include/QtGui

cp ./qode ./linux/qode

cd ./linux

strip qode

patchelf --set-rpath "\$ORIGIN/lib" qode

echo "Qode is ready!"