# Developer docs

This project contains the source, tests, and build system for my implementation of a C -> x86-64 compiler.

## Project Dependencies

`npm`

- Currently I am using version `9.6.7`.
- Used to install modules for our compiler source code.

`node`

- Currently on version `v18.17.0`.
- Runtime for our compiler.

`node_modules`

- There are a hanful of node modules in this project.
- I tried to keep it down to a small number, but I can't help the fact that even these small few include many many sub modules.

`python3`

- Currently on version `3.10.13`.
- Used to execute the test suit provided by the _Writing a C Compiler_ book.

## Project Structure

The main project directories:

- `./src` contains the typescript files for the compiler as well as unit tests for the source files
- `./dist` contains the compiled typescript files
- `./bin` contains the exectuable files (these simply execute node with the js files in `./dist`)
- `./docs` contains markdown files that explain aspects of the project

## Building and Running the Project

- Installing libraries: `npm i`
- Build the project: `npm run build` or `npx tsc`
- Running all unit tests: `npm run test-all` or `npx jest`
- Running a specific unit test: `npx jest ./path/to/test/file.test.ts`
- Executing the compiler: `./bin/compiler [args] input_file`
- Running programs from the compiler (if not on x86-64 machine): `arch -x86_64 zsh` then simply run the executable
