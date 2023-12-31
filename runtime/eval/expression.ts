import {AssignmentExpression, BinaryExpression, Identifier} from "../../frontend/AST";
import {CREATE_NULL, CREATE_NUMBER} from "../../utils/createValue";
import Enviorment from "../enviorment";
import {evaluate} from "../interpreter";
import {NumberValue, RuntimeValue} from "../values";

export function evalIdentifier(
  identifier: Identifier,
  env: Enviorment
): RuntimeValue {
  const val = env.lookupVariable(identifier.symbol);
  return val;
}

function evalNumericBinaryExp(
  LHS: NumberValue,
  RHS: NumberValue,
  operator: string
): NumberValue {
  let result = 0;
  if (operator == "+") {
    result = LHS.value + RHS.value;
  } else if (operator == "-") {
    result = LHS.value - RHS.value;
  } else if (operator == "*") {
    result = LHS.value * RHS.value;
  } else if (operator == "/") {
    // TODO: Checks for division by zero
    result = LHS.value / RHS.value;
  } else if (operator == "%") {
    result = LHS.value % RHS.value;
  }

  return CREATE_NUMBER(result);
}

export function evalBinaryExpression(
  binaryExp: BinaryExpression,
  env: Enviorment
): RuntimeValue {
  const LHS = evaluate(binaryExp.left, env);
  const RHS = evaluate(binaryExp.right, env);

  if (LHS.type == "number" && RHS.type == "number") {
    return evalNumericBinaryExp(
      LHS as NumberValue,
      RHS as NumberValue,
      binaryExp.operator
    );
  }

  return CREATE_NULL();
}


export function evalAssignment(node: AssignmentExpression, env: Enviorment): RuntimeValue {
  if (node.assignee.kind != "Identifier") {
    throw `Invalid LHS inside Assignment expression. ${JSON.stringify(node.assignee)}`
  }

  const varname = (node.assignee as Identifier).symbol;
  return env.assignVariable(varname, evaluate(node.value, env))
}
