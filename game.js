const chalk = require("chalk");

class Field {
  static hat = chalk.bgYellowBright("^");
  static hole = "O";
  static fieldCharacter = "░";
  static pathCharacter = chalk.bgBlueBright("*");

  constructor(state, playerLocation = { y: 0, x: 0 }) {
    this.state = state; // state of board (not including the actual player location which is maintained separately)
    this.playerLocation = playerLocation;
  }

  print() {
    this.state.forEach((stateRow, rowNum) => {
      if (this.playerLocation.y == rowNum) {
        // player is on this row of game state, so shallow copy the row and include the player/path
        const playerAndStateRow = stateRow.map((column, colIndex) => {
          return this.playerLocation.x == colIndex
            ? Field.pathCharacter
            : column;
        });
        console.log(playerAndStateRow.join(""));
      } else {
        console.log(stateRow.join(""));
      }
    });
  }

  move = (direction) => {
    let newPlayerLocation;
    switch (direction) {
      case "u":
        newPlayerLocation = {
          ...this.playerLocation,
          y: this.playerLocation.y - 1,
        };
        break;
      case "d":
        newPlayerLocation = {
          ...this.playerLocation,
          y: this.playerLocation.y + 1,
        };
        break;
      case "l":
        newPlayerLocation = {
          ...this.playerLocation,
          x: this.playerLocation.x - 1,
        };
        break;
      case "r":
        newPlayerLocation = {
          ...this.playerLocation,
          x: this.playerLocation.x + 1,
        };
        break;
      default:
        newPlayerLocation = { ...this.playerLocation };
        break;
    }

    if (
      !this.state[newPlayerLocation.y] ||
      !this.state[newPlayerLocation.y][newPlayerLocation.x]
    ) {
      throw "Invalid move!";
    } else if (
      this.state[newPlayerLocation.y][newPlayerLocation.x] === Field.hole
    ) {
      throw "You fell in a hole!";
    } else if (
      this.state[newPlayerLocation.y][newPlayerLocation.x] === Field.hat
    ) {
      throw "You win!";
    }

    this.playerLocation = newPlayerLocation;
  };
}

module.exports = class GameFactory {
  static generateField = (height = 10, width = 20, holeRowPercentage = 60) => {
    let rows = [];
    rows.length = height;

    const maxHolesPerRow = (holeRowPercentage / 100) * width;

    // build the field
    for (let rowNum = 0; rowNum < height; rowNum++) {
      rows[rowNum] = Field.fieldCharacter.repeat(width).split("");

      // add some holes
      const holesForRow = Math.floor(Math.random() * maxHolesPerRow) + 1;
      for (let holeCounter = 0; holeCounter < holesForRow; holeCounter++) {
        const holePosition = Math.floor(Math.random() * width);
        rows[rowNum][holePosition] = Field.hole;
      }
    }

    // and finally a hat (somewhere, in lower half of board)
    const hatRowMin = height / 2;
    const hatRow = Math.floor(Math.random() * (height - hatRowMin) + hatRowMin);
    const hatColumn = Math.floor(Math.random() * width);
    rows[hatRow][hatColumn] = Field.hat;

    return new Field(rows);
  };
};
