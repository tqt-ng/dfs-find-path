import { useEffect, useState } from "react";
import "./App.css";

export default function MazeGrid({ width = 10, height = 10 }) {
  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeoutIds] = useState([]);

  useEffect(() => {
    generateMaze(width, height);
  }, []);

  function dfs(startNode) {
    let stack = [startNode];
    let visited = new Set(`${startNode[0]},${startNode[1]}`);

    function visitCell([x, y]) {
      setMaze((prevMaze) =>
        prevMaze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          }),
        ),
      );

      if (maze[y][x] === "end") {
        console.log("path found!");
        return true;
      }
      return false;
    }

    function step() {
      if (stack.length === 0) {
        return;
      }
      const [x, y] = stack.pop();
      console.log("new step");
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(`${nx},${ny}`)
        ) {
          visited.add(`${nx},${ny}`);
          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            stack.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 100);
      setTimeoutIds((previousTimeoutIds) => [...previousTimeoutIds, timeoutId]);
    }

    step();
    return false;
  }

  function generateMaze(height, width) {
    let matrix = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        let cell = Math.random();
        row.push("wall");
      }
      matrix.push(row);
    }
    console.log(matrix);

    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    function isCellValid(x, y) {
      return (
        y >= 0 && x >= 0 && x < width && y < height && matrix[y][x] === "wall"
      );
    }

    function createPath(x, y) {
      matrix[y][x] = "path";

      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          createPath(nx, ny);
        }
      }
    }

    createPath(1, 1);

    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";
    setMaze(matrix);
  }

  function refreshMaze() {
    timeoutIds.forEach(clearTimeout);
    setTimeoutIds([]);
    generateMaze(10, 10);
  }

  return (
    <div className="maze-grid">
      <div className="controls">
        <button className={"maze-button"} onClick={() => refreshMaze()}>
          Refresh Maze
        </button>
        <button className={"maze-button"} onClick={() => dfs([0, 1])}>
          Find Path
        </button>
      </div>
      <div className={"maze"}>
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={`cell ${cell}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}