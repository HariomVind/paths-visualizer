import React, { useState, useEffect } from 'react';
import Node from './Node';
import './Grid.css';
import { dijkstras } from '../algorithms/dijkstras';
import { aStar } from '../algorithms/aStar';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [isChangingStart, setIsChangingStart] = useState(false);
  const [isChangingEnd, setIsChangingEnd] = useState(false);

  useEffect(() => {
    setGrid(createInitialGrid());
  }, []);

  const handleMouseDown = (row, col) => {
    const newGrid = [...grid]//grid.slice();
    const node = newGrid[row][col];

    if ( !startNode/*node.isStart*/) {
      // setIsChangingStart(true);
      node.isStart = true;
      setStartNode(node);

    } else if (!endNode/*node.isEnd*/) {
      // setIsChangingEnd(true);
      node.isEnd = true;
      setEndNode(node);

    } else {
      if (isChangingStart) {
        newGrid[startNode.row][startNode.col].isStart = false;
        node.isStart = true;
        setStartNode({ row, col });

      } else if (isChangingEnd) {
        newGrid[endNode.row][endNode.col].isEnd = false;
        node.isEnd = true;
        setEndNode({ row, col });
        
      } else {
        const toggledGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(toggledGrid);
        setMouseIsPressed(true);
      }
    }

    setGrid(newGrid);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = grid.slice();

    if (isChangingStart) {
      newGrid[startNode.row][startNode.col].isStart = false;
      newGrid[row][col].isStart = true;
      setStartNode({ row, col });
    } else if (isChangingEnd) {
      newGrid[endNode.row][endNode.col].isEnd = false;
      newGrid[row][col].isEnd = true;
      setEndNode({ row, col });
    } else {
      const toggledGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(toggledGrid);
    }

    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setIsChangingStart(false);
    setIsChangingEnd(false);
  };

  const handleClear = () => {
    const newGrid = createInitialGrid(); // Create a fresh grid with all nodes reset
    setGrid(newGrid);
    setStartNode(null);
    setEndNode(null);
  };
  

  const handleVisualizeDijkstra = () => {
    if (!startNode || !endNode) return;
    const startNodeObj = grid[startNode.row][startNode.col];
    const endNodeObj = grid[endNode.row][endNode.col];
    const visitedNodesInOrder = dijkstras(grid, startNodeObj, endNodeObj);
    animateAlgorithm(visitedNodesInOrder, endNodeObj);
  };

  const handleVisualizeAStar = () => {
    if (!startNode || !endNode) return;
    const startNodeObj = grid[startNode.row][startNode.col];
    const endNodeObj = grid[endNode.row][endNode.col];
    const visitedNodesInOrder = aStar(grid, startNodeObj, endNodeObj);
    animateAlgorithm(visitedNodesInOrder, endNodeObj);
  };

  const handleVisualizeBFS = () => {
    if (!startNode || !endNode) return;
    const startNodeObj = grid[startNode.row][startNode.col];
    const endNodeObj = grid[endNode.row][endNode.col];
    const visitedNodesInOrder = bfs(grid, startNodeObj, endNodeObj);
    animateAlgorithm(visitedNodesInOrder, endNodeObj);
  };

  const handleVisualizeDFS = () => {
    if (!startNode || !endNode) return;
    const startNodeObj = grid[startNode.row][startNode.col];
    const endNodeObj = grid[endNode.row][endNode.col];
    const visitedNodesInOrder = dfs(grid, startNodeObj, endNodeObj);
    animateAlgorithm(visitedNodesInOrder, endNodeObj);
  };

  const animateAlgorithm = (visitedNodesInOrder, endNode) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, 50 * i);
    }
  };

  return (
    <div>
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleVisualizeDijkstra}>Visualize Dijkstra's Algorithm</button>
      <button onClick={handleVisualizeAStar}>Visualize A* Algorithm</button>
      <button onClick={handleVisualizeBFS}>Visualize BFS Algorithm</button>
      <button onClick={handleVisualizeDFS}>Visualize DFS Algorithm</button>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((node, nodeIndex) => {
              const { row, col, isStart, isEnd, isWall } = node;
              return (
                <Node
                  key={nodeIndex}
                  col={col}
                  row={row}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseUp={handleMouseUp}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const createInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isEnd: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    heuristic : 0, //for A* algorithm
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNodesInShortestPathOrder = (endNode) => {
  const nodesInShortestPathOrder = [];
  let currentNode = endNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
};

export default Grid;
