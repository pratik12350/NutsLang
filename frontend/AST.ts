// AST TYPES

export type NodeType =
  | "Program"
  | "Identifier"
  | "NumericLiteral"
  | "BinaryExpression"
  | "CallExpression";

export interface Statement {
  kind: NodeType;
}

// interface for the source code (array of tokens)
export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface Expression extends Statement {}

// Interface for any number like 42, 45, 69, etc
export interface NumericLiteral extends Expression {
  kind: "NumericLiteral";
  value: number;
}

// Interface for BinaryExpression like 4 + 5, 7000 / 3, etc
export interface BinaryExpression extends Expression {
  kind: "BinaryExpression";
  left: Expression;
  right: Expression;
  operator: string;
}

// self-explanatory lol
export interface Identifier extends Expression {
  kind: "Identifier";
  symbol: string;
}

