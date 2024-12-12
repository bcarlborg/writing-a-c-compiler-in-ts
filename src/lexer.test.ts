import { lex } from "./lexer";

describe("Lexer", () => {
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
});
