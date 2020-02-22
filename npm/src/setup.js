const path = require("path");
const util = require("util");
const fs = require("fs");
const mkdirp = require("make-dir");
const { download } = require("./downloader");
const { extract } = require("./extractor");
const config = require("./config");

const fsExist = util.promisify(fs.exists);

async function setupQode() {
  const { extractDir, cacheDir, downloadLink } = config;
  if (await fsExist(config.qodePath)) {
    console.log(`Qode binary exists at ${config.qodePath}, skipping setup.`);
    return extractDir;
  }
  const archivePath = path.resolve(cacheDir, path.basename(downloadLink));
  await mkdirp(extractDir);
  await download(downloadLink, archivePath, true);
  await extract(archivePath, extractDir);
  fs.chmodSync(config.qodePath, 0o775);
  console.log(`Qode was setup successfully at : ${extractDir}`);
  return extractDir;
}

module.exports = {
  setupQode
};
