// Recursive Division Maze
export const recursiveDivisionMaze = (
  board,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  orientation,
  surroundingWalls,
  height,
  width
) => {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  // Add the surrounding walls to make the maze generation process simpler
  if (!surroundingWalls) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (row === 0 || col === 0 || row === height - 1 || col === width - 1) {
          let currentHTMLNode = document.getElementById(`${row}-${col}`);
          board.wallsToAnimate.push(currentHTMLNode);
        }
      }
    }
    surroundingWalls = true;
  }

  if (orientation === "horizontal") {
    // Possible rows that could be draw
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }

    // Possible columns that could be draw
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }

    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let randomColGap = possibleCols[randomColIndex];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (
          row === currentRow &&
          col !== randomColGap &&
          col >= colStart - 1 &&
          col <= colEnd + 1
        ) {
          let currentHTMLNode = document.getElementById(`${row}-${col}`);
          if (
            currentHTMLNode.className !== "node start" &&
            currentHTMLNode.className !== "node finish"
          ) {
            board.wallsToAnimate.push(currentHTMLNode);
          }
        }
      }
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(
        board,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        orientation,
        surroundingWalls,
        height,
        width
      );
    } else {
      recursiveDivisionMaze(
        board,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        "vertical",
        surroundingWalls,
        height,
        width
      );
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(
        board,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        orientation,
        surroundingWalls,
        height,
        width
      );
    } else {
      recursiveDivisionMaze(
        board,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        "vertical",
        surroundingWalls,
        height,
        width
      );
    }
  } else {
    // Possible rows that could be draw
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }

    // Possible columns that could be draw
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }

    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentCol = possibleCols[randomColIndex];
    let randomRowGap = possibleRows[randomRowIndex];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (
          col === currentCol &&
          row !== randomRowGap &&
          row >= rowStart - 1 &&
          row <= rowEnd + 1
        ) {
          let currentHTMLNode = document.getElementById(`${row}-${col}`);
          if (
            currentHTMLNode.className !== "node start" &&
            currentHTMLNode.className !== "node finish"
          ) {
            board.wallsToAnimate.push(currentHTMLNode);
          }
        }
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(
        board,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        "horizontal",
        surroundingWalls,
        height,
        width
      );
    } else {
      recursiveDivisionMaze(
        board,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        orientation,
        surroundingWalls,
        height,
        width
      );
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(
        board,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        "horizontal",
        surroundingWalls,
        height,
        width
      );
    } else {
      recursiveDivisionMaze(
        board,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        orientation,
        surroundingWalls,
        height,
        width
      );
    }
  }
};
