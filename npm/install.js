#!/usr/bin/env node

const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const got = require("got");
const ProgressBar = require("progress");

/*
1. Check pre installed version of binary
2. Provide a way to skip binary download ?
3. if preinstalled version of binary equals version of this package. Then skip and use that binary
4. if not equal then download binary from github and cache it in a common directory.

A cache directory to store binaries
A local directory to install. First check cache if it exists then copy from there. otherwise download to cache and copy from there.
*/

// 1. download  correct version binary from github release

// VARIABLES
const libVersion = require("./package").version;
const homedir = require("os").homedir();
const platform = os.platform();
const arch = "x64";
const qodeArchiveName = `qode-v${libVersion}.tar.gz`;
const localBinaryDir = path.resolve(__dirname, "dist", libVersion);
const localBinaryPath = path.resolve(localBinaryDir, qodeArchiveName);
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
const cacheDir = cacheDirectories[platform];
const cacheBinaryPath = path.resolve(cacheDir, qodeArchiveName);
const downloadLink =
  "https://github.com/master-atul/testing/releases/download/v0.0.2/darwin-x64.tar.gz" ||
  `https://github.com/master-atul/qode/releases/download/v${libVersion}/${platform}-${arch}.tar.gz`;

//---------------------------

const checkLocalBinary = async () => {
  return await fs.pathExists(localBinaryPath);
};

const copyArchiveFromCache = async () => {
  try {
    const exists = await checkLocalBinary();
    if (!exists) {
      throw "";
    }
  } catch (err) {
    console.log(err);
    console.log(
      `Local Qode ${libVersion} archive doesnt exists... Copying Qode from cache...`
    );
    await fs.copy(cacheBinaryPath, localBinaryPath);
  }
};

const downloadFile = async (url, targetFilePath, options) => {
  console.log("Downloading from: ", downloadLink);
  await fs.mkdirp(path.dirname(targetFilePath));
  const writeStream = fs.createWriteStream(targetFilePath);
  return await new Promise((resolve, reject) => {
    const downloadStream = got.stream(url, options);
    downloadStream.pipe(writeStream);
    const bar = new ProgressBar(
      "downloading [:bar] :percent of :size Mb :etas",
      {
        total: 100
      }
    );
    downloadStream.on("error", reject);
    downloadStream.on("downloadProgress", progress => {
      bar.total = progress.total;
      bar.curr = progress.transferred;
      bar.tick(0, { size: (progress.total / 1024 / 1024).toFixed(1) });
    });
    writeStream.on("error", reject);
    writeStream.on("close", () => resolve());
  });
};

const downloadArchiveFromGithub = async () => {
  const downloadedFilePath = path.resolve(cacheDir, "download.file");
  await downloadFile(downloadLink, downloadedFilePath, { stream: true });
  fs.rename(downloadedFilePath, cacheBinaryPath);
};

const main = async () => {
  await fs.mkdirp(localBinaryDir);
  await fs.mkdirp(cacheDir);
  try {
    await copyArchiveFromCache();
  } catch (copyError) {
    console.log("Copying Qode from cache failed... ", String(copyError));
    console.warn(
      `Now downloading a fresh copy of qode-v${libVersion} from Github...`
    );
    try {
      await downloadArchiveFromGithub();
      await copyArchiveFromCache();
    } catch (err) {
      console.log(err);
      console.error(`Failed to install qode-v${libVersion}`);
      process.exit(1);
    }
  }
  console.log(`Downloaded and setup Qode v${libVersion} successfully`);
};

main();
