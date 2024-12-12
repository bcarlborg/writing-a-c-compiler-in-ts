import { CompilerError } from "./helpers/logging";
import { parseAndValidateCommandLineArgs } from "./parse-and-validate-command-line-args";

try {
  main();
} catch (error) {
  if (error instanceof CompilerError) {
    error.reportAndExit();
  }
}

function main() {
  const {
    cliOptionStopAfterLex,
    cliOptionStopAfterParse,
    cliOptionStopAfterCodegen,
    cliOptionDebug,
    cliOptionOutputPath,
    cliOptionInputPath,
  } = parseAndValidateCommandLineArgs();
}
