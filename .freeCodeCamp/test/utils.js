const fs = require('fs');
const util = require('util');
const { exec } = require('promisify-child-process');
const { gitToJs } = require('git-parse');
const execute = util.promisify(require('child_process').exec);

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const pathToRepo = '../number_guessing_game';

const getDirectoryContents = async (dir = process.cwd()) => {
  const directoryContents = await readdir(dir);

  if (!directoryContents) {
    throw new Error(`Could not find folder ${dir}`);
  }

  return directoryContents;
};

const getFileContents = async (file = process.cwd()) => {
  const fileContents = await readFile(file);

  if (!fileContents) {
    throw new Error(`Could not read file ${file}`);
  }

  return fileContents.toString();
};

const getScriptOutput = async function (command) {
  let nextInput = 1;

  const child = exec(command, {});
  child.stdout.on('data', () => {
    if (arguments[nextInput]) {
      child.stdin.write(`${arguments[nextInput++] || ''}\n`);
    }
  });

  child.stderr.on('data', err => {
    console.log(`An error occurred running ${command}`);
    console.log(err);
  });

  setTimeout(() => {
    child.kill();
  }, 10000);

  const { stdout } = await child;
  return stdout;
};

const canExecute = async function(file) {
  try {
    fs.accessSync(file, fs.constants.X_OK);
    return true;
  } catch (err) {
    return false;
  }
}

const getCommits = async () => {
  const commits = await gitToJs(pathToRepo);

  if (!commits) {
    throw new Error('Could not get commits in repo');
  }

  return commits;
};

const getCommandOutput = async function(command) {
  const { stdout } = await execute(command, { cwd: '../number_guessing_game', shell: '/bin/bash' });
  return stdout;
}

exports.getDirectoryContents = getDirectoryContents;
exports.getFileContents = getFileContents;
exports.getScriptOutput = getScriptOutput;
exports.canExecute = canExecute;
exports.getCommits = getCommits;
exports.getCommandOutput = getCommandOutput;