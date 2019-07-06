const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const platform = os.platform();
const libVersion = require("./package").version;
const executableDir = path.resolve(__dirname, "dist", libVersion, "qode");
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
const executable = executableNames[platform];
const executablePath = path.resolve(executableDir, executable);
// return executable path of installed qode version
function getQodePath() {
  if (fs.existsSync(executablePath)) {
    return executablePath;
  } else {
    throw new Error(
      "Qode failed to install correctly, please delete node_modules/qode and try installing again"
    );
  }
}

module.exports = getQodePath();
