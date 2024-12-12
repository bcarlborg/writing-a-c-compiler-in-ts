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
    cliOptionStopAfterLex: _cliOptionStopAfterLex,
    cliOptionStopAfterParse: _cliOptionStopAfterParse,
    cliOptionStopAfterCodegen: _cliOptionStopAfterCodegen,
    cliOptionDebug: _cliOptionDebug,
    cliOptionOutputPath: _cliOptionOutputPath,
    cliOptionInputPath: _cliOptionInputPath,
    sourceText: _sourceText,
  } = parseAndValidateCommandLineArgs();
}
