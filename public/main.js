import { Board } from "./Pathfinding";
import { AnimateLines } from "./Sorting";

// PATHFINDING

// Initialise the board
// Board(width, height)
// Recommend to leave at 50, 25
let newBoard = new Board(50, 25);
newBoard.initialise();

// After board has been initialised we get buttons to control the visualiser
const dijkstraButton = document.getElementById("dijkstra");
if (dijkstraButton) {
  dijkstraButton.onclick = () => {
    newBoard.visualiseDijkstra();
  };
}
const aStarButton = document.getElementById("astar");
if (aStarButton) {
  aStarButton.onclick = () => {
    newBoard.visualiseAStar();
  };
}
const BFSButton = document.getElementById("bfs");
if (BFSButton) {
  BFSButton.onclick = () => {
    newBoard.visualiseBFS();
  };
}
const DFSButton = document.getElementById("dfs");
if (DFSButton) {
  DFSButton.onclick = () => {
    newBoard.visualiseDFS();
  };
}
const resetBoardButton = document.getElementById("reset");
if (resetBoardButton) {
  resetBoardButton.onclick = () => {
    newBoard.initialise();
  };
}
const randomWallsButton = document.getElementById("random-walls");
if (randomWallsButton) {
  randomWallsButton.onclick = () => {
    newBoard.randomWalls();
  };
}
const clearAlgorithmButton = document.getElementById("clear-algorithm");
if (clearAlgorithmButton) {
  clearAlgorithmButton.onclick = () => {
    newBoard.clearAlgorithm();
  };
}
const recursiveDivisionMazeButton = document.getElementById(
  "recursive-division-maze"
);
if (recursiveDivisionMazeButton) {
  recursiveDivisionMazeButton.onclick = () => {
    newBoard.recursiveDivisionMazeHandler();
  };
}

// SORTING

// Grab canvas to pass into AnimateLines class
const canvas = document.getElementById("main-canvas");

// Initialising lines by passing in a html canvas
// AnimateLines requires a html canvas to work properly
let newLines = new AnimateLines(canvas);
newLines.initialise();

// After board has been initialised we get buttons to use the sorting controls
const pauseController = document.getElementById("pause-step");
if (pauseController) {
  pauseController.onclick = () => {
    setPlayButton();
  };
}

const numberOfLines = document.getElementById("number-of-lines");
if (numberOfLines) {
  numberOfLines.onchange = e => {
    newLines.setNumberOfLines(e.target.value);
  };
}

const newArray = document.getElementById("new-array");
if (newArray) {
  newArray.onclick = () => {
    newLines.cancelAnimation();
    newLines.initialise();
  };
}

const bubbleButton = document.getElementById("bubble-sort");
if (bubbleButton) {
  bubbleButton.onclick = () => {
    newLines.bubbleSort(newLines.lineArray);
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  };
}

const selectionButton = document.getElementById("selection-sort");
if (selectionButton) {
  selectionButton.onclick = () => {
    newLines.selectionSort(newLines.lineArray);
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  };
}

const insertionButton = document.getElementById("insertion-sort");
if (insertionButton) {
  insertionButton.onclick = () => {
    newLines.insertionSort(newLines.lineArray);
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  };
}

const quickSortButton = document.getElementById("quicksort");
if (quickSortButton) {
  quickSortButton.onclick = () => {
    newLines.quickSortHelper(
      newLines.lineArray,
      0,
      newLines.lineArray.length - 1
    );
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  };
}

const mergeSortButton = document.getElementById("merge-sort");
if (mergeSortButton) {
  mergeSortButton.onclick = () => {
    newLines.mergeSortHelper(
      newLines.lineArray,
      0,
      newLines.lineArray.length - 1
    );
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  };
}

const heapSortButton = document.getElementById("heap-sort");
if (heapSortButton) {
  heapSortButton.onclick = () => {
    newLines.heapSort(newLines.lineArray, 0, newLines.lineArray.length - 1);
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  };
}

const speedController = document.getElementById("change-speed");
if (speedController) {
  speedController.onchange = e => {
    newLines.changeSpeed(e.target.value);
  };
}

const nextController = document.getElementById("next-step");
if (nextController) {
  nextController.onclick = () => {
    if (newLines.playing === false) {
      newLines.nextStep();
    } else {
      return;
    }
  };
}

const setPlayButton = () => {
  if (newLines.playing === false) {
    pauseController.innerText = "||";
    newLines.cancelAnimation();
    newLines.startAnimation();
    pauseController.innerText = "||";
  } else if (newLines.playing === true) {
    pauseController.innerText = ">";
    newLines.cancelAnimation();
  }
};

const resetController = document.getElementById("reset-lines");
if (resetController) {
  resetController.onclick = () => {
    newLines.reset();
    newLines.playing === false;
    pauseController.innerText = ">";
  };
}
