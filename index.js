#! /usr/bin/env node

import { spawn } from "child_process";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

const folder = process.argv[2];
const repo = "https://github.com/Martin-Persson/nodejs-server.git";

clear();

console.log(
  chalk.blue(figlet.textSync("Node js-cli", { horizontalLayout: "full" }))
);

if (!folder) {
  printHelp();
} else {
  init();
}

async function init() {
  await writeToTerminal("git", ["clone", repo, folder]);
  console.log(chalk.cyan("Installing dependencies..."));
  await writeToTerminal("rm", ["-rf", `${folder}/.git`]);
  await writeToTerminal("npm", ["install"], {
    cwd: process.cwd() + `/${folder}`,
  });
  console.log(chalk.green("-------------------"));
  console.log(chalk.green("Done!"));
  console.log("");
  console.log(`cd ${folder}  -> npm run dev`);
}

function writeToTerminal(command, args, options) {
  const child = spawn(command, args, options);

  return new Promise((resolve) => {
    child.stdout.on("data", (data) => {
      console.log(chalk.yellowBright(data.toString()));
    });

    child.stderr.on("data", (data) => {
      console.error(chalk.red(data.toString()));
    });

    child.on("close", () => {
      resolve();
    });
  });
}

function printHelp() {
  console.log("To clone the express server:");
  console.log("");
  console.log("nodejs-cli [FOLDER_NAME]");
  console.log("");
}
