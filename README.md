# Qode

Qode is a lightly modified fork of Node.js that allows Node's event loop to be merged with Qt's or any other Gui event loop.
It is designed to be used together with `@nodegui/nodegui`. Qode achieves this by allowing message loop injection via a NodeJS addon.

<img alt="logo" src="https://github.com/nodegui/nodegui/raw/master/extras/logo/nodegui.png" height="200" />


## Changes in v2.0

> In version 2.0, Qode no longer depends on Qt as a dependency.
>
> This makes it easier to upgrade Qt and also allows devs to use their own version of Qt. Technically this means its possible to integrate with another Gui system (not Qt) aswell.
>
> Another benefit is that it helps in avoiding issues with 3rd party plugin development because of qt version mismatch.
>
> Now, Qode essentially becomes nodejs + `<some code changes to allow message loop injection via an addon>`



### Note:

Qode is published as a NPM module as `@nodegui/qode`.
For more details on the npm module visit: `npm/README.md`
The changes to node are visible in the `qode-v12.x` branches in `https://github.com/nodegui/node`

## Changes to Node.js

- The event loop remains the same as that of NodeJs until a new Gui message loop is injected via the qode api. See below for details on the api.
- When a Gui message loop is injected, qode will use it as the primary event loop and will process NodeJs requests on the main thread as an when it arrives by listening to the libuv's events.
- Note: Make sure to use a binary compatible version of nodejs when using alongside qode. For example is qode has node version of 12.x then use Node version 12.x when developing apps with qode.

Currently only 64bit OS's are supported.

## Steps for Windows

====================

Use Powershell in windows (possibly with git bash or similar installed)

1. Do a git clone for this repo

2. Install Visual Studio Community 2017. Download the Visual studio Installer and install Visual Studio Community 2017/2019. Make sure to choose "Desktop development with C++ " workload and install it.

3. Building Qode. Run `node build.js`

## Steps for Linux

==================

1. Do a git clone for this repo

2. Install GTK headers and patchelf:

```
sudo apt install libgtk-3-dev patchelf
```

3. Building Qode. Run `node build.js`

## Steps for MacOS

==================

1. Do a git clone for this repo

2. Building Qode. Run `node build.js`

### Common build errors:

1. if you get an error similar to:

   ```
    fatal error: gtk/gtk.h: No such file or directory
    #include <gtk/gtk.h>
   ```

   Make sure you have installed gtk headers as mentioned above.

2. If you get an error similar to:
   ./qode: error while loading shared libraries: cannot open shared object file: No such file or directory.

   Check the shared libraries used by qode by running `ldd ./qode`. Then you can provide the path where qode could find the libraries like this:

   `LD_LIBRARY_PATH=<path_to_lib>:$LD_LIBRARY_PATH ./qode`

And make sure you have installed gtk3 headers also for time being.

4. Yoga crashes when using with Qode. Make sure that node version you are using to compile nodegui is binary compatible with node version of Qode. or make sure you compile addons with Qode instead of Node.

## Usage

The prebuilt binaries can be found in the Releases page, modules installed by `npm` can be used directly in qode.
Qode can also be installed via npm.

Note that it is strong recommended to install the official Node.js with the
same version of qode, otherwise native modules installed by `npm` may not work
correctly in qode.

## Build

```bash
TARGET_ARCH=[x64|ia32] HOST_ARCH=[x64|ia32] node ./build.js
```

or

```
`cmd /C "set TARGET_ARCH=[x64|ia32] && set HOST_ARCH=[x64|ia32] && node build.js"`
```

_PS: I havent tested ia32 builds_

The output of the build will be present at node/out/Release/qode 

## Configurations (Available from qode v1.0.3)

Additional configurations can be done via a qode.json file in the same directory as that of the qode binary.

`qode.json`

```javascript
{
  distPath: "./dist/index.js" // This will try to load the index.js inside dist folder when qode.exe is run.
}
```

## Troubleshooting

- If you face `python cant open file 'configure'` - This means the git submodules have not been synced. So either manually sync your git submodules or set the environment variable SYNC_GIT_SUBMODULE=true before running build. See https://github.com/nodegui/qode/issues/7

## Message Loop injection api

The NodeGui core addon uses the following api exposed by qode binary to inject Qt's event loop into nodejs

https://github.com/nodegui/node/blob/43e31129fc27f738b171dca3d744a0e4245dcc6d/src/qode_shared.h#L12

```c++
#pragma once
// From Qode headers
namespace qode {
    extern int qode_argc;
    extern char **qode_argv;
    typedef int (*QodeCustomRunLoopFunc)();
    extern void InjectCustomRunLoop(QodeCustomRunLoopFunc customRunLoop);
}  // namespace qode
```

## License

The MIT license.

## Thanks

The idea of Qode is derived from [yode][yode] and [electron](https://github.com/electron/electron/). Infact Qode is a heavily modified fork of [yode][yode]. I thank [Cheng Zhao](https://github.com/zcbenz) for yode and many of the ideas behind integration of GUI based libraries with NodeJS.

[yode]: https://github.com/yue/yode

## Checklist before publishing

- Make sure to build on all platforms.
- Make sure to update Qode version in qode.cc
- Create github release
- publish on npm

## Qode - Node version table

| Qode        | Node           | 
| ------------- |:-------------:| 
| v2.1.0      | v14.2.0 | 

