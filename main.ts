import Parser from "./frontend/parser";
import prompt from "prompt-sync";
import { evaluate } from "./runtime/interpreter";
import Enviorment from "./runtime/enviorment";
import { CREATE_BOOL, CREATE_NULL, CREATE_NUMBER } from "./utils/createValue";
import { NumberValue } from "./runtime/values";

repl();

function repl() {
  const parser = new Parser();
  const env = new Enviorment();

  // env.declareVariable("x", CREATE_NUMBER(100) as NumberValue);
  // env.declareVariable("y", CREATE_NULL());
  //env.declareVariable("z", CREATE_BOOL(true));

  console.log("\nNutsLang REPL v0.1");

  while (true) {
    const input = prompt()("> ");

    if (!input || input.includes("exit")) {
      console.log("Exiting...");
      process.exit();
    }

    const program = parser.produceAST(input);
    // console.log(program);

    const result = evaluate(program, env);
    console.log(result);
  }
}
