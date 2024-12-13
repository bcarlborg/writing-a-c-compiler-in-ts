import { CompilerError, debugLog } from "./helpers/logging";

type Token =
  | {
      type: "identifier";
      name: string;
    }
  | {
      type: "constant";
      value: number;
    }
  | {
      type: "int";
    }
  | {
      type: "void";
    }
  | {
      type: "return";
    }
  | {
      type: "open_paren";
    }
  | {
      type: "close_paren";
    }
  | {
      type: "open_brace";
    }
  | {
      type: "close_brace";
    }
  | {
      type: "semicolon";
    };

export const lex = (sourceText: string): Token[] => {
  const lexer = new Lexer(sourceText);
  const tokens = lexer.lex();
  debugLog("lex", "lexing source text complete");
  return tokens;
};

class Lexer {
  constructor(private sourceText: string) {}

  private currentCharIndex = 0;

  private getCurrentChar(): string | undefined {
    if (this.currentCharIndex >= this.sourceText.length) {
      return undefined;
    }
    return this.sourceText[this.currentCharIndex];
  }

  /**
   * Accepts an entire string to match, or a regex for a single character that will be
   * matched over and over until it doesn't match.
   */
  private gobbleMatchingChars(match: string | RegExp): string | undefined {
    if (typeof match === "string") {
      for (let i = 0; i < match.length; i++) {
        const matchChar = match[i];
        const offsetChar = this.getCharAtOffsetFromCurrentChar(i);

        if (offsetChar !== matchChar) {
          return undefined;
        }
      }
      // if we get here, we've matched the entire string, lets consume the characters
      // and return the match
      this.advanceCurrentCharIndexBy(match.length);
      return match;
    }

    let offset = 0;
    while (true) {
      const offsetChar = this.getCharAtOffsetFromCurrentChar(offset);

      if (offsetChar === undefined) {
        break;
      }

      const matchStr = offsetChar.match(match);
      if (matchStr === null) {
        break;
      }

      offset++;
    }

    if (offset === 0) {
      return undefined;
    }

    const matchStr = this.getStringOfNextCharacters(offset);
    this.advanceCurrentCharIndexBy(offset);
    return matchStr;
  }

  private getCharAtOffsetFromCurrentChar(offset: number): string | undefined {
    if (this.currentCharIndex + offset >= this.sourceText.length) {
      return undefined;
    }
    return this.sourceText[this.currentCharIndex + offset];
  }

  private getNextCharacter(): string | undefined {
    if (this.currentCharIndex >= this.sourceText.length) {
      return undefined;
    }
    return this.sourceText[this.currentCharIndex + 1];
  }

  private getStringOfNextCharacters(n: number): string {
    if (this.currentCharIndex + n >= this.sourceText.length) {
      return this.sourceText.slice(this.currentCharIndex);
    }
    return this.sourceText.slice(
      this.currentCharIndex,
      this.currentCharIndex + n
    );
  }

  private advanceCurrentCharIndexBy(n: number): void {
    this.currentCharIndex += n;
  }

  private skipWhitespace(): void {
    while (true) {
      const currentChar = this.getCurrentChar();
      const whitespaceChars = new Set([" ", "\t", "\n", "\r"]);

      if (currentChar === undefined) {
        break;
      } else if (whitespaceChars.has(currentChar)) {
        this.advanceCurrentCharIndexBy(1);
      } else {
        break;
      }
    }
  }

  lex(): Token[] {
    const tokens: Token[] = [];

    while (true) {
      this.skipWhitespace();

      const currentChar = this.getCurrentChar();

      if (currentChar === undefined) {
        break;
      }

      const matchOpenParen = this.gobbleMatchingChars("(");
      if (matchOpenParen) {
        tokens.push({ type: "open_paren" });
        continue;
      }

      const matchCloseParen = this.gobbleMatchingChars(")");
      if (matchCloseParen) {
        tokens.push({ type: "close_paren" });
        continue;
      }

      const matchOpenBrace = this.gobbleMatchingChars("{");
      if (matchOpenBrace) {
        tokens.push({ type: "open_brace" });
        continue;
      }

      const matchCloseBrace = this.gobbleMatchingChars("}");
      if (matchCloseBrace) {
        tokens.push({ type: "close_brace" });
        continue;
      }

      const matchSemicolon = this.gobbleMatchingChars(";");
      if (matchSemicolon) {
        tokens.push({ type: "semicolon" });
        continue;
      }

      const matchInt = this.gobbleMatchingChars("int");
      if (matchInt) {
        tokens.push({ type: "int" });
        continue;
      }

      const matchVoid = this.gobbleMatchingChars("void");
      if (matchVoid) {
        tokens.push({ type: "void" });
        continue;
      }

      const matchReturn = this.gobbleMatchingChars("return");
      if (matchReturn) {
        tokens.push({ type: "return" });
        continue;
      }

      const matchIdentifierStartingChar = this.gobbleMatchingChars(/[a-zA-Z]/);
      if (matchIdentifierStartingChar) {
        const matchRemainingIdentifierChars =
          this.gobbleMatchingChars(/[a-zA-Z0-9_]/);

        tokens.push({
          type: "identifier",
          name: `${matchIdentifierStartingChar}${
            matchRemainingIdentifierChars || ""
          }`,
        });
        continue;
      }

      const matchNumberConstant = this.gobbleMatchingChars(/[0-9]/);
      if (matchNumberConstant) {
        const matchDecimalPoint = this.gobbleMatchingChars(".");
        let matchRemainingNumberChars: string | undefined;

        if (matchDecimalPoint) {
          matchRemainingNumberChars = this.gobbleMatchingChars(/[0-9]/);
          if (!matchRemainingNumberChars) {
            throw new CompilerError("lex", "Invalid number");
          }
        }

        const nextChar = this.getNextCharacter();
        if (nextChar?.match(/[a-zA-Z0-9_]/)) {
          throw new CompilerError("lex", "Invalid number");
        }

        tokens.push({
          type: "constant",
          value: parseFloat(
            `${matchNumberConstant}${matchDecimalPoint || ""}${
              matchRemainingNumberChars || ""
            }`
          ),
        });
        continue;
      }

      throw new CompilerError("lex", `Unknown character: ${currentChar}`);
    }

    return tokens;
  }
}

export default Lexer;
