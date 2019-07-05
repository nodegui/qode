var fs = require("fs");
var path = require("path");

// return binary path of installed qode version

var pathFile = path.join(__dirname, "path.txt");

function getQodePath() {
  if (fs.existsSync(pathFile)) {
    var executablePath = fs.readFileSync(pathFile, "utf-8");
    if (process.env.QODE_OVERRIDE_DIST_PATH) {
      return path.join(process.env.QODE_OVERRIDE_DIST_PATH, executablePath);
    }
    return path.join(__dirname, "dist", executablePath);
  } else {
    throw new Error(
      "Qode failed to install correctly, please delete node_modules/qode and try installing again"
    );
  }
}

module.exports = getQodePath();
