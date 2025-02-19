import { Container, Graphics, Ticker } from "pixi.js";
import { State } from "./state";

export class Game {
  private _width: number;
  private _height: number;

  private _state: State;
  private _score: number = 0;
  private _speed: number = 1000;

  private _ticker: Ticker;
  private _currentTime: number = 0;

  private _stage: Container;

  private readonly _initialSpeed = 1000;

  private _gamestate: "menu" | "playing" = "menu";

  constructor(width: number, height: number, stage: Container) {
    this._width = width;
    this._height = height;
    this._state = new State(this._width, this._height);
    this._stage = stage;

    this._ticker = new Ticker();
    this._ticker.add((tick) => this.tick(tick));
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get speed() {
    return this._speed;
  }

  set speed(speed: number) {
    this._speed = Math.round(Math.max(150, speed));
  }

  get score() {
    return this._score;
  }

  set score(score: number) {
    this._score = score;
  }

  get state() {
    return this._state;
  }

  get gamestate() {
    return this._gamestate;
  }

  set gamestate(state: typeof this._gamestate) {
    this._gamestate = state;

    if (state === "playing") {
      this._ticker.start();
    }
  }

  reset() {
    this._state = new State(this.width, this.height);
    this.score = 0;
    this.speed = this._initialSpeed;
    this._currentTime = 0;

    this._ticker.stop();
  }

  resetStepCooldown() {
    this._currentTime = 0;
  }

  tick(time: Ticker): void {
    this._currentTime += time.elapsedMS;

    const clearedRows = this.state.clearRows();

    if (clearedRows) {
      switch (clearedRows) {
        case 1:
          this.score += 100;
          break;
        case 2:
          this.score += 300;
          break;
        case 3:
          this.score += 500;
          break;
        case 4:
          this.score += 800;
          break;
      }

      this.speed -= 10 * clearedRows;
    }

    if (this._currentTime >= this.speed) {
      this.state.moveTetrominoDown();
    }

    this.render();

    this._currentTime = this._currentTime % this.speed;
  }

  private render() {
    // Draw UI
    // const { board, nextContainer, holdContainer } = this.ui.render()

    // Define our Containers
    let board = this._stage.getChildByLabel("boardContainer")?.getChildByLabel('board');
    if (!board) {
      board = new Container({
        label: "board",
        width: this.width * 32,
        height: this.height * 32,
        x: 4,
        y: 4
      });

      const boardContainer = new Container({
        width: board.width + 8,
        height: board.width + 8,
        label: 'boardContainer'
      });

      boardContainer.addChild(
        new Graphics().rect(0, 0, this.width * 32 + 8, this.height * 32 + 8).stroke({
          width: 2,
          color: 0xffffff,
        })
      );

      boardContainer.position.set((window.innerWidth - boardContainer.width) / 2, 32);

      const mask = new Graphics()
        .rect(0, 0, boardContainer.width, boardContainer.height)
        .fill({
          color: 0xffffff,
        });

      boardContainer.setMask({
        mask: mask,
      });

      boardContainer.addChild(mask);



      boardContainer.addChild(board)

      this._stage.addChild(boardContainer);
    }

    let nextContainer = this._stage.getChildByLabel("nextContainer");
    if (!nextContainer) {
      nextContainer = new Container({
        label: "nextContainer",
      });

      this._stage.addChild(nextContainer);
    }

    let holdContainer = this._stage.getChildByLabel("holdContainer");
    if (!holdContainer) {
      holdContainer = new Container({
        label: "holdContainer",
      });

      this._stage.addChild(holdContainer);
    }

    board.getChildrenByLabel("block").map((b) => b.destroy());

    nextContainer.getChildrenByLabel('block').map((b) => b.destroy())
    holdContainer.getChildrenByLabel('block').map((b) => b.destroy())

    // Render State
    this.state.render(board);

    // Render Current Tetromino
    this.state.tetromino.render(board);

    // Render Next Tetromino
    this.state.blockBag.previewNext().render(nextContainer);

    // Render Held Tetromino
    this.state.held?.render(holdContainer);
  }
}
