// Dijkstra
export const dijkstra = (grid, startNode, finishNode) => {
  let startTime = Date.now();
  // Here we're directly changing the startNode's distance to 0
  startNode.distance = 0;
  const visitedNodes = [];
  const unvisitedNodes = grid.flat(Infinity);

  // console.log(unvisitedNodes.sort((a, b) => a.distance - b.distance));

  while (unvisitedNodes.length > 0) {
    // Sort the nodes
    unvisitedNodes.sort((a, b) => a.distance - b.distance);

    // Take the first node in the sorted array - start with startNode (distance = 0)
    const currentNode = unvisitedNodes.shift();

    // If current node is a wall, we skip it (we don't change the distance)
    if (currentNode.isWall) continue;

    // If the current node is at a distance of infinity, we must be trapped and should therefore stop.
    if (currentNode.distance === Infinity) {
      let timeTaken = `${Date.now() - startTime}`;
      return [visitedNodes, timeTaken];
    }

    // Set current node to be visited
    currentNode.isVisited = true;

    // Push it to visited nodes array to be used in figuring out the path
    visitedNodes.push(currentNode);

    // Return visited nodes if we get to the finish node
    if (currentNode === finishNode) {
      let timeTaken = `${Date.now() - startTime}`;
      return [visitedNodes, timeTaken];
    }

    // Update the neighbours
    updateUnvisitedNeighbours(currentNode, grid);
  }
};

const updateUnvisitedNeighbours = (currentNode, grid) => {
  const unvisitedNeighbours = getUnvisitedNeighbours(currentNode, grid);
  for (const neighbour of unvisitedNeighbours) {
    // Add 1 to each neighbours distance and set previous node property to current node
    neighbour.distance = currentNode.distance + 1;
    neighbour.previousNode = currentNode;
  }
};

const getUnvisitedNeighbours = (node, grid) => {
  const neighbours = [];
  const { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col > 0) neighbours.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  return neighbours.filter(neighbour => !neighbour.isVisited);
};

export const shortestPath = finishNode => {
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPath;
};
