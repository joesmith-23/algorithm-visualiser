// NODE class
export class Node {
  constructor(
    row,
    col,
    isStart,
    isFinish,
    isVisited,
    isWall,
    distance,
    previousNode,
    fScore,
    gScore,
    hScore
  ) {
    this.id = `${row}-${col}`;
    this.row = row;
    this.col = col;
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.isVisited = isVisited;
    this.isWall = isWall;
    this.distance = distance;
    this.previousNode = previousNode;
    this.gScore = gScore;
    this.fScore = fScore;
    this.hScore = hScore;
  }
}
