// src/algorithms/aStar.js

export function aStar(grid, startNode, endNode) {
  const openSet = [startNode];
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.heuristic = calculateHeuristic(startNode, endNode);

  while (openSet.length > 0) {
    // Get the node with the smallest f value
    openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
    const currentNode = openSet.shift();
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    const { row, col } = currentNode;
    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      const tentativeDistance = currentNode.distance + 1;

      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = calculateHeuristic(neighbor, endNode);
        neighbor.previousNode = currentNode;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder; // In case there's no path, return the nodes visited in order
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

function calculateHeuristic(node, endNode) {
  const dx = Math.abs(node.row - endNode.row);
  const dy = Math.abs(node.col - endNode.col);
  return dx + dy; // Using Manhattan distance as the heuristic
}
