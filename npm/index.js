const fs = require("fs-extra");
const { localBinaryPath, localBinaryDir } = require("./config");

// return executable path of installed qode version
function getQodePath() {
  if (fs.existsSync(localBinaryPath)) {
    return localBinaryPath;
  } else {
    throw new Error(
      "Qode failed to install correctly, please delete node_modules/qode and try installing again"
    );
  }
}

module.exports = {
  qodePath: getQodePath(),
  qtHome: localBinaryDir
};
