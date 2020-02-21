const fetch = require("node-fetch");
const util = require("util");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const mkdirp = require("make-dir");
const Progress = require("progress");
const config = require("./config");

const streamPipeline = util.promisify(stream.pipeline);
const fsExist = util.promisify(fs.exists);

function progressBar(tokens, total) {
  const pt = new stream.PassThrough();
  const bar = new Progress(tokens, { total });
  pt.on("data", chunk => bar.tick(chunk.length));
  return pt;
}

async function download(link, outPath, skipIfExist = true) {
  const name = `Qode v${config.libVersion}`;
  await mkdirp(path.dirname(outPath));

  if (skipIfExist) {
    if (await fsExist(outPath)) {
      return console.warn(
        `Cached archive already exists at ${outPath}. Skipping download....`
      );
    }
  }
  const response = await fetch(link);
  if (!response.ok) {
    throw new Error(
      `Error while downloading ${name}:${link}. ${response.statusText}`
    );
  }
  const total = parseInt(`${response.headers.get("content-length")}`, 10);
  const totalInMb = (total / 1024 / 1024).toFixed(2);
  await streamPipeline(
    response.body,
    progressBar(
      `Downloading ${name} [:bar] :percent of ${totalInMb}MB :etas`,
      total
    ),
    fs.createWriteStream(outPath)
  );
}

module.exports = {
  download
};
