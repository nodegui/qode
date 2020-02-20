const path = require("path");
const mkdirp = require("make-dir");
const { download } = require("./downloader");
const { extract } = require("./extractor");
const config = require("./config");

async function setupQode() {
  const { extractDir, cacheDir, downloadLink } = config;

  const archivePath = path.resolve(cacheDir, path.basename(downloadLink));
  await mkdirp(extractDir);
  await download(downloadLink, archivePath, true);
  await extract(archivePath, extractDir);
  console.log(`Qode was setup successfully at : ${extractDir}`);
  return extractDir;
}

module.exports = {
  setupQode
};
