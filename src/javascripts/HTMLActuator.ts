import Grid from './Grid';
import Tile, { Position } from './Tile';

class HTMLActuator {
  tileContainer: Element;
  scoreContainer: Element;
  messageContainer: Element;
  score: number;

  constructor() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreContainer = document.querySelector(".score-container");
    this.messageContainer = document.querySelector(".game-message");

    this.score = 0;
  }

  actuate = (grid: Grid, metadata: {score: number; won: boolean; over: boolean}): void => {
    window.requestAnimationFrame((): void => {
      this.clearContainer(this.tileContainer);

      grid.cells.forEach(column => {
        column.forEach(cell => {
          if (cell) {
            this.addTile(cell);
          }
        });
      });

      this.updateScore(metadata.score);

      if (metadata.over) this.message(false); // You lose
      if (metadata.won) this.message(true); // You win!
    });
  }

  addTile(tile: Tile): void {
    const element = document.createElement("div");
    const position = tile.previousPosition || { x: tile.x, y: tile.y };
    const positionClass = this.positionClass(position);
    // We can't use classlist because it somehow glitches when replacing classes
    const classes = ["tile", `tile-${tile.value}`, positionClass];
    this.applyClasses(element, classes);
    element.textContent = tile.value.toString();

    if(tile.previousPosition) {
      // ???
      // Make sure that the tile gets rendered in the previous position first
      window.requestAnimationFrame(() => {
        classes[2] = this.positionClass({ x: tile.x, y: tile.y });
        this.applyClasses(element, classes); // Update the position
      });
    } else if(tile.mergedFrom) {
      classes.push('tile-merged');
      this.applyClasses(element, classes);
      tile.mergedFrom.forEach(sourceTile => {
        this.addTile(sourceTile)
      })
    } else {
      classes.push('tile-new');
      this.applyClasses(element, classes);
    }

    this.tileContainer.appendChild(element);

  }

  restart(): void {
    this.clearMessage();
  }

  clearContainer(container: Element): void {
    while(container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }

  message(won: boolean): void {
    this.messageContainer.classList.add(won ? "game-won" : "game-over");
    this.messageContainer.querySelector("p").textContent = won ? "You win!" : "Game over!";
  }

  clearMessage(): void {
    this.messageContainer.classList.remove("game-won", "game-over");
  }

  updateScore(score: number): void {
    this.clearContainer(this.scoreContainer);
    const difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = score.toString();

    if (difference > 0) {
      const addition = document.createElement("div");
      addition.classList.add("score-addition");
      addition.textContent = "+" + difference;
  
      this.scoreContainer.appendChild(addition);
    }
  }

  applyClasses(ele: Element, classes: string[]): void {
    ele.setAttribute("class", classes.join(" "));
  }

  normalizePosition(position: Position): Position {
    return { x: position.x + 1, y: position.y + 1 };
  }

  positionClass(position: Position): string {
    position = this.normalizePosition(position);
    return `tile-position-${position.x}-${position.y}`;
  }

}

export default HTMLActuator;