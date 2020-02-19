// A*
export const aStar = (grid, startNode, finishNode) => {
  let startTime = Date.now();

  const openNodes = [startNode];
  const closedNodes = [];

  while (openNodes.length > 0) {
    // Sort the nodes by fScore
    openNodes.sort((a, b) => a.fScore - b.fScore);

    // Take the first node in the sorted array (the one with the lowest fScore)
    const currentNode = openNodes.shift();

    // Add current node to closedNodes
    closedNodes.push(currentNode);

    // Check currentNode vs finishNode
    if (currentNode === finishNode) {
      let timeTaken = `${Date.now() - startTime}`;
      return [closedNodes, timeTaken];
    }

    // Get neighbours of currentNode
    const neighbours = getNeighbours(currentNode, grid);

    // Loop over neighbours
    neighbours.forEach(neighbour => {
      // Check if neighbour is a wall or in closedNodes
      if (neighbour.isWall || closedNodes.includes(neighbour)) {
        return;
      }

      //Set gScore
      let gScore = currentNode.gScore + 1;
      let gScoreIsBest = false;

      if (!openNodes.includes(neighbour)) {
        gScoreIsBest = true;
        neighbour.hScore = hScore(neighbour, finishNode);
        openNodes.push(neighbour);
      } else if (gScore < neighbour.gScore) {
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        neighbour.previousNode = currentNode;
        neighbour.gScore = gScore;
        neighbour.fScore = neighbour.gScore + neighbour.hScore;
      }
    });
  }
  let timeTaken = `${Date.now() - startTime}`;
  return [closedNodes, timeTaken];
};

// Currently using manattan distance
// TODO - add euclidian distance as an option
const hScore = (currentNode, finishNode) => {
  const x_distance = Math.abs(currentNode.row - finishNode.row);
  const y_distance = Math.abs(currentNode.col - finishNode.col);
  const overall_distance = x_distance + y_distance;

  return overall_distance;
};

const getNeighbours = (node, grid) => {
  const neighbours = [];
  const col = node.col;
  const row = node.row;
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
};

export const shortestPathAStar = finishNode => {
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPath;
};
