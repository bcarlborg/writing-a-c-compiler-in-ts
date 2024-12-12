export type CompilerStage =
  | "cliArgs"
  | "lex"
  | "parse"
  | "codegen"
  | "codeEmission";

// ======================================================================
// Debugging logging helpers
// ======================================================================

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
  constructor(public type: T, public message: string) {
    super(message);
  }

  public static from<T extends CompilerStage>(type: T, message: string) {
    return new CompilerError(type, message);
  }

  public report() {
    let prefix = "Fatal error during ";

    if (this.type === "cliArgs") {
      prefix += "command line argument parsing";
    } else if (this.type === "lex") {
      prefix += "lexing";
    } else if (this.type === "parse") {
      prefix += "parsing";
    } else if (this.type === "codegen") {
      prefix += "code generation";
    } else if (this.type === "codeEmission") {
      prefix += "code emission";
    } else {
      // TODO: unreachable
    }

    prefix += ": ";

    console.error(prefix + this.message);
  }

  public reportAndExit() {
    this.report();
    process.exit(1);
  }
}
