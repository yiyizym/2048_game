import * as Hammer from 'hammerjs';

class KeyboardInputManager {
  events: Map<string, any>;

  constructor() {
    this.listen();
  }

  listen():void {

    const map = {
      'ArrowUp': 0,
      'ArrowRight': 1,
      'ArrowDown': 2,
      'ArrowLeft': 3,
    };

    document.addEventListener("keydown", (event: KeyboardEvent): void => {
      const modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      if(modifiers) { return }

      const theKey = event.key
      const mapped = map[theKey];

      if (mapped !== undefined) {
        event.preventDefault();
        this.emit("move", mapped);
      }

      if (theKey === 'Space') this.restart(event);
    });

    const retry = document.querySelector(".retry-button");
    retry.addEventListener("click", this.restart);



    // Listen to swipe events
    const gestures = [
      Hammer.DIRECTION_UP,
      Hammer.DIRECTION_RIGHT,
      Hammer.DIRECTION_DOWN,
      Hammer.DIRECTION_LEFT,
    ];

    const gameContainer = document.querySelector(".game-container");
    const handler = Hammer(gameContainer, {
      drag_block_horizontal: true,
      drag_block_vertical: true,
    });

    handler.on("swipe", (event) => {
      event.gesture.preventDefault();
      const mapped = gestures.indexOf(event.gesture.direction);

      if (mapped !== -1) this.emit("move", mapped);
    });
  }

  emit(event: string, data?: any):void {
    const callbacks = this.events[event];
    if(!callbacks) { return }
    callbacks.forEach((callback: (data: any) => any): void => {
      callback(data);
    });
  }

  on = (event: string, callback: (args: any) => any): void => {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  restart = (event: Event): void => {
    event.preventDefault();
    this.emit("restart");
  }

}

export default KeyboardInputManager;