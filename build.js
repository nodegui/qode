#!/usr/bin/env node

const path = require("path");

//==================================
//    HELPER UTILITIES
//==================================
// Wrapper of execSync that prints output.
const execSync = (command, options = {}) => {
  if (options.stdio === undefined) options.stdio = "inherit";
  if (options.env) options.env = Object.assign(options.env, options.env);
  else options.env = Object.assign({}, process.env);
  return require("child_process").execSync(command, options);
};

const checkEnvExists = (envVarName, defaultValue) => {
  const value = process.env[envVarName];
  if (!value) {
    console.warn(
      `Env variable: ${envVarName} not specified, using default: ${defaultValue}`
    );
    process.env[envVarName]=defaultValue;
    return defaultValue;
  }
  console.log(`Env variable: ${envVarName}, value: ${value}`);
  return value;
};

const runPostBuild = ()=>{
  let command = '';
  switch(process.platform){
    case "win32": command = `${__dirname}/deploy/win32/postbuild.bat`; break;
    case "linux": command = `${__dirname}/deploy/linux/postbuild.sh`; break;
    case "darwin": command = `${__dirname}/deploy/darwin/postbuild.sh`; break;
  }
  execSync(command, { env: process.env});
}

//==================================
//    BUILD PROCESS
//==================================
// Specify target_arch.
const target_arch = checkEnvExists("TARGET_ARCH", "x64");
const host_arch = checkEnvExists("HOST_ARCH", "x64");
const qt_install_dir = checkEnvExists(
  "QT_INSTALL_DIR",
  "/usr/local/Cellar/qt/5.12.3"
);

if (!process.env.IS_DOCKER) {
  // Sync submodule.
  execSync("git submodule sync --recursive", { stdio: null });
  execSync("git submodule update --init --recursive", { stdio: null });
}
// Generate some dynamic gyp files.
if(process.platform === 'win32'){
  execSync(`python configure --openssl-no-asm --dest-cpu=${target_arch}`, { cwd: "node" });
}else {
  execSync(`python configure --dest-cpu=${target_arch}`, { cwd: "node" });
}

// Update the build configuration.
execSync(
  `python node/tools/gyp/gyp_main.py qode.gyp -f ninja -Dhost_arch=${host_arch} -Dtarget_arch=${target_arch} -Dqt_home_dir=${qt_install_dir} -Iconfig/node_overrides.gypi --depth .`
);

// Build.
const epath = `${path.join("bin", "ninja")}${path.delimiter}${
  process.env.PATH
}`;

execSync(`ninja -j8 -C out/Release qode`, { env: { PATH: epath } });

runPostBuild();


