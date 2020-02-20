const tar = require("tar");
const util = require("util");
const fs = require("fs");
const mkdirp = require("make-dir");

const fsExist = util.promisify(fs.exists);

async function extract(archivePath, outDir) {
  console.log(`Extracting ${archivePath} to ${outDir} ...`);
  if (!(await fsExist(archivePath))) {
    throw new Error(`Archive ${archivePath} doesnt exist!!`);
  }
  await mkdirp(outDir);
  await tar.x({ file: archivePath, cwd: outDir });
  return;
}

module.exports = {
  extract
};
