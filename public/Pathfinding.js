import { dijkstra, shortestPath } from "./algorithms/dijkstra";
import { aStar, shortestPathAStar } from "./algorithms/astar";
import { BFS, shortestPathBFS } from "./algorithms/BFS";
import { DFS, shortestPathDFS } from "./algorithms/DFS";
import { recursiveDivisionMaze } from "./algorithms/recursiveDivisionMaze";
import { Node } from "./helpers/Node";

export class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.startRow = 10;
    this.startCol = 5;
    this.finishRow = 10;
    this.finishCol = 45;
    this.grid = null;
    this.mouseDown = false;
    this.mouseDownStart = false;
    this.mouseDownFinish = false;
    this.wallsToAnimate = [];
    this.prevNode = null;
    this.distance = null;
    this.algoTime = null;
    this.animating = null;
    this.animatingPath = null;
  }

  initGrid = (setRandomWalls = false, oldGrid) => {
    const gridContainer = document.querySelector(".grid-container");
    if (gridContainer) {
      let gridHtml = "<div class='main-grid'>";
      const grid = [];
      for (let row = 0; row < this.height; row++) {
        let currentRowHtml = `<div id="row-${row}" class="row">`;
        const newRowArray = [];
        for (let col = 0; col < this.width; col++) {
          let isWall = false;
          if (setRandomWalls === true) {
            isWall = Math.random() > 0.75 ? true : false;
          }

          if (oldGrid) {
            // This preserves the old wall config
            const oldWall = oldGrid[row][col].isWall;
            isWall = oldWall;
          }

          const newNode = new Node(
            row,
            col,
            row === this.startRow && col === this.startCol,
            row === this.finishRow && col === this.finishCol,
            false,
            isWall,
            Infinity,
            null,
            null,
            null,
            null
          );
          newRowArray.push(newNode);
          currentRowHtml += `<div id="${newNode.id}" class="node ${
            newNode.isStart === true
              ? "start"
              : newNode.isFinish === true
              ? "finish"
              : newNode.isWall === true
              ? "wall"
              : newNode.isVisited === true
              ? "visited"
              : ""
          }"></div>`;
        }
        grid.push(newRowArray);
        currentRowHtml += `</div>`;
        gridHtml += currentRowHtml;
      }
      gridHtml += `</div>`;
      gridContainer.innerHTML = gridHtml;
      this.grid = grid;
    }
  };

  addEventListeners = () => {
    if (this.grid) {
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          let currentId = `${row}-${col}`;
          let currentElement = document.getElementById(currentId);

          currentElement.onmousedown = () => {
            this.mouseDown = true;
            this.prevNode = this.grid[row][col];
            if (this.grid[row][col].isStart || this.grid[row][col].isFinish) {
              if (this.grid[row][col].isStart) {
                this.mouseDownStart = true;
              } else if (this.grid[row][col].isFinish) {
                this.mouseDownFinish = true;
              }
            } else {
              const node = this.grid[row][col];
              const newNode = new Node(
                row,
                col,
                row === this.startRow && col === this.startCol,
                row === this.finishRow && col === this.finishCol,
                false,
                !node.isWall,
                Infinity,
                null,
                null,
                null,
                null
              );
              this.grid[row][col] = newNode;
              currentElement.classList.toggle("wall");
            }
          };

          currentElement.onmouseenter = () => {
            if (this.mouseDown) {
              if (
                (this.mouseDownStart && this.grid[row][col].isFinish) ||
                (this.mouseDownFinish && this.grid[row][col].isStart)
              ) {
                // currentElement = this.previousElement;
                return;
              }
              if (this.grid[row][col].isStart && this.grid[row][col].isFinish) {
                return;
              }
              if (this.mouseDownStart && this.grid[row][col].isFinish) return;
              if (this.mouseDownStart || this.mouseDownFinish) {
                this.prevNode = this.grid[row][col];

                const newNode = new Node(
                  row,
                  col,
                  this.mouseDownStart ? true : false,
                  this.mouseDownFinish ? true : false,
                  false,
                  false,
                  Infinity,
                  null,
                  null,
                  null,
                  null
                );
                this.grid[row][col] = newNode;
                currentElement.classList.toggle(
                  `${this.mouseDownStart ? "start" : "finish"}`
                );
                if (this.mouseDownStart) {
                  this.startRow = row;
                  this.startCol = col;
                }
                if (this.mouseDownFinish) {
                  this.finishRow = row;
                  this.finishCol = col;
                }
              } else {
                const node = this.grid[row][col];
                const newNode = new Node(
                  row,
                  col,
                  row === this.startRow && col === this.startCol,
                  row === this.finishRow && col === this.finishCol,
                  false,
                  !node.isWall,
                  Infinity,
                  null,
                  null,
                  null,
                  null
                );
                this.grid[row][col] = newNode;
                currentElement.classList.toggle("wall");
              }
            }
          };

          currentElement.onmouseleave = () => {
            if (this.mouseDown) {
              if (
                (this.mouseDownStart && this.grid[row][col].isFinish) ||
                (this.mouseDownFinish && this.grid[row][col].isStart)
              ) {
                // currentElement = this.previousElement;
                return;
              }
              if (this.mouseDownStart || this.mouseDownFinish) {
                let wall = this.prevNode.isWall;

                const newNode = new Node(
                  row,
                  col,
                  false,
                  false,
                  false,
                  wall,
                  Infinity,
                  null,
                  null,
                  null,
                  null
                );
                this.grid[row][col] = newNode;
                currentElement.classList.toggle(
                  `${this.mouseDownStart ? "start" : "finish"}`
                );
              }
            }
          };

          currentElement.onmouseup = () => {
            this.mouseDown = false;
            this.mouseDownStart = false;
            this.mouseDownFinish = false;
          };
        }
      }
    }
  };

  randomWalls = () => {
    // Passing in true as the first argument will enable random walls to be created
    this.initGrid(true);
    this.addEventListeners();
  };

  clearAlgorithm = () => {
    // Passing the grid into initGrid preserves the old walls
    this.initGrid(false, this.grid);
    this.addEventListeners();

    // These don't quite work how I was expecting
    clearTimeout(this.animating);
    clearTimeout(this.animatingPath);
    clearTimeout(this.animatingPathShortest);
  };

  visualiseDijkstra = () => {
    this.clearAlgorithm();
    const startNode = this.grid[this.startRow][this.startCol];
    const finishNode = this.grid[this.finishRow][this.finishCol];
    const returnedArray = dijkstra(this.grid, startNode, finishNode);
    const visitedNodes = returnedArray[0];
    const timeTaken = returnedArray[1];
    const shortestPathNodes = shortestPath(finishNode);
    this.algoTime = timeTaken;
    this.distance = shortestPathNodes.length;
    this.animateAlgorithm("dijkstra", visitedNodes, shortestPathNodes);
  };

  visualiseAStar = () => {
    this.clearAlgorithm();
    const startNode = this.grid[this.startRow][this.startCol];
    const finishNode = this.grid[this.finishRow][this.finishCol];
    const returnedArray = aStar(this.grid, startNode, finishNode);
    const visitedNodes = returnedArray[0];
    const timeTaken = returnedArray[1];
    const shortestPathNodes = shortestPathAStar(finishNode);
    this.algoTime = timeTaken;
    this.distance = shortestPathNodes.length;
    this.animateAlgorithm("aStar", visitedNodes, shortestPathNodes);
  };

  visualiseBFS = () => {
    this.clearAlgorithm();
    const startNode = this.grid[this.startRow][this.startCol];
    const finishNode = this.grid[this.finishRow][this.finishCol];
    const returnedArray = BFS(this.grid, startNode, finishNode);
    const visitedNodes = returnedArray[0];
    const timeTaken = returnedArray[1];
    const shortestPathNodes = shortestPathBFS(finishNode);
    this.algoTime = timeTaken;
    this.distance = shortestPathNodes.length;
    this.animateAlgorithm("dijkstra", visitedNodes, shortestPathNodes);
  };

  visualiseDFS = () => {
    this.clearAlgorithm();
    const startNode = this.grid[this.startRow][this.startCol];
    const finishNode = this.grid[this.finishRow][this.finishCol];
    const returnedArray = DFS(this.grid, startNode, finishNode);
    const visitedNodes = returnedArray[0];
    const timeTaken = returnedArray[1];
    const shortestPathNodes = shortestPathDFS(finishNode);
    this.algoTime = timeTaken;
    this.distance = shortestPathNodes.length;
    this.animateAlgorithm("dijkstra", visitedNodes, shortestPathNodes);
  };

  animateAlgorithm = (type, visitedNodes, shortestPathNodes) => {
    const algoDistance = document.getElementById("algo-distance");
    algoDistance.innerText = `${this.distance} squares`;

    const algoTime = document.getElementById("algo-time");
    algoTime.innerText = `${this.algoTime}ms`;

    for (let i = 0; i < visitedNodes.length; i++) {
      // When we get to the end of the loop:
      if (i === visitedNodes.length - 1) {
        this.animatingPath = setTimeout(() => {
          this.animateShortestPath(shortestPathNodes);
        }, 10 * i);
        return;
      }
      this.animating = setTimeout(() => {
        const node = visitedNodes[i];
        if (node.isStart || node.isFinish) return;

        // Change the alpha value depending on what algorithm was used
        let alphaValue;
        if (type == "dijkstra") {
          alphaValue =
            node.distance /
            Math.sqrt(
              Math.pow(this.width * 1.5, 2) + Math.pow(this.height * 1.5, 2)
            ); // this normalised the alpha value to create the fade effect
        } else if (type == "aStar") {
          alphaValue =
            node.gScore /
            Math.sqrt(
              Math.pow(this.width * 1.5, 2) + Math.pow(this.height * 1.5, 2)
            ); // this normalised the alpha value to create the fade effect
        }

        document.getElementById(
          `${node.row}-${node.col}`
        ).style.background = `rgba(0, 0, 255, ${alphaValue})`;
      }, 10 * i);
    }
  };

  animateShortestPath = shortestPathNodes => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      this.animatingPathShortest = setTimeout(() => {
        const node = shortestPathNodes[i];
        if (node.isStart || node.isFinish) return;
        document.getElementById(
          `${node.row}-${node.col}`
        ).style.background = `rgba(255,255,0,0.9)`;
      }, 50 * i);
    }
  };

  animateWalls = board => {
    const walls = board.wallsToAnimate;

    const timeout = index => {
      this.animatingWalls = setTimeout(() => {
        if (index === walls.length) {
          board.wallsToAnimate = [];
          board.addEventListeners();
          return;
        }
        const row = walls[index].id.split("-")[0];
        const col = walls[index].id.split("-")[1];
        board.grid[row][col].isWall = true;
        walls[index].classList.add("wall");
        timeout(index + 1);
      }, 10);
    };
    timeout(0);
  };

  recursiveDivisionMazeHandler = () => {
    this.initGrid();
    recursiveDivisionMaze(
      this,
      2,
      this.height - 3,
      2,
      this.width - 3,
      "horizontal",
      false,
      this.height,
      this.width
    );
    this.animateWalls(this);
  };

  initialise = () => {
    this.initGrid();
    this.addEventListeners();
  };
}
