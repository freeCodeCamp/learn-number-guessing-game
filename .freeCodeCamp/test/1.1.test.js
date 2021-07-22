const assert = require('assert');
const { getDirectoryContents, getFileContents, getCommits, canExecute, getCommandOutput } = require('./utils');
const { exec } = require('promisify-child-process');

let tempGuesses;

const getScriptOutput = async function(command, input = []) {
  let nextInput = 0;
  let nextGuess = 0;

  const child = exec(command, {cwd: '..'});
  child.stdout.on('data', data => {
    if(!/^\s*$/.test(data)) {
      if(nextInput < input.length) {
        child.stdin.write(`${input[nextInput++] || ''}\n`);
      } else {
        child.stdin.write(`${nextGuess++}\n`)
      }
      tempGuesses = nextGuess - 1;
    }
  });

  child.stderr.on('data', err => {
    console.log(`An error occurred running ${command}`);
    console.log(err);
  });

  setTimeout(() => {
    child.kill();
  }, 7500);

  const { stdout } = await child;
  return stdout;
};

describe('SUBTASKS 1.1', async () => {
  let username0, username1;

  before(async () => {
    username0 = `user_${Date.now()}`;
    username1 = `user_${Date.now()+1}`;
  });

  it(':1 You should create a "number_guessing_game" folder in the correct location', async () => {
    const directoryContents = await getDirectoryContents('..');

    if(!directoryContents) assert(false);

    assert(directoryContents.includes('number_guessing_game'));
  });

  it(':2 You should create "number_guess.sh" and give it executable permissions', async () => {
    const executable = await canExecute('../number_guessing_game/number_guess.sh');

    assert(executable);
  });

  it(':3 Your "number_guess.sh" file should have the correct shebang at the top', async () => {
    const fileContents = await getFileContents('../number_guessing_game/number_guess.sh');

    assert(/^\s*#![ \t]*\/bin\/bash\s*/.test(fileContents));
  });

  it(':4 You should turn the "number_guessing_game" in a git repository', async () => {
    const directoryContents = await getDirectoryContents('../number_guessing_game');

    if(!directoryContents) assert(false);

    assert(directoryContents.indexOf('.git') >= 0);
  });

  it(':5 Your repository should have at least five commits', async () => {
    const commits = await getCommits();

    if(!commits) assert(false);

    assert(commits.length > 4);
  });

  it(':6 Your script should generate a random number to guess', async () => {
    const fileContents = await getFileContents('../number_guessing_game/number_guess.sh');

    assert(/RANDOM/.test(fileContents));
  });

  it(':7 Your script should prompt for a username', async () => {
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username1]);

    assert(/Enter your username:/.test(scriptOutput));
  });

  it(':8 Your script should print the correct welcome message for returning users', async () => {
    const guesses = tempGuesses;
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username1]);
    const reString = `Welcome\\s+back,\\s+${username1}!\\s+You\\s+have\\s+played\\s+1\\s+games?,\\s+and\\s+your\\s+best\\s+game\\s+took\\s+${guesses}\\s+guess(es)?\\.`
    const re = new RegExp(reString);

    assert(re.test(scriptOutput));
  });

  it(':9 Your script should print the correct welcome message for new users', async () => {
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username0]);
    const reString = `Welcome,\\s+${username0}!\\s+It\\s+looks\\s+like\\s+this\\s+is\\s+your\\s+first\\s+time\\s+here\\.`
    const re = new RegExp(reString);

    assert(re.test(scriptOutput));
  });

  it(':10 Your script should print the correct initial message to prompt a user for a guess', async () => {
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username0]);

    assert(/Guess\s+the\s+secret\s+number\s+between\s+1\s+and\s+1000:/.test(scriptOutput));
  });

  it(':11 Your script should print the correct messages if they do not guess the correct number', async () => {
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username1, '1', 1000]);

    assert(/It's higher than that, guess again:/.test(scriptOutput) && /It's lower than that, guess again:/.test(scriptOutput));
  });

  it(':12 Your script should print the correct message if users enter a guess other than a number', async () => {
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username1, 'a']);

    assert(/That is not an integer, guess again:/.test(scriptOutput));
  });

  it(':13 Your script should print the correct message when a game is finished', async () => {
    const scriptOutput = await getScriptOutput('./number_guessing_game/number_guess.sh', [username1]);
    const guesses = tempGuesses;
    const reString = `You\\s+guessed\\s+it\\s+in\\s+${guesses}\\s+tries\\.\\s+The\\s+secret\\s+number\\s+was\\s+${guesses - 1}.\\s+Nice\\s+job!`;
    const re = new RegExp(reString);

    assert(re.test(scriptOutput));
  });

  it(':14 Your first commit should have the message, "Initial commit"', async () => {
    const commits = await getCommits();

    if(!commits) assert(false);

    assert(commits[commits.length - 1].message === 'Initial commit');
  });

  it(':15 Your commit messages should have the suggested prefixes', async () => {
    const commits = await getCommits();

    if(!commits) assert(false);

    commits.splice(commits.length - 1, 1);
    commits.forEach(commit => {
      if(!/^(fix:|feat:|chore:|refactor:|test:)/.test(commit.message)) {
        assert(false);
      }
    });

    assert(commits.length > 0);
  });

  it(':16 You should submit your project while on the "main" branch of your repository with a clean working tree', async () => {
    const commandOutput = await getCommandOutput('git status');

    if(!commandOutput) assert(false);

    assert(/On branch main\s/.test(commandOutput) && /working tree clean/.test(commandOutput));
  });
});
