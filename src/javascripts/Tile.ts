interface Position {
  x: number;
  y: number;
}

class Tile {
  x: number;
  y: number;
  value: number;
  previousPosition: Position|null;
  mergedFrom: any[]|null; // TODO

  constructor(position: Position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;
  
    this.previousPosition = null;
    this.mergedFrom = null; // Tracks tiles that merged together
  }
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  }
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}

export default Tile;