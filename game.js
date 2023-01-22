const chalk = require("chalk");

class Field {
  static hat = "^";
  static hole = "O";
  static fieldCharacter = "░";
  static pathCharacter = chalk.blueBright("*");

  constructor(state, playerLocation = { y: 0, x: 0 }) {
    this.state = state;
    this.playerLocation = playerLocation;
  }

  print() {
    this.state.forEach((row, rowNum) => {
      if (this.playerLocation.y == rowNum) {
        // shallow copy the row and put the player on it
        const playerRow = row.map((column, colIndex) => {
          return this.playerLocation.x == colIndex
            ? Field.pathCharacter
            : column;
        });
        console.log(playerRow.join(""));
      } else {
        console.log(row.join(""));
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
    console.log(this.playerLocation);
  };
}

module.exports = class GameFactory {
  static generateField = (height = 10, width = 20, holeRowPercentage = 60) => {
    let rows = [];
    rows.length = height;

    const maxHolesPerRow = (holeRowPercentage / 100) * width;
    console.log(maxHolesPerRow);

    // build the field
    for (let rowNum = 0; rowNum < height; rowNum++) {
      rows[rowNum] = Field.fieldCharacter.repeat(width).split("");

      // add some holes
      const holesForRow = Math.floor(Math.random() * maxHolesPerRow) + 1;
      console.log(holesForRow);
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
