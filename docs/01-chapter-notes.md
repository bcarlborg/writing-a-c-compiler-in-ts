# Chapter 1 Notes

## Notes from first read through

- The compiler has four stages to get from the input C program to an assembly file: (1) lexing (2) parsing (3) assembly generation (4) code emmision.
  - assembly generation and code emission may sound the same, but they have different outputs. Assembly generation takes an ast as input and generates assembly code represented as some sort of structured object (not text). Code emission takes that sructured version of assembly and transforms it into text.
- Who calls main?
  - The linker adds a bit of wrapper code called crt0 that handles setup before main gets called and teardown after it returns.
