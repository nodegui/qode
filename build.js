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
const target_arch = checkEnvExists("TARGET_ARCH", "x64");
const host_arch = checkEnvExists("HOST_ARCH", "x64");

if (process.env.SYNC_GIT_SUBMODULE) {
  // Sync submodule.
  execSync("git submodule sync --recursive", { stdio: null });
  execSync("git submodule update --init --recursive", { stdio: null });
}
// Generate some dynamic gyp files.
execSync(
  `python configure --dest-cpu=${target_arch}`,
  {
    cwd: "node"
  }
);
// Update the build configuration.
execSync(
  `python tools/gyp/gyp_main.py ../qode.gyp -f ninja -Dhost_arch=${host_arch} -Dtarget_arch=${target_arch} -I../config/node_overrides.gypi --depth .`,
  {
    cwd: "node"
  }
);

// Build.
const epath = `${path.join("..", "bin", "ninja")}${path.delimiter}${
  process.env.PATH
}`;

execSync(`ninja -j8 -C out/Release qode`, {
  cwd: "node",
  env: { PATH: epath }
});

