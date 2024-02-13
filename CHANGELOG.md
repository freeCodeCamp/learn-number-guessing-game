## Contributing

Please read the guidelines in the [contributing docs](https://contribute.freecodecamp.org/#/how-to-work-on-tutorials-that-use-coderoad) before contributing. Contributions to this project need to follow the correct workflow.

# Change Log

Whenever a new version is created, add the new branch name and the changes here

## [v1.0.0]

- Initial soft release with news article

## [v1.0.1]

- Fix project name in VSCode settings
- Remove auto save in VSCode settings

## [v1.0.2]

- Move startup commands to `setup.sh`
- Run `setup.sh` on continue and reset

## [v1.0.3]

- Add `exit` flag to mocha so tests can't hang

## [v1.0.4]

- Change `getScriptOutput` function so it doesn't add a guess if the script prints an empty line

## [v1.0.5]

- Fix test to not input numbers (-1 and 1001) outside the expected range in case campers have a check to not allow those guesses
- Minor clarifications to a couple test texts

## [v1.0.6]

- Fix test: extend time in `getScriptOutput` function to 7500 before stopping process

## [v2.0.0]

- Add Gitpod config
