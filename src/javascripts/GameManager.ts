import Grid, { Cell } from './Grid';
import Tile, { Position } from './Tile';

import KeyboardInputManager from './KeyboardInputManager';
import HTMLActuator from './HTMLActuator';


class GameManager {
  size: number;
  score: number;
  over: boolean;
  won: boolean;
  inputManager: KeyboardInputManager;
  actuator: HTMLActuator;
  grid: Grid;
  startTiles: number;
  constructor(size = 4, InputManager: typeof KeyboardInputManager, Actuator: typeof HTMLActuator) {
    this.size = size;
    this.inputManager = new InputManager();
    this.actuator = new Actuator();
    this.startTiles = 2;

    this.inputManager.on('move', this.move);
    this.inputManager.on('restart', this.restart);
    this.setup();
  }

  restart = (): void => {
    this.actuator.restart();
    this.setup();
  }

  setup(): void {
    this.grid = new Grid(this.size);
    
    this.score = 0;
    this.over = false;
    this.won = false;
    this.addStartTiles();
    this.actuate();
  }

  addStartTiles():void {
    for(let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  addRandomTile():void {
    if(!this.grid.cellsAvailable()) { return }
    const value = Math.random() < 0.9 ? 2 : 4;
    const tile = new Tile(this.grid.randomAvailablePosition(), value);
    this.grid.insertTile(tile);
  }

  actuate():void {
    this.actuator.actuate(this.grid, {
      score: this.score,
      over: this.over,
      won: this.won,
    })
  }

  move = (direction: 0|1|2|3):void => {
    // 0: up, 1: right, 2:down, 3: left
    if(this.over || this.won) { return }

    const vector = this.getVector(direction);
    const traversals = this.buildTraversals(vector);
    let moved = false;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const pos = {x, y}
        const cell = this.grid.cellContent(pos);
        if(cell) { 
          const farthestPosition = this.findFarthestPosition(pos, vector);
          const next = this.grid.cellContent(farthestPosition.next);
          // Only one merger per row traversal
          if(next && next.value === cell.value && !next.mergedFrom) {
            const merged = new Tile(farthestPosition.next, cell.value * 2);
            merged.mergedFrom = [cell, next];

            this.grid.insertTile(merged);
            this.grid.removeTile(cell);

            // Converge the two tiles' positions
            cell.updatePosition(farthestPosition.next);

            // Update the score
            this.score += merged.value;

            // The mighty 2048 tile
            if (merged.value === 2048) this.won = true;

          } else {
            this.moveTile(cell, farthestPosition.farthest);
          }

          if(!this.positionsEqual(pos, cell)) {
            moved = true;
          }
        }
      })
    })


    if(!moved) { return }

    this.addRandomTile();
    this.over = !this.movesAvailable();
    this.actuate();

  }

  findFarthestPosition(pos: Position, vector: Position): {farthest: Position, next: Position} {
    let previous: Position;

    // Progress towards the vector direction until an obstacle is found
    do {
      previous = pos;
      pos = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(pos) && this.grid.cellAvailable(pos));

    return {
      farthest: previous,
      next: pos  // Used to check if a merge is required
    }

  }

  getVector(direction: 0|1|2|3): Position {
    // Vectors representing tile movement
    const map = {
      0: { x: 0, y: -1 }, // up
      1: { x: 1, y: 0 }, // right
      2: { x: 0, y: 1 }, // down
      3: { x: -1, y: 0 }, // left
    };

    return map[direction];
  }

  // Build a list of positions to traverse in the right order
  buildTraversals(vector: Position): {x: number[]; y: number[]} {
    const traversals: {x: number[]; y: number[]} = { 
      x: Array.from(Array(this.size).keys()), 
      y: Array.from(Array(this.size).keys()) 
    };

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();


    return traversals;

  }

  // Save all tile positions and remove merger info
  prepareTiles(): void {
    this.grid.eachCell((x, y, cell) => {
      if(!cell) { return }
      cell.mergedFrom = null;
      cell.savePosition();
    })
  }

  movesAvailable(): boolean {
    return this.grid.cellsAvailable() || this.tileMatchesAvailable();
  }


  // Check for available matches between tiles (more expensive check)
  tileMatchesAvailable(): boolean {
    let cell: Cell;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        cell = this.grid.cellContent({ x, y });
        if (cell) { 
          for (let direction = 0; direction < 4; direction++) {
            const vector = this.getVector(direction as 0|1|2|3);
            const pos = { x: x + vector.x, y: y + vector.y };
            const other = this.grid.cellContent(pos);
            
            if (other && other.value === cell.value) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }

    return false;
  }

  positionsEqual(pos: Position, tile: Tile): boolean {
    return pos.x === tile.x && pos.y === tile.y
  }

  // Move a tile and its representation
  moveTile(tile: Tile, pos: Position): void {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[pos.x][pos.y] = tile;
    tile.updatePosition(pos);
  }
}

export default GameManager;
