/*
 * Responsible of parsing the tokenized source code
 */

import {
  Statement,
  Program,
  NumericLiteral,
  BinaryExpression,
  Identifier,
  Expression,
  VariableDeclaration,
  AssignmentExpression,
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
      console.log("Parser Error:", error, prev, "expecting", type);
      process.exit();
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
    switch (this.currentToken().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVariableDeclaration();
      default:
        return this.parseExpression();
    }
  }

  private parseVariableDeclaration(): Statement {
    const isConstant = this.eat().type == TokenType.Const;
    const indentifier = this.expect(
      TokenType.Identifier,
      "Expected indentifier named following Let or Const keyword."
    ).value;

    if (this.currentToken().type == TokenType.Semicolon) {
      this.eat();
      if (isConstant)
        throw "Must assign value to Constant variables. No value provided.";

      return {
        kind: "VariableDeclaration",
        indentifier,
        constant: false,
      } as VariableDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token following indentifier in variable declaration."
    );

    const declaration = {
      kind: "VariableDeclaration",
      value: this.parseExpression(),
      constant: isConstant,
      indentifier,
    } as VariableDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Variable declaration statement must end with semicolon"
    );
    return declaration;
  }

  private parseExpression(): Expression {
    return this.parseAssignmentExpression()
  }

  private parseAssignmentExpression(): Expression {
    const left = this.parseAdditiveExpression();
    if (this.currentToken().type == TokenType.Equals) {
      this.eat();
      const value = this.parseAssignmentExpression();

      return {kind: "AssignmentExpression", value, assignee: left} as AssignmentExpression
    }
    return left;
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

      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      case TokenType.OpenParan: {
        this.eat();
        const value = this.parseExpression();
        this.expect(
          TokenType.CloseParan,
          "Unexpected token found inside paranthesised expression. Expected closing paranthesis."
        );
        return value;
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
