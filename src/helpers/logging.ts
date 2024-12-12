// ======================================================================
// Debugging logging helpers
// ======================================================================

import { CompilerStage } from "./constants";
import { unreachable } from "./type-utils";

let isDebuggingEnabled = false;

/**
 * Set the global debug flag to true. Should only be called from the CLI processing code!
 */
export function setDebug() {
  isDebuggingEnabled = true;
}

export function debugLog(stage: CompilerStage, message: string) {
  if (isDebuggingEnabled) {
    const prefix = `[${stage}] `;
    console.log(prefix + message);
  }
}

// ======================================================================
// Error helpers
// ======================================================================

export class CompilerError<T extends CompilerStage> extends Error {
  constructor(public stage: T, public message: string, public cause?: Error) {
    super(message);
  }

  public static from<T extends CompilerStage>(
    stage: T,
    message: string,
    cause?: Error
  ) {
    return new CompilerError(stage, message, cause);
  }

  public report() {
    let prefix = "Fatal error during ";

    if (this.stage === "cliArgs") {
      prefix += "command line argument parsing";
    } else if (this.stage === "lex") {
      prefix += "lexing";
    } else if (this.stage === "parse") {
      prefix += "parsing";
    } else if (this.stage === "codegen") {
      prefix += "code generation";
    } else if (this.stage === "codeEmission") {
      prefix += "code emission";
    } else {
      unreachable(this.stage, this.stage, "Unknown compiler stage");
    }

    prefix += ": ";

    console.error(prefix + this.message);

    if (this.cause) {
      console.error(this.cause.message);
    }
  }

  public reportAndExit() {
    this.report();
    process.exit(1);
  }
}
