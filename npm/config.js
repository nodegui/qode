const os = require("os");
const path = require("path");
const envPaths = require("env-paths");

const package = require("./package");
const platform = os.platform();
const libVersion = package.version;

const executableNames = {
  get darwin() {
    return "qode";
  },
  get linux() {
    return "qode";
  },
  get win32() {
    return "qode.exe";
  }
};

const appDirectories = envPaths("qode");
const qodeArchiveName = `qode-v${libVersion}.zip`;
const localBinaryDir = path.resolve(__dirname, "dist", libVersion);
const localArchivePath = path.resolve(localBinaryDir, qodeArchiveName);
const localBinaryPath =
  platform === "win32"
    ? path.resolve(localBinaryDir, "bin", executableNames[platform])
    : path.resolve(localBinaryDir, executableNames[platform]);
const cacheDir = appDirectories.cache;

module.exports = {
  executableNames,
  libVersion,
  cacheDir,
  qodeArchiveName,
  localBinaryDir,
  localArchivePath,
  localBinaryPath
};
