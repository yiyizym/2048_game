import Tile, { Position } from './Tile';

export type Cell = Tile | null;

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

    this.eachCell((x:number, y: number, cell: Cell) => {
      if(!cell) {
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
  cellAvailable(pos: Position): boolean {
    return !this.cellOccupied(pos);
  }

  cellOccupied(pos: Position): boolean {
    return !!this.cellContent(pos);
  }

  cellContent(pos: Position): Cell {
    if(!!pos && this.withinBounds(pos)) {
      return this.cells[pos.x][pos.y]
    } else {
      return null
    }
  }

  insertTile(tile: Tile): void {
    this.cells[tile.x][tile.y] = tile;
  }

  removeTile(tile: Tile): void {
    this.cells[tile.x][tile.y] = null;
  }

  withinBounds(pos: Position) {
    return (
      pos.x >= 0 &&
      pos.x < this.size &&
      pos.y >= 0 &&
      pos.y < this.size
    );
  }

  eachCell(cb: (x:number, y: number, cell: Cell) => any): void {
    for(let i = 0; i < this.size; i++) {
      for(let j = 0; j < this.size; j++) {
        cb(i, j, this.cells[i][j])
      }
    }
  }
}

export default Grid;