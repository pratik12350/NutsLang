import { ValueType, RuntimeValue, NumberValue, NullValue } from "./values";
import {
  BinaryExpression,
  Identifier,
  NodeType,
  NumericLiteral,
  Program,
  Statement,
  VariableDeclaration,
} from "../frontend/AST";
import Enviorment from "./enviorment";
import { evalBinaryExpression, evalIdentifier } from "./eval/expression";
import { evalProgram, evalVariableDeclaration } from "./eval/statement";

export function evaluate(ASTNode: Statement, env: Enviorment): RuntimeValue {
  switch (ASTNode.kind) {
    case "NumericLiteral":
      return {
        type: "number",
        value: (ASTNode as NumericLiteral).value,
      } as NumberValue;
    case "Identifier":
      return evalIdentifier(ASTNode as Identifier, env);
    case "BinaryExpression":
      return evalBinaryExpression(ASTNode as BinaryExpression, env);
    case "Program":
      return evalProgram(ASTNode as Program, env);
    case "VariableDeclaration":
      return evalVariableDeclaration(ASTNode as VariableDeclaration, env);
    default:
      console.error("That AST Node not added yet", ASTNode);
      process.exit();
  }
}
