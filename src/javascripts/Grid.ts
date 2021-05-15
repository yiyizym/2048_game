import Tile, { Position } from './Tile';

type Cell = Tile | null;

class Grid {
  size: number;
  cells: Cell[][];
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
  randomAvailablePosition(): Position {
    const position = this.availablePositions();
    if(position.length) {
      return position[Math.floor(Math.random() * position.length)];
    }
  }

  availablePositions(): Position[] {
    const cells: Position[] = [];

    this.eachCell((x:number, y: number, tile: Tile) => {
      if(!tile) {
        cells.push({x,y})
      }
    })

    return cells;
  }
  // Check if there are any cells available
  cellsAvailable(): boolean {
    return !!this.availablePositions().length;
  }

  // Check if the specified cell is taken
  cellAvailable(cell: Cell): boolean {
    return !this.cellOccupied(cell);
  }

  cellOccupied(cell: Cell): boolean {
    return !!this.cellContent(cell);
  }

  cellContent(cell: Cell): Cell {
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