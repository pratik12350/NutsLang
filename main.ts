import Parser from "./frontend/parser";
import prompt from "prompt-sync";
import {evaluate} from "./runtime/interpreter";

repl();

function repl() {
  const parser = new Parser();
  console.log("\nNutsLang REPL v0.1");

  while (true) {
    const input = prompt()("> ");

    if (!input || input.includes("exit")) {
      console.log("Exiting...");
      process.exit();
    }

    const program = parser.produceAST(input);
    // console.log(program);

    const result = evaluate(program);
    console.log(result)
  }
}
