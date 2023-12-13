/*
 * Lexer module file for tokenizing the source code
 */

import {readFileSync} from "fs";

export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParan,
  CloseParan,
  BinaryOperator,
  Let,
  Null,
  EOF,
}

const RESERVED_KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(type: TokenType, value = ""): Token {
  /*
   * Returns the Token object of the character. Made this function to make the code more readable and to follow DRY rule.
   */
  return {
    type,
    value,
  };
}

function isSkippable(str: string): boolean {
  return str == " " || str == "\n" || str == "\t";
}

function isAlphabet(str: string): boolean {
  return str.toUpperCase() != str.toLowerCase();
}

function isInt(str: string): boolean {
  let charCode = str.charCodeAt(0);
  let bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return charCode >= bounds[0] && charCode <= bounds[1];
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(TokenType.OpenParan, src.shift()));
    } else if (src[0] == ")") {
      tokens.push(token(TokenType.CloseParan, src.shift()));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(TokenType.BinaryOperator, src.shift()));
    } else if (src[0] == "=") {
      tokens.push(token(TokenType.Equals, src.shift()));
    } else {
      // Multi-character token building using functions to indentify them

      if (isInt(src[0])) {
        let num = "";
        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }
        tokens.push(token(TokenType.Number, num));
      } else if (isAlphabet(src[0])) {
        let indentifier = "";
        while (src.length > 0 && isAlphabet(src[0])) {
          indentifier += src.shift();
        }

        // Check if the token is a reserved keyword, if its not then build the token with Indentifier type anf if its reserved keyword then build it with the type corresponding to the keyword from RESERVED_KEYWORDS dictionary
        const reservedKeyword = RESERVED_KEYWORDS[indentifier];
        if (typeof reservedKeyword == "number") {
          tokens.push(token(TokenType.Identifier, indentifier));
        } else {
          tokens.push(token(reservedKeyword, indentifier));
        }
      } else if (isSkippable(src[0])) {
        // Skips any spaces, newline characters, tabs
        src.shift();
      } else {
        console.log("Unexpected character in source code:", src[0]);
        process.exit();
      }
    }
  }

  tokens.push({
    type: TokenType.EOF,
    value: "EndOfFile",
  });
  return tokens;
}

/*
const testSource = readFileSync("./test.nuts").toString();
// console.log(testSource.toString())
for (const tokens of tokenize(testSource)) {
  console.log(tokens);
}*/
