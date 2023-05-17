console.log("Olá, Marilene.");

var divElement = document.createElement("div");
divElement.id = "main-frame";

var canvasElement = document.createElement("canvas");
canvasElement.id = "canvas";
canvasElement.width = 800;
canvasElement.height = 600;

var context = canvasElement.getContext("2d");


class Cell {
  constructor(size=20,posX=0, posY=0, color="green" ) {
    this.size = size;
    this.posX = posX + (size/2);
    this.posY = posY + (size/2);
    this.height = size;
    this.width = size;
    this.color = color;
  }
}

class Board {

  constructor(size=10, unitSize=10, borderSize=1, color="pink") {
    this.size = size;
    this.unitSize = unitSize;
    this.height = (unitSize + borderSize + 1) * size;
    this.width = (unitSize + borderSize + 1) * size;
    this.posX = (canvasElement.width - this.height) / 2;
    this.posY = (canvasElement.height - this.width) / 2;
    this.color = color

    this.cells = [];

    for (let i=0; i<this.size; i++) {
      this.cells[i] = [];
      for (let j=0; j<this.size; j++) {
        const cell = {
          size: unitSize,
          posX: this.posX+i*(unitSize+borderSize),
          posY: this.posY+j*(unitSize+borderSize),
          color: "white",
        }
        console.log(cell)
        this.cells[i][j] = new Cell(unitSize, cell.posX, cell.posY, "white");
      }
    }
  }
}


var board = new Board(size=20, unitSize=20, borderSize=1, "black");
context.fillStyle = board.color;
context.fillRect(board.posX, board.posY, board.width, board.height);

for (let i=0; i<board.size; i+=1) {
  for (let j=0; j<board.size; j+=1) {
    context.fillStyle = board.cells[0][0].color;
    context.fillRect(
      board.cells[i][j].posX,
      board.cells[i][j].posY,
      board.cells[i][j].width,
      board.cells[i][j].height,
    );
  }
}

divElement.appendChild(canvasElement);
document.body.appendChild(divElement);
