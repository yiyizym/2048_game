interface Cell {
  x: number;
  y: number;
}


type Thing = Cell | null;
type Tile = Thing;

class Grid {
  size: number;
  cells: Thing[][];
  constructor(size = 4) {
    this.size = size;
    this.cells = [];
    this.build();
  }
  // Build a grid of the specified size
  build(): void {
    this.cells = Array(this.size).fill(null).map(() => Array(this.size).fill(null))
  }

  // Find the first available random position
  randomAvailableCell(): Cell {
    const cells = this.availableCells();
    if(cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  availableCells(): Cell[] {
    const cells: Cell[] = [];

    this.eachCell((x:number, y: number, tile: Tile) => {
      if(!tile) {
        cells.push({x,y})
      }
    })

    return cells;
  }
  // Check if there are any cells available
  cellsAvailable(): boolean {
    return !!this.availableCells().length;
  }

  // Check if the specified cell is taken
  cellAvailable(cell: Thing): boolean {
    return !this.cellOccupied(cell);
  }

  cellOccupied(cell: Thing): boolean {
    return !!this.cellContent(cell);
  }

  cellContent(cell: Thing): Thing {
    if(!!cell && this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y]
    } else {
      return null
    }
  }

  insertTile(tile: Cell): void {
    this.cells[tile.x][tile.y] = tile;
  }

  removeTile(tile: Cell): void {
    this.cells[tile.x][tile.y] = null;
  }

  withinBounds(cell: Cell) {
    return (
      cell.x >= 0 &&
      cell.x < this.size &&
      cell.y >= 0 &&
      cell.y < this.size
    );
  }

  eachCell(cb: (x:number, y: number, tile: Tile) => any): void {
    for(let i = 0; i < this.size; i++) {
      for(let j = 0; j < this.size; j++) {
        cb(i, j, this.cells[i][j])
      }
    }
  }
}

export default Grid;