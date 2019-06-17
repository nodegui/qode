#!/usr/bin/env node

const path = require("path");
// Wrapper of execSync that prints output.
const execSync = (command, options = {}) => {
  if (options.stdio === undefined) options.stdio = "inherit";
  if (options.env) options.env = Object.assign(options.env, options.env);
  else options.env = Object.assign({}, process.env);
  return require("child_process").execSync(command, options);
};

//-------------------------------------------
// Specify target_arch.
let target_arch = "x64";
const host_arch = "x64";
const qt_install_dir =
  process.env.QT_INSTALL_DIR || "/usr/local/Cellar/qt/5.12.3";

if (process.argv.length > 2) {
  target_arch = process.argv[2];
}

// Sync submodule.
execSync("git submodule sync --recursive", { stdio: null });
execSync("git submodule update --init --recursive", { stdio: null });

// Generate some dynamic gyp files.
execSync(`python configure --dest-cpu=${target_arch}`, { cwd: "node" });

// Update the build configuration.
execSync(
  `python node/tools/gyp/gyp_main.py qode.gyp -f ninja -Dhost_arch=${host_arch} -Dtarget_arch=${target_arch} -Dqt_home_dir=${qt_install_dir} -Iconfig/node_overrides.gypi --depth .`
);

// Build.
const epath = `${path.join("bin", "ninja")}${path.delimiter}${
  process.env.PATH
}`;

execSync(`ninja -j16 -C out/Release qode`, { env: { PATH: epath } });

if (process.platform === "linux") {
  execSync("strip out/Release/qode");
}
