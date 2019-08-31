#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)
cd $DIRNAME/../../node/out/Release/
rm -rf ./linux

echo "Post Build: Making Qode portable..."

mkdir -p ./linux/lib

cp -a $QT_INSTALL_DIR/lib/libQt5Core.so* ./linux/lib/
cp -a $QT_INSTALL_DIR/lib/libQt5Gui.so* ./linux/lib/
cp -a $QT_INSTALL_DIR/lib/libQt5Widgets.so* ./linux/lib/
cp -a $QT_INSTALL_DIR/lib/libicu* ./linux/lib/
cp -a $QT_INSTALL_DIR/lib/libQt5DBus.so* ./linux/lib/
cp -a $QT_INSTALL_DIR/lib/libQt5XcbQpa.so* ./linux/lib/
cp -a $QT_INSTALL_DIR/lib/libQt5Svg.so* ./linux/lib/

mkdir -p ./linux/bin
cp -a $QT_INSTALL_DIR/bin/moc ./linux/bin/moc
cp -a $QT_INSTALL_DIR/bin/qmake ./linux/bin/qmake

mkdir -p ./linux/include

cp -a $QT_INSTALL_DIR/include/QtWidgets ./linux/include/QtWidgets
cp -a $QT_INSTALL_DIR/include/QtCore ./linux/include/QtCore
cp -a $QT_INSTALL_DIR/include/QtGui ./linux/include/QtGui

echo "Copying plugins"
mkdir -p ./linux/plugins
cp -a "$QT_INSTALL_DIR/plugins/iconengines" "./linux/plugins/iconengines"
cp -a "$QT_INSTALL_DIR/plugins/imageformats" "./linux/plugins/imageformats"
cp -a "$QT_INSTALL_DIR/plugins/platformthemes" "./linux/plugins/platformthemes"
cp -a "$QT_INSTALL_DIR/plugins/platforms" "./linux/plugins/platforms"

cp ./qode ./linux/qode

cd ./linux

strip qode

echo "Fixing linked library paths for binaries"
echo "[Paths]" > ./bin/qt.conf
echo "Prefix=.." >> ./bin/qt.conf

echo "Fixing linked lib path for qode"
echo "[Paths]" > ./qt.conf
echo "Prefix=." >> ./qt.conf

echo "Qode is ready!"