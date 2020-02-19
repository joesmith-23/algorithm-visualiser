// Breadth-First Search
export const BFS = (grid, startNode, finishNode) => {
  let startTime = Date.now();
  const visitedNodes = [];
  startNode.isVisited = true;
  startNode.distance = 0;
  const queue = [startNode];

  while (queue.length > 0) {
    const currentNode = queue.pop();
    const neighbours = getBFSNeighbours(currentNode, grid);
    if (currentNode === finishNode) {
      let timeTaken = `${Date.now() - startTime}`;
      return [visitedNodes, timeTaken];
    }

    neighbours.forEach(neighbour => {
      if (neighbour.isWall) return;
      neighbour.isVisited = true;
      visitedNodes.push(neighbour);
      neighbour.distance = currentNode.distance + 1;
      neighbour.previousNode = currentNode;
      queue.unshift(neighbour);
    });
  }
  let timeTaken = `${Date.now() - startTime}`;
  return [visitedNodes, timeTaken];
};

const getBFSNeighbours = (node, grid) => {
  const neighbours = [];
  const col = node.col;
  const row = node.row;
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
};

export const shortestPathBFS = finishNode => {
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPath;
};
