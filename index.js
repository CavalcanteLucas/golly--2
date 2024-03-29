var divElement = document.createElement("div");
divElement.id = "main-frame";

class Cell {
  constructor(size=20,posX=0, posY=0, state=false ) {
    this.size = size;
    this.posX = posX;
    this.posY = posY;
    this.height = size;
    this.width = size;
    this.state = state;
  }
}

class Board {
  constructor(size=10, unitSize=10, borderSize=1) {
    this.size = size;
    this.unitSize = unitSize;
    this.borderSize = borderSize;
    this.height = unitSize*size + borderSize*(size+1);
    this.width = unitSize*size + borderSize*(size+1);
    this.posX = 0;
    this.posY = 0;

    this.cells = [];
    for (let i=0; i<this.size; i++) {
      this.cells[i] = [];
      for (let j=0; j<this.size; j++) {
        const cell = {
          size: unitSize,
          posX: this.borderSize+this.posX+i*(unitSize+this.borderSize),
          posY: this.borderSize+this.posY+j*(unitSize+this.borderSize),
          state: false,
        }
        this.cells[i][j] = new Cell(unitSize, cell.posX, cell.posY, false);
      }
    }
  }
}

var board = new Board(size=20, unitSize=10, borderSize=2, "black");

var canvasElement = document.createElement("canvas");
canvasElement.width = board.width;
canvasElement.height = board.height;

var context = canvasElement.getContext("2d");
context.fillStyle = board.color;
context.fillRect(board.posX, board.posY, board.width, board.height);

function drawBoard() {
  for (let i=0; i<board.size; i+=1) {
    for (let j=0; j<board.size; j+=1) {
      if (board.cells[i][j].state) {
        context.fillStyle = "black";
      } else {
        context.fillStyle = "white";
      }
      context.fillRect(
        board.cells[i][j].posX,
        board.cells[i][j].posY,
        board.cells[i][j].width,
        board.cells[i][j].height,
      );
    }
  }
}

drawBoard();

function handleSwitchCell(x, y) {
  console.log(x, y)
  if (x < 0 || x >= board.size || y < 0 || y >= board.size) {
    console.log("Out of bounds");
    return;
  }
  else {
    board.cells[x][y].state = !board.cells[x][y].state;
  }

  drawBoard();
}

function countAliveNeighbours(x, y) {
  let aliveNeighbours = 0;
  for (let i=x-1; i<=x+1; i+=1) {
    for (let j=y-1; j<=y+1; j+=1) {
      if (i >= 0 && i < board.size && j >= 0 && j < board.size && !(i === x && j === y)) {
        if (board.cells[i][j].state) {
          aliveNeighbours += 1;
        }
      }
    }
  }
  return aliveNeighbours;
}

function computeNextTurn() {
  newBoard = new Board(board.size, board.unitSize, board.borderSize);
  for (let i=0; i<board.size; i+=1) {
    for (let j=0; j<board.size; j+=1) {
      if (board.cells[i][j].state) {
        if (countAliveNeighbours(i, j) < 2 || countAliveNeighbours(i, j) > 3) {
          newBoard.cells[i][j].state = false;
        }
        if (countAliveNeighbours(i, j) === 2 || countAliveNeighbours(i, j) === 3) {
          newBoard.cells[i][j].state = true;
        }
      } else {
        if (countAliveNeighbours(i, j) === 3) {
          newBoard.cells[i][j].state = true;
        }
      }
    }
  }
  return newBoard;
}

// Click event
function getCursorPosition(canvas, e) {
  mousePosLocal = {
    x: e.clientX - e.target.offsetLeft,
    y: e.clientY - e.target.offsetTop
  };

  const clickedCellXAprox = (mousePosLocal.x - board.posX) / (board.unitSize + board.borderSize)
  const clickedCellX = Math.floor(clickedCellXAprox)
  const clickedCellYAprox = (mousePosLocal.y - board.posY) / (board.unitSize + board.borderSize)
  const clickedCellY = Math.floor(clickedCellYAprox)

  handleSwitchCell(clickedCellX, clickedCellY);
}

canvasElement.addEventListener('mousedown', function(e) {
  getCursorPosition(canvasElement, e);
});

// Pause button
var paused = true;
var pauseButton = document.createElement("button");
pauseButton.textContent = "Start";
var intervalId = null;

pauseButton.addEventListener('click', function() {
  paused = !paused;
  if (paused) {
    pauseButton.textContent = "Resume";
    clearInterval(intervalId);
    intervalId = null;
  } else {
    pauseButton.textContent = "Pause";
    if (intervalId === null) {
      startCounter();
    }
  }
}, false);

// Turn counter
var turnCounterP = document.createElement("p");
var turnCounter = 0;
turnCounterP.textContent = `Counter: ${turnCounter}`;

function incrementTurnCount() {
  turnCounter += 1;
  turnCounterP.textContent = `Counter: ${turnCounter}`;

  board = computeNextTurn();
  drawBoard();
}

function startCounter() {
  if (intervalId === null && !paused) {
    intervalId = setInterval(incrementTurnCount, 100);
  }
}

startCounter();

// Mouse position
var mousePositionP = document.createElement("p")
mousePositionP.textContent = `[global]: NaN, NaN | [local]: NaN, NaN`;
canvasElement.addEventListener('mousemove', (e) => {
  mousePosGlobal = { x: e.clientX, y: e.clientY };
  mousePosLocal = { x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop };
  mousePositionP.textContent = `[global]: ${mousePosGlobal.x}, ${mousePosGlobal.y} | [local]: ${mousePosLocal.x}, ${mousePosLocal.y}`;
});

// Debug
var debugDiv = document.createElement("div");
debugDiv.appendChild(turnCounterP);
debugDiv.appendChild(mousePositionP);

// Build DOM
divElement.appendChild(canvasElement);
document.body.appendChild(divElement);
document.body.appendChild(pauseButton);
document.body.appendChild(debugDiv);
