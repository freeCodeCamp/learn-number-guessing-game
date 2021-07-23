# Number Guess Game

> Welcome! Are you ready to build a random number guessing game?

## 1. Instructions

- Create the database
- Create the repo
- Create the game
`psql --username=freecodecamp --dbname=postgres`
Don't forget to commit your work frequently

### 1.1

Complete the tasks below

#### SUBTASKS

- Create a `number_guessing_game` folder in the `project` folder for your program
- Turn the `number_guessing_game` folder into a git repository
- Create `number_guess.sh` in your repository and give it executable permissions
- Your script should have a shebang at the top of the file that uses `#!/bin/bash`
- Your script should randomly generate a number between `1` and `1000` that users have to guess
- When you run your script, you should prompt the user for a username with `Enter your username:`
- If that username has been used before, you print `Welcome back, <username>! You have played <number_of_games_played> games, and your best game took <game_with_fewest_guesses> guesses.` Here's an example: `Welcome back, super_user! You have played 10 games, and you best game took 4 guesses.`
- If the username has not been used before, you should print `Welcome, <username>! Looks like this is your first time here.`
- The next line printed should be `Guess the secret number between 1 and 1000:` and input from the user should be read
- Until they guess the secret number, it should print `It's lower than that, guess again:` if the previous input was higher than the secret number and `It's higher than that, guess again:` if the previous input was lower than the secret number. Asking for input each time until they input the secret number.
- If anything other than a positive whole number is input as a guess, it should print `That's not a number, guess again:`
- Your git repository should have at least five commits
- The message for the first commit should be `Initial Commit`
- The rest of the commit messages should start with `fix:`, `feat:`, `refactor:`, `chore:`, or `test:`
- You should finish your project while on the `main` branch, your working tree should be clean, and you should not have any uncommitted changes
