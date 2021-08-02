#!/usr/bin/env node

const path = require("path");
const os = require("os");
const cp = require('child_process');
const fs = require('fs');
const HOST_ARCH = os.arch();

//==================================
//    HELPER UTILITIES
//==================================
// Wrapper of execSync that prints output.
const execSync = (command, options = {}) => {
  if (options.stdio === undefined) options.stdio = "inherit";
  if (options.env) options.env = Object.assign(options.env, options.env);
  else options.env = Object.assign({}, process.env);
  return cp.execSync(command, options);
};

const checkEnvExists = (envVarName, defaultValue) => {
  const value = process.env[envVarName];
  if (!value) {
    console.warn(
      `Env variable: ${envVarName} not specified, using default: ${defaultValue}`
    );
    process.env[envVarName] = defaultValue;
    return defaultValue;
  }
  console.log(`Env variable: ${envVarName}, value: ${value}`);
  return value;
};

//==================================
//    BUILD PROCESS
//==================================
// Specify target_arch.
const target_arch = checkEnvExists("TARGET_ARCH", HOST_ARCH);
const host_arch = checkEnvExists("HOST_ARCH", HOST_ARCH);

if (process.env.SYNC_GIT_SUBMODULE) {
  // Sync submodule.
  execSync("git submodule sync --recursive", { stdio: null });
  execSync("git submodule update --init --recursive", { stdio: null });
}

// Find out where VS is installed.
if (process.platform === 'win32') {
  const vswhere = path.join(process.env['ProgramFiles(x86)'], 'Microsoft Visual Studio', 'Installer', 'vswhere.exe')
  const args = ['-format', 'json']
  const result = JSON.parse(String(cp.execFileSync(vswhere, args)))
  if (result.length == 0)
    throw new Error('Unable to find Visual Studio')
  const vs = result[0]
  process.env.GYP_MSVS_VERSION = vs.displayName.match(/(\d+)$/)[1]
  process.env.GYP_MSVS_OVERRIDE_PATH = vs.installationPath
}

function archConvert(arch = "arm64"){
  if(arch === "arm64"){
    return "arm64";
  }
  return "x86_64";
}

// Required for cross compilation on macOS.
if (host_arch !== target_arch && process.platform === 'darwin') {
  process.env.GYP_CROSSCOMPILE = '1'
  const compileTargetArch = archConvert(target_arch);
  const compileHostArch = archConvert(host_arch);
   Object.assign(process.env, {
    CC: `cc -arch ${compileTargetArch}`,
    CXX: `c++ -arch ${compileTargetArch}`,
    CC_target: `cc -arch ${compileTargetArch}`,
    CXX_target: `c++ -arch ${compileTargetArch}`,
    CC_host: `cc -arch ${compileHostArch}`,
    CXX_host: `c++ -arch ${compileHostArch}`,
  })
}


// Generate some dynamic gyp files.
execSync(`python3 configure  --with-intl=small-icu --openssl-no-asm --dest-cpu=${target_arch}`, {
  cwd: "node"
});
// Update the build configuration.
const config = {
  variables: {
    target_arch,
    host_arch,
    want_separate_host_toolset: host_arch === target_arch ? 0 : 1
  }
}
if (process.platform === 'darwin') {
  // Set SDK version to the latest installed.
  const sdks = String(execSync('xcodebuild -showsdks', {stdio: null})).trim()
  const SDKROOT = sdks.match(/-sdk (macosx\d+\.\d+)/)[1]
  config.xcode_settings = {SDKROOT}
}
fs.writeFileSync(path.join(__dirname, 'arch.gypi'), JSON.stringify(config, null, '  '))
execSync('python3 node/tools/gyp/gyp_main.py qode.gyp --no-parallel -f ninja -Iarch.gypi -Icommon.gypi --depth .')

// Build.
const epath = `${path.join("..", "bin", "ninja")}${path.delimiter}${
  process.env.PATH
}`;

execSync(`ninja -j${os.cpus().length} -C out/Release qode`, {
  env: { PATH: epath }
});
