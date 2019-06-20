#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)

cd $DIRNAME/../../out/Release/

echo "Making Qode portable..."

mkdir -p ./darwin/lib

cp -rf /usr/local/opt/qt/lib/QtWidgets.framework ./darwin/lib/QtWidgets.framework
cp -rf /usr/local/opt/qt/lib/QtGui.framework ./darwin/lib/QtGui.framework
cp -rf /usr/local/opt/qt/lib/QtCore.framework ./darwin/lib/QtCore.framework

cp ./qode ./darwin/qode

cd ./darwin

install_name_tool -change  "/usr/local/opt/qt/lib/QtWidgets.framework/Versions/5/QtWidgets" "@rpath/QtWidgets.framework/Versions/5/QtWidgets" qode
install_name_tool -change  "/usr/local/opt/qt/lib/QtCore.framework/Versions/5/QtCore" "@rpath/QtCore.framework/Versions/5/QtCore" qode
install_name_tool -change  "/usr/local/opt/qt/lib/QtGui.framework/Versions/5/QtGui" "@rpath/QtGui.framework/Versions/5/QtGui" qode

install_name_tool -add_rpath "@loader_path/lib" qode
install_name_tool -add_rpath "/usr/local/opt/qt/lib/" qode

echo "Qode is ready!"