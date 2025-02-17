import { sounds } from "../ui/sounds";
import { Point } from "../utils";
import { Block } from "./block";
import { Tetromino, TetrominoBag } from "./tetromino";

export class State {
  private _width: number;
  private _height: number;

  private _board: Record<string, Block | undefined>;
  private _tetromino: Tetromino
  private _tetrominoPosition: Point

  private _blockBag: TetrominoBag = new TetrominoBag();

  constructor(width: number = 10, height: number = 24) {
    this._width = width;
    this._height = height;

    this._board = {};

    this._tetromino = this.blockBag.getNext();
    this._tetrominoPosition = this.resetPosition
  }

  private get resetPosition() {
    return new Point(
      Math.floor((this.width - 4) / 2),
      0
    )
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get blockBag() {
    return this._blockBag
  }

  get tetromino() {
    return this._tetromino
  }
  get tetrominoPosition() {
    return this._tetrominoPosition
  }

  setBlock(point: Point, block?: Block) {
    this._board[point.toKey()] = block ?? new Block(point);
  }

  clearBlock(point: Point) {
    this._board[point.toKey()] = undefined;
  }

  hasBlock(point: Point) {
    return this._board[point.toKey()] ? true : false;
  }

  getBlock(point: Point) {
    return this._board[point.toKey()]
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
        return true
      }
    }

    return false;
  }

  clearRow(row: number) {
    // remove set row
    for (let i = 0; i < this.width; i++) {
      let point = new Point(i, row);
      this.clearBlock(point)
    }

    for (let y = row - 1; y >= -1; y--) {
      for (let i = 0; i < this.width; i++) {
        let fromPoint = new Point(i, y);
        let toPoint = new Point(i, y + 1);

        if (this.hasBlock(fromPoint)) {
          this._board[toPoint.toKey()] = this._board[fromPoint.toKey()]
        } else {
          this.clearBlock(toPoint)
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

  moveTetrominoRight() {
    const pos = this.tetrominoPosition;

    const moveRight = Object.values(this.tetromino.blocks).every((block) => {
      const nextPos = new Point(pos.x + block.point.x + 1, pos.y + block.point.y)
      return nextPos.x < this.width && !this.hasBlock(nextPos)
    })

    if (moveRight) {
      this._tetrominoPosition = new Point(this.tetrominoPosition.x + 1, this.tetrominoPosition.y)
      return true;
    }

    return false
  }

  moveTetrominoLeft() {
    const pos = this.tetrominoPosition;

    const moveRight = Object.values(this.tetromino.blocks).every((block) => {
      const nextPos = new Point(pos.x + block.point.x - 1, pos.y + block.point.y)
      return nextPos.x >= 0 && !this.hasBlock(nextPos)
    })

    if (moveRight) {
      this._tetrominoPosition = new Point(this.tetrominoPosition.x - 1, this.tetrominoPosition.y)
      return true;
    }

    return false
  }

  moveTetrominoDown() {

    const pos = this.tetrominoPosition;

    const moveRight = Object.values(this.tetromino.blocks).every((block) => {
      const nextPos = new Point(pos.x + block.point.x, pos.y + block.point.y + 1)
      return nextPos.y < this.height && !this.hasBlock(nextPos)
    })

    if (moveRight) {
      this._tetrominoPosition = new Point(this.tetrominoPosition.x, this.tetrominoPosition.y + 1)
      return true;
    }

    // If blocked, lock it in place.

    sounds.thud.play()

    Object.values(this.tetromino.blocks).map((block) => {
      const newBlockPos = new Point(pos.x + block.point.x, pos.y + block.point.y)
      this.setBlock(newBlockPos, block)
    })

    this._tetromino = this.blockBag.getNext()
    this._tetrominoPosition = this.resetPosition

    return false

  }

  toString(): string {
    let out = '';

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        out += this.hasBlock(new Point(col, row)) ? '#' : '.'
      }
      out += '\n'
    }

    return out;
  }
}
