import {ValueType, RuntimeValue, NumberValue, NullValue} from './values';
import {BinaryExpression, Identifier, NodeType, NumericLiteral, Program, Statement} from '../frontend/AST';
import {CREATE_NULL, CREATE_NUMBER} from "../utils/createValue";
import Enviorment from './enviorment';


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

  return CREATE_NUMBER(result);
}


function evalBinaryExpression(binaryExp: BinaryExpression, env: Enviorment): RuntimeValue {
  const LHS = evaluate(binaryExp.left, env);
  const RHS = evaluate(binaryExp.right, env);

  if (LHS.type == "number" && RHS.type == "number") {
    return evalNumericBinaryExp(LHS as NumberValue, RHS as NumberValue, binaryExp.operator)
  }

  return CREATE_NULL()
};


function evalProgram(program: Program, env: Enviorment): RuntimeValue {
  let lastEvaluated: RuntimeValue = CREATE_NULL()

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
};

function evalIdentifier(identifier: Identifier, env: Enviorment): RuntimeValue {
  const val = env.lookupVariable(identifier.symbol);
  return val;
}


export function evaluate(ASTNode: Statement, env: Enviorment): RuntimeValue {
  switch (ASTNode.kind) {
    case "NumericLiteral":
      return {
        type: "number",
        value: ((ASTNode as NumericLiteral).value)
      } as NumberValue;
    case "Identifier":
      return evalIdentifier(ASTNode as Identifier, env);
    case "BinaryExpression":
      return evalBinaryExpression(ASTNode as BinaryExpression, env);
    case "Program":
      return evalProgram(ASTNode as Program, env)
    default:
      console.error("That AST Node not added yet", ASTNode)
      process.exit();
  }
}
