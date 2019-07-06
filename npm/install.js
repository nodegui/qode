#!/usr/bin/env node

const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const got = require("got");
const ProgressBar = require("progress");
const extract = require("extract-zip");
const {
  cacheDirectories,
  libVersion,
  qodeArchiveName,
  localBinaryDir,
  localArchivePath,
  localBinaryPath
} = require("./config");

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
const platform = os.platform();
const arch = "x64";

const cacheDir = cacheDirectories[platform];
const cacheArchivePath = path.resolve(cacheDir, qodeArchiveName);
const downloadLink =
  "https://github.com/master-atul/testing/releases/download/v0.0.3/darwin-x64.zip" ||
  `https://github.com/master-atul/qode/releases/download/v${libVersion}/${platform}-${arch}.zip`;

//---------------------------

const checkLocalBinary = async () => {
  return await fs.pathExists(localBinaryPath);
};

const copyArchiveFromCache = async () => {
  console.log(
    `Local Qode ${libVersion} archive doesnt exists... Copying Qode from cache...`
  );
  await fs.copy(cacheArchivePath, localArchivePath);
};

const extractZip = async (source, targetDir) => {
  return new Promise((resolve, reject) => {
    extract(source, { dir: targetDir }, function(err) {
      err ? reject(err) : resolve(true);
    });
  });
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
  fs.rename(downloadedFilePath, cacheArchivePath);
};

const extractBinaries = async () => {
  console.log("Extracting binaries...");
  await extractZip(localArchivePath, localBinaryDir);
};

const setup = async () => {
  await fs.mkdirp(localBinaryDir);
  await fs.mkdirp(cacheDir);
  const exists = await checkLocalBinary();
  if (exists) {
    return;
  }
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
  await extractBinaries();
};

const main = async () => {
  try {
    await setup();
  } catch (err) {
    console.error("Error while setting up Qode ", err);
    process.exit(1);
  }
};

main();
