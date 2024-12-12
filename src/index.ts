import fs from "node:fs";

import { CompilerError, debugLog } from "./helpers/logging";
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
    sourceText,
  } = parseAndValidateCommandLineArgs();
}
