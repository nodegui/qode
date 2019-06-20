#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)
cd $DIRNAME/../../out/Release/

echo "Making Qode portable"

strip qode

mkdir -p lib
# cp -rf /usr/local/opt/qt/lib/QtWidgets.framework ./lib/QtWidgets.framework
# cp -rf /usr/local/opt/qt/lib/QtGui.framework ./lib/QtGui.framework
# cp -rf /usr/local/opt/qt/lib/QtCore.framework ./lib/QtCore.framework

mkdir -p linux

mv ./qode ./linux/qode
mv ./lib ./linux/lib

