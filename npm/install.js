#!/usr/bin/env node

const { setupQode } = require("./src/setup");

const main = async () => {
  try {
    await setupQode();
  } catch (err) {
    console.error("Error while setting up Qode: ", err);
    process.exit(1);
  }
};

main();
