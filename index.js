#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { cleanProject } from "./utils/clean.js";
import { buildAndroid } from "./utils/buildAndroid.js";
import { generateZip } from "./utils/generateZip.js";

const argv = yargs(hideBin(process.argv))
  .option("clean", {
    alias: "c",
    description:
      "Clean specific folders (e.g., node_modules, ios/Pods, android/.gradle)",
    type: "array",
    choices: ["node_modules", "ios/Pods", "android/.gradle"],
  })
  .option("build-android", {
    alias: "b",
    description: "Run Android clean + assembleRelease",
    type: "boolean",
  })
  .option("generate-zip", {
    alias: "z",
    description: "Generate zip of the project (excluding unnecessary folders)",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

if (!argv.clean && !argv["build-android"] && !argv["generate-zip"]) {
  console.log("❗ No options provided.\nHere are some things you can do:");
  console.log(`
  🧹 --clean [folders]        Clean folders like node_modules, ios/Pods, android/.gradle
  📦 --build-android           Clean + build Android release
  🗜️ --generate-zip            Zip the project for sharing
  `);
  process.exit(0);
}

if (argv.clean) {
  cleanProject(argv.clean);
}

if (argv["build-android"]) {
  buildAndroid();
}

if (argv["generate-zip"]) {
  generateZip();
}
