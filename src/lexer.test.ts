import { CompilerError } from "./helpers/logging";
import { lex } from "./lexer";

describe("Lexer", () => {
  describe("lexing identifiers", () => {
    it("should lex a simple identifier", () => {
      expect(lex("main")).toEqual([{ type: "identifier", name: "main" }]);
    });

    it("should lex an identifier with a number", () => {
      expect(lex("main123")).toEqual([{ type: "identifier", name: "main123" }]);
    });

    it("should lex an identifier with an underscore", () => {
      expect(lex("main_123")).toEqual([
        { type: "identifier", name: "main_123" },
      ]);
    });

    it("throws a compiler error for invalid identifiers", () => {
      expect(() => lex("_foobar")).toThrow(CompilerError);
      expect(() => lex("1foobar")).toThrow(CompilerError);
    });
  });

  describe("lexing numbers", () => {
    it("should lex a simple number", () => {
      expect(lex("42")).toEqual([{ type: "constant", value: 42 }]);
    });

    it("should lex a number with a decimal point", () => {
      expect(lex("42.0")).toEqual([{ type: "constant", value: 42.0 }]);
    });

    it("should throw a compiler error for invalid numbers", () => {
      expect(() => lex("42.0.0")).toThrow(CompilerError);
      expect(() => lex(".42")).toThrow(CompilerError);
      expect(() => lex("0.")).toThrow(CompilerError);
    });
  });

  describe("lexing programs", () => {
    it("should lex a simple program", () => {
      const tokens = lex("int main() { return 42; }");
      expect(tokens).toEqual([
        { type: "int" },
        { type: "identifier", name: "main" },
        { type: "open_paren" },
        { type: "close_paren" },
        { type: "open_brace" },
        { type: "return" },
        { type: "constant", value: 42 },
        { type: "semicolon" },
        { type: "close_brace" },
      ]);
    });

    it("lexes a prematurely terminated block", () => {
      const tokens = lex("int main(void) { return");
      expect(tokens).toEqual([
        { type: "int" },
        { type: "identifier", name: "main" },
        { type: "open_paren" },
        { type: "void" },
        { type: "close_paren" },
        { type: "open_brace" },
        { type: "return" },
      ]);
    });

    it("should lex an empty program", () => {
      const tokens = lex("");
      expect(tokens).toEqual([]);
    });
  });
});
