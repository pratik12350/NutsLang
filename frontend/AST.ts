// AST TYPES

export type NodeType =
  // Statement
  | "Program"
  | "VariableDeclaration"

  // Expression
  | "AssignmentExpression"
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

// interface for variable declarations
export interface VariableDeclaration extends Statement {
  kind: "VariableDeclaration";
  constant: boolean;
  indentifier: string;
  value?: Expression;
}

export interface Expression extends Statement {}


export interface AssignmentExpression extends Expression {
  kind: "AssignmentExpression";
  assignee: Expression;
  value: Expression
}


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
