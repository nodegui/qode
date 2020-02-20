const os = require("os");
const path = require("path");
const envPaths = require("env-paths");
const package = require("../package");

const platform = os.platform();
const libVersion = package.version;
const arch = os.arch();
const extractDir = path.resolve(__dirname, "..", "binaries");

const appPaths = envPaths("qode");

const executableNames = {
  darwin: "qode",
  linux: "qode",
  win32: "qode.exe"
};

const qodePath = path.resolve(extractDir, executableNames[platform]);
const downloadArchiveName = `qode-${platform}-${arch}-${libVersion}.tar.gz`;
const downloadLink = `https://github.com/nodegui/qode/releases/download/v${libVersion}/${downloadArchiveName}`;

module.exports = {
  downloadLink,
  libVersion,
  extractDir,
  cacheDir: appPaths.cache,
  qodePath
};
