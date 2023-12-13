/*
 * Responsible of parsing the tokenized source code
 */

import {
  Statement,
  Program,
  NumericLiteral,
  NullLiteral,
  BinaryExpression,
  Identifier,
  Expression,
} from "./AST";

import {Token, tokenize, TokenType} from "./lexer";

export default class Parser {
  private tokens: Token[] = [];

  private notEOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private currentToken() {
    return this.tokens[0] as Token;
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType, error: any) {
    const prev = this.tokens.shift();
    if (!prev || prev.type != type) {
      console.log("Parser Error:", error, prev, "expecting", type)
      process.exit()
    }
    return prev;
  }

  public produceAST(srcCode: string): Program {
    this.tokens = tokenize(srcCode);

    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.notEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private parseStatement(): Statement {
    // Leaving it for future, for now lets skip to parseExpression function
    return this.parseExpression();
  }

  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }

  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();

    while (
      this.currentToken().value == "+" ||
      this.currentToken().value == "-"
    ) {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpression();

      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }
    return left;
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();
    while (
      this.currentToken().value == "/" ||
      this.currentToken().value == "*" ||
      this.currentToken().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }
    return left;
  }

  private parsePrimaryExpression(): Expression {
    const tk = this.currentToken().type;
    switch (tk) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.eat().value,
        } as Identifier;

      case TokenType.Null:
        this.eat();
        return {
          kind: "NullLiteral",
          value: "null"
        } as NullLiteral;

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case TokenType.OpenParan: {
        this.eat();
        const value = this.parseExpression();
        this.expect(TokenType.CloseParan, "Unexpected token found inside paranthesised expression. Expected closing paranthesis.")
        return value
      }

      default:
        console.error(
          "Unexpected token found during parsing:",
          this.currentToken()
        );
        process.exit();
    }
  }
}
