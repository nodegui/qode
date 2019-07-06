const os = require("os");
const path = require("path");

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

const homedir = os.homedir();
const cacheDirectories = {
  get darwin() {
    return path.resolve(homedir, ".qode", libVersion);
  },
  get linux() {
    throw new Error("linux cache directory not implemented yet");
  },
  get win32() {
    throw new Error("win32 cache directory not implemented yet");
  }
};

const qodeArchiveName = `qode-v${libVersion}.zip`;
const localBinaryDir = path.resolve(__dirname, "dist", libVersion);
const localArchivePath = path.resolve(localBinaryDir, qodeArchiveName);
const localBinaryPath = path.resolve(localBinaryDir, executableNames[platform]);

module.exports = {
  executableNames,
  cacheDirectories,
  libVersion,
  qodeArchiveName,
  localBinaryDir,
  localArchivePath,
  localBinaryPath
};
