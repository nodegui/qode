# qode

qode is a fork of Node.js that replaces its event loop with GUI message loop,
it is designed to be used together with [the Yue library](http://libyue.com).

## Changes to Node.js

* The event loop is replaced with native GUI message loops:
  * On Linux it is `GTK+` event loop;
  * On macOS it is `Cocoa` run loop;
  * On Windows it is `Win32` message loop.
* When the executable is appended with ASAR archive, qode will try to start with
  with app inside the archive.
* The process will not automatically quit when there is no work, you have to
  call the native APIs to quit the GUI message loop.
* The process will quit when **BOTH** the GUI message loop and Node.js event
  loop have quit. So if there are still Node.js requests pending, the process
  will wait until all of them have finished.
* There is a new `process.versions.qode` property added.
* The `process.stdin` is not supposed to work.
* On Windows the executable uses `WINDOWS` subsystem instead of `CONSOLE`
  subsystem, so unlike Node.js there is no console attached and REPL won't
  work.


## For linux 

### Cloning this repo:

- Do a git clone this repo

### Install GTK headers:

-  sudo apt install libgtk-3-dev                         

### Installing QT:

- Download qt from: https://www.qt.io/offline-installers (Preferably 5.12.x version)
- chmod a+x qt-opensource-linux-x64-5.12.4.run 
- ./qt-opensource-linux-x64-5.12.4.run 
- Click Next -> I accept checkbox and then Skip.
- Make sure you note down the install path. Also make sure there are no spaces in the path.
- From the list to choose components: 
        - Check Desktop gcc 64bit
        - Qt Creator (Optional)
- Choose LGPL license and install.

### Building Qode:

- `QT_INSTALL_DIR=<path_to_qt_install_dir>/5.12.4/gcc_64 node build.js`


### Common errors:

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

    ```LD_LIBRARY_PATH=<path_to_qt5_installation>/5.12.4/gcc_64/lib/:$LD_LIBRARY_PATH ./qode```


And make sure you have installed gtk3 headers also for time being.
Make sure you add LD_LIBRARY_PATH to the path to qt and then run the built executable

## Usage

The prebuilt binaries can be found in the Releases page, modules installed by
`npm` can be used directly in qode.

To package your Node.js project with qode, you should use [yackage][yackage].

Note that it is strong recommended to install the official Node.js with the
same version of qode, otherwise native modules installed by `npm` may not work
correctly in qode.

## Build

```bash
$ node ./build.js [x64|ia32]
```

## License

The MIT license.

[yackage]: https://github.com/yue/yackage
