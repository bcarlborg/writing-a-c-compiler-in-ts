import argv from "process.argv";
import { CompilerError, debugLog } from "./helpers/logging";
import { setDebug } from "./helpers/logging";

export const parseAndValidateCommandLineArgs = () => {
  const processArgv = argv(process.argv.slice(2));

  interface Config {
    lex: boolean;
    parse: boolean;
    codegen: boolean;
    output: string | undefined;
    input: string | undefined;
    debug: boolean;
  }

  const config = processArgv<Config>({
    lex: false,
    parse: false,
    codegen: false,
    output: undefined,
    input: undefined,
    debug: false,
  });

  // Set global debug flag if --debug is provided
  // We want to do this before any thing else so that we can use it to log errors
  if (config.debug) {
    setDebug();
  }

  if (!config.output) {
    throw new CompilerError(
      "cliArgs",
      "No output path provided. Use --output to specify the output file path."
    );
  }

  if (!config.input) {
    throw new CompilerError(
      "cliArgs",
      "No input path provided. Use --input to specify the input file path."
    );
  }

  if (config.debug) {
    debugLog("cliArgs", "CLI argument --debug provided. Enabling debugging");
  }

  if (config.lex) {
    debugLog("cliArgs", "CLI argument --lex provided. Stopping after lex");
  }

  if (config.parse) {
    debugLog("cliArgs", "CLI argument --parse provided. Stopping after parse");
  }

  if (config.codegen) {
    debugLog(
      "cliArgs",
      "CLI argument --codegen provided. Stopping after codegen"
    );
  }

  debugLog("cliArgs", "Finished parsing command line arguments");

  return {
    cliOptionStopAfterLex: config.lex,
    cliOptionStopAfterParse: config.parse,
    cliOptionStopAfterCodegen: config.codegen,
    cliOptionDebug: config.debug,
    cliOptionOutputPath: config.output,
    cliOptionInputPath: config.input,
  };
};
