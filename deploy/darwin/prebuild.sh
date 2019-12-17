#!/bin/sh
set -e

DIRNAME=$(cd `dirname $0` && pwd)

echo "Pre Build: Preparing for build."

echo "Choosing Qt from $QT_INSTALL_DIR"

echo "Checking Symlinks for include headers"

echo "Symlinking"
mkdir -p $DIRNAME/include
ln -sfn  $QT_INSTALL_DIR/lib/QtCore.framework/Versions/5/Headers $DIRNAME/include/QtCore
ln -sfn  $QT_INSTALL_DIR/lib/QtGui.framework/Versions/5/Headers $DIRNAME/include/QtGui
ln -sfn  $QT_INSTALL_DIR/lib/QtWidgets.framework/Versions/5/Headers $DIRNAME/include/QtWidgets
ln -sfn  $QT_INSTALL_DIR/lib/QtSvg.framework/Versions/5/Headers $DIRNAME/include/QtSvg

echo "Qode is ready to be built!"
