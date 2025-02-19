import { Container } from "pixi.js";
import { sounds } from "../ui/sounds";
import { Point } from "../utils";
import { Block } from "./block";
import { Tetromino, TetrominoBag } from "./tetromino";

export class State {
  private _width: number;
  private _height: number;

  private _board: Record<string, Block | undefined>;
  private _tetromino: Tetromino;

  private _heldTetromino?: Tetromino;

  private _blockBag: TetrominoBag = new TetrominoBag();

  constructor(width: number = 10, height: number = 24) {
    this._width = width;
    this._height = height;

    this._board = {};

    this._tetromino = this.blockBag.getNext();
    this.tetromino.position = this.resetPosition;
  }

  private get resetPosition() {
    return new Point(Math.floor((this.width - 4) / 2), 0);
  }

  get board() {
    return this._board;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get blockBag() {
    return this._blockBag;
  }

  get tetromino() {
    return this._tetromino;
  }

  set tetromino(t: Tetromino) {
    this._tetromino = t;
  }

  get held() {
    return this._heldTetromino;
  }

  swapTetromino() {
    if (!this._heldTetromino) {
      this._heldTetromino = this._tetromino;
      this._heldTetromino.position = new Point(0, 0)
      this._tetromino = this._blockBag.getNext();
      this._tetromino.position = this.resetPosition
    } else {
      const held = this._heldTetromino;
      const current = this._tetromino;

      const currentPos = current.position;

      this._tetromino = held;
      this._tetromino.position = currentPos

      this._heldTetromino = current;
      this._heldTetromino.position = new Point(0, 0);

    }
  }

  setBlock(point: Point, block?: Block) {
    if (block) {
      block.point = point
    }

    this._board[point.toKey()] = block ?? new Block(point);
  }

  clearBlock(point: Point) {
    this._board[point.toKey()] = undefined;
  }

  hasBlock(point: Point) {
    return this._board[point.toKey()] ? true : false;
  }

  getBlock(point: Point) {
    return this._board[point.toKey()];
  }

  isRowFull(row: number) {
    for (let i = 0; i < this.width; i++) {
      let point = new Point(i, row);
      if (!this.hasBlock(point)) {
        return false;
      }
    }

    return true;
  }

  hasFullRows(): boolean {
    for (let row = 0; row < this.height; row++) {
      if (this.isRowFull(row)) {
        return true;
      }
    }

    return false;
  }

  clearRow(row: number) {
    // remove set row
    for (let i = 0; i < this.width; i++) {
      let point = new Point(i, row);
      this.clearBlock(point);
    }

    for (let y = row - 1; y >= -1; y--) {
      for (let i = 0; i < this.width; i++) {
        let fromPoint = new Point(i, y);
        let toPoint = new Point(i, y + 1);

        if (this.hasBlock(fromPoint)) {
          this._board[toPoint.toKey()] = this._board[fromPoint.toKey()];
        } else {
          this.clearBlock(toPoint);
        }
      }
    }
  }

  clearRows(): number {
    let rowsCleared = 0;

    for (let row = 0; row < this.height; row++) {
      if (this.isRowFull(row)) {
        this.clearRow(row);
        rowsCleared += 1;
      }
    }

    return rowsCleared;
  }

  private canMoveToPos(pos: Point) {
    return Object.values(this.tetromino.blocks).every((block) => {
      const nextPos = new Point(pos.x + block.point.x, pos.y + block.point.y);

      return (
        nextPos.y < this.height &&
        nextPos.x >= 0 &&
        nextPos.x < this.width &&
        !this.hasBlock(nextPos)
      );
    });
  }

  moveTetrominoRight() {
    const nextPos = this.tetromino.position.add(new Point(1, 0));

    if (this.canMoveToPos(nextPos)) {
      this.tetromino.position = nextPos;
      return true;
    }

    return false;
  }

  moveTetrominoLeft() {
    const nextPos = this.tetromino.position.add(new Point(-1, 0));

    if (this.canMoveToPos(nextPos)) {
      this.tetromino.position = nextPos;
      return true;
    }

    return false;
  }

  moveTetrominoDown() {
    const nextPos = this.tetromino.position.add(new Point(0, 1));
    const canMove = this.canMoveToPos(nextPos);

    if (canMove) {
      this.tetromino.position = nextPos;
      return true;
    }

    // If blocked, lock it in place.

    sounds.thud.play();

    Object.values(this.tetromino.blocks).map((block) => {
      const newBlockPos = this.tetromino.position.add(block.point);
      this.setBlock(newBlockPos, block);
    });

    this._tetromino = this.blockBag.getNext();
    this.tetromino.position = this.resetPosition;

    return false;
  }

  attemptTetrominoRotateClockwise() {
    const originalPosition = this.tetromino.position;

    this.tetromino.rotateClockwise();
    const wallkickPositions = this.tetromino.wallkickPositions.cw;

    for (let offset of wallkickPositions) {
      const position = originalPosition.add(offset);
      if (this.canMoveToPos(position)) {
        this.tetromino.position = position;
        return true;
      }
    }

    this.tetromino.rotateAntiClockwise();
    return false;
  }

  attemptTetrominoRotateAntiClockwise() {
    const originalPosition = this.tetromino.position;

    this.tetromino.rotateAntiClockwise();
    const wallkickPositions = this.tetromino.wallkickPositions.ccw;

    for (let offset of wallkickPositions) {
      const position = originalPosition.add(offset);
      if (this.canMoveToPos(position)) {
        this.tetromino.position = position;
        return true;
      }
    }

    this.tetromino.rotateClockwise();
    return false;
  }

  toString(): string {
    let out = "";

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        out += this.hasBlock(new Point(col, row)) ? "#" : ".";
      }
      out += "\n";
    }

    return out;
  }

  render(boardContainer: Container) {
    Object.values(this.board).map((b) => {
      if (b) {
        boardContainer.addChild(b.render());
      }
    });
  }
}
