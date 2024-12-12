import { CompilerError } from "./helpers/logging";
import { parseAndValidateCommandLineArgs } from "./parse-and-validate-command-line-args";
import { lex } from "./lexer";

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
    cliOptionStopAfterParse: _cliOptionStopAfterParse,
    cliOptionStopAfterCodegen: _cliOptionStopAfterCodegen,
    cliOptionDebug: _cliOptionDebug,
    cliOptionOutputPath: _cliOptionOutputPath,
    cliOptionInputPath: _cliOptionInputPath,
    sourceText,
  } = parseAndValidateCommandLineArgs();

  const _tokens = lex(sourceText);

  if (cliOptionStopAfterLex) {
    return;
  }
}
