const chalk = require("chalk");
const prompt = require("prompt-sync")({ sigint: true });
const game = require("./game");

const field = game.generateField();

let nextMove;

do {
  field.print();

  nextMove = prompt("Move? (u=up, d=down, l=left, r=right, q=quit)");
  if (nextMove == "q") break;

  try {
    field.move(nextMove);
  } catch (ex) {
    ex.indexOf("win") > 0
      ? console.log(chalk.greenBright(ex))
      : console.log(chalk.red(ex));
    break;
  }
} while (true);
