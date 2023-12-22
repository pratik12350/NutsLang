import { Program, VariableDeclaration } from "../../frontend/AST";
import { CREATE_NULL } from "../../utils/createValue";
import Enviorment from "../enviorment";
import { evaluate } from "../interpreter";
import { RuntimeValue } from "../values";

export function evalProgram(program: Program, env: Enviorment): RuntimeValue {
  let lastEvaluated: RuntimeValue = CREATE_NULL();

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

export function evalVariableDeclaration(
  declaration: VariableDeclaration,
  env: Enviorment
): RuntimeValue {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : CREATE_NULL();

  return env.declareVariable(
    declaration.indentifier,
    value,
    declaration.constant
  );
}
