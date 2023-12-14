import {ValueType, RuntimeValue, NumberValue, NullValue} from './values'
import {BinaryExpression, NodeType, NumericLiteral, Program, Statement} from '../frontend/AST'


function evalNumericBinaryExp(LHS: NumberValue, RHS: NumberValue, operator: string): NumberValue {
  let result = 0;
  if (operator == "+") {
    result = LHS.value + RHS.value
  } else if (operator == "-") {
    result = LHS.value - RHS.value
  } else if (operator == "*") {
    result = LHS.value * RHS.value
  } else if (operator == "/") {
    // TODO: Checks for division by zero
    result = LHS.value / RHS.value
  } else if (operator == "%") {
    result = LHS.value % RHS.value
  }

  return {value: result, type: "number"};
}


function evalBinaryExpression(binaryExp: BinaryExpression): RuntimeValue {
  const LHS = evaluate(binaryExp.left);
  const RHS = evaluate(binaryExp.right);

  if (LHS.type == "number" && RHS.type == "number") {
    return evalNumericBinaryExp(LHS as NumberValue, RHS as NumberValue, binaryExp.operator)
  }

  return {type: "null", value: "null"} as NullValue;
};


function evalProgram(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = {type: "null", value: "null"} as NullValue;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }
  return lastEvaluated;
};


export function evaluate(ASTNode: Statement): RuntimeValue {
  switch (ASTNode.kind) {
    case "NumericLiteral":
      return {
        type: "number",
        value: ((ASTNode as NumericLiteral).value)
      } as NumberValue;
    case "NullLiteral":
      return {type: "null", value: "null"} as NullValue;
    case "BinaryExpression":
      return evalBinaryExpression(ASTNode as BinaryExpression);
    case "Program":
      return evalProgram(ASTNode as Program)
    default:
      console.error("That AST Node not added yet", ASTNode)
      process.exit();
  }
}
