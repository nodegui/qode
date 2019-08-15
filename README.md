# Qode

Qode is a lightly modified fork of Node.js that merges Node's event loop with Qt's event loop.
It is designed to be used together with `@nodegui/nodegui`.

<img alt="logo" src="https://github.com/nodegui/nodegui/raw/master/extras/logo/nodegui.png" height="200" />

### Note:

Qode is published as a NPM module as `@nodegui/qode`.
For more details on the npm module visit: `npm/README.md`

## Changes to Node.js

- The event loop is replaced with QT's GUI message loop.
- The process will quit when **BOTH** the QT message loop and Node.js event
  loop have quit. So if there are still Node.js requests pending, the process
  will wait until all of them have finished.
- There are new `process.versions.qode` property added - This mentions the qode version.
- There are new `process.versions.qt(runtime)` property added - This mentions the version of qt shared library you are using on runtime.
- There are new `process.versions.qt(compiled)` property added - This mentions the version of qt used while compiling qode. Ideally both runtime and compile time versions should be same but binary compatible versions could work too.
- Make sure to use a binary compatible version of nodejs when using alongside qode. For example is qode has node version of 12.x then use Node version 12.x when developing apps with qode.

Currently only 64bit OS's are supported.

## Steps for Windows

====================

Use Powershell in windows (possibly with git bash or similar installed)

1. Do a git clone for this repo

2. Install Visual Studio Community 2017. Download the Visual studio Installer and install Visual Studio Community 2017. Make sure to choose "Desktop development with C++ " workload and install it. PS: Visual Studio 2019 will not work since NodeJS build toolchain doesnt support it aswell.

3. Installing QT. Download qt from: https://www.qt.io (5.x version)

4. Building Qode. Run `cmd /C "set QT_INSTALL_DIR=C:\path\to\qt\5.13.0\msvc2017_64 && node build.js"`

## Steps for Linux

==================

1. Do a git clone for this repo

2. Install GTK headers and patchelf:

```
sudo apt install libgtk-3-dev patchelf
```

3. Installing QT.

   - Download qt from: https://www.qt.io/offline-installers (Preferably 5.x version)
   - chmod a+x qt-opensource-linux-x64-5.12.4.run
   - ./qt-opensource-linux-x64-5.12.4.run
   - Click Next -> I accept checkbox and then Skip.
   - Make sure you note down the install path. Also make sure there are no spaces in the path.
   - From the list to choose components: - Check Desktop gcc 64bit and Qt Creator (Optional)
   - Choose LGPL license and install.

   **or**

   - You can even build from source. Just download qt-everywhere source code of the version of the QT you want to build and do a standard make build.

4. Building Qode. Run `QT_INSTALL_DIR=<path_to_qt_install_dir>/5.12.4/gcc_64 node build.js`

## Steps for MacOS

==================

1. Do a git clone for this repo

2. Installing QT.

   - Download qt from: https://www.qt.io/offline-installers (Preferably 5.x version)
   - Install from the downloaded dmg.
   - Click Next -> I accept checkbox and then Skip.
   - Make sure you note down the install path. Also make sure there are no spaces in the path.
   - From the list to choose components: - Check Desktop gcc 64bit and Qt Creator (Optional)
   - Choose LGPL license and install.

   **or**

   - You can even build from source. Just download qt-everywhere source code of the version of the QT you want to build and do a standard make build.

3. Building Qode. Run `QT_INSTALL_DIR=/path/to/qt/5.13.0 node build.js`

### Common build errors:

1. if you get an error similar to:

   ```
   ../../src/qode.h:5:10: fatal error: QApplication: No such file or directory
   #include <QApplication>
           ^~~~~~~~~~~~~~
   ```

   Make sure you have installed QT5 and have specified the correct path in QT_INSTALL_DIR as mentioned above

2. if you get an error similar to:

   ```
    fatal error: gtk/gtk.h: No such file or directory
    #include <gtk/gtk.h>
   ```

   Make sure you have installed gtk headers as mentioned above.

3. If you get an error similar to:
   ./qode: error while loading shared libraries: libQt5Core.so.5: cannot open shared object file: No such file or directory.

   Check the shared libraries used by qode by running `ldd ./qode`. Then you can provide the path where qode could find the libraries like this:

   `LD_LIBRARY_PATH=<path_to_qt5_installation>/5.12.4/gcc_64/lib/:$LD_LIBRARY_PATH ./qode`

And make sure you have installed gtk3 headers also for time being.
Make sure you add LD_LIBRARY_PATH to the path to qt and then run the built executable

4. Yoga crashes when using with Qode. Make sure that node version you are using to compile nodegui is binary compatible with node version of Qode. or make sure you compile addons with Qode instead of Node.

## Usage

The prebuilt binaries can be found in the Releases page, modules installed by `npm` can be used directly in qode.
Qode can also be installed via npm.

Note that it is strong recommended to install the official Node.js with the
same version of qode, otherwise native modules installed by `npm` may not work
correctly in qode.

## Build

```bash
QT_INSTALL_DIR=<path_to_qt_install_directory> TARGET_ARCH=[x64|ia32] HOST_ARCH=[x64|ia32] node ./build.js
```

or

```
`cmd /C "set QT_INSTALL_DIR=<path_to_qt_install_directory> && set TARGET_ARCH=[x64|ia32] && set HOST_ARCH=[x64|ia32] && node build.js"`
```

_PS: I havent tested ia32 builds_

The output of the build will be present at qode/node/out/Release/<platform> (platform is darwin, win32 or linux)

## License

The MIT license.

## Thanks

The idea of Qode is derived from [yode][yode] and [electron][https://github.com/electron/electron/]. Infact Qode is a heavily modified fork of [yode][yode]. I thank [Cheng Zhao](https://github.com/zcbenz) for yode and many of the ideas behind integration of GUI based libraries with NodeJS.

[yode]: https://github.com/yue/yode

## Checklist before publishing

- Make sure to build on all platforms.
- Make sure to update Qode version in qode.cc
- Create github release
- publish on npm
