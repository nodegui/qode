const { download } = require("./src/downloader");
const { extract } = require("./src/extractor");
const { setupQode } = require("./src/setup");
const { qodePath } = require("./src/config");

module.exports = {
  download,
  extract,
  setupQode,
  qodePath
};
