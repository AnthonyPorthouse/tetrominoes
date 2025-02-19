import { beforeEach, describe, expect, it, test } from "vitest";
import { Point } from "../utils";
import { Block } from "./block";
import { Tetromino, TetrominoI, TetrominoO, TetrominoT } from "./tetromino";

describe(TetrominoT, async () => {
  let tetromino: Tetromino;

  beforeEach(() => {
    tetromino = new TetrominoT();
  });

  describe("has a default state", async () => {
    test("state is correct", async () => {
      expect(tetromino.state).toEqual([0b000, 0b111, 0b010]);
    });

    test("blocks are correct", async () => {
      expect(tetromino.blocks).toEqual({
        [new Point(0, 1).toKey()]: new Block(new Point(0, 1)),
        [new Point(1, 1).toKey()]: new Block(new Point(1, 1)),
        [new Point(2, 1).toKey()]: new Block(new Point(2, 1)),
        [new Point(1, 2).toKey()]: new Block(new Point(1, 2)),
      });
    });
  });

  it("can rotate clockwise", async () => {
    tetromino.rotateClockwise();
    describe("state is correct", async () => {
      expect(tetromino.state).toEqual([0b010, 0b110, 0b010]);
    });

    describe("blocks are correct", async () => {
      expect(tetromino.blocks).toEqual({
        [new Point(1, 0).toKey()]: new Block(new Point(1, 0)),
        [new Point(0, 1).toKey()]: new Block(new Point(0, 1)),
        [new Point(1, 1).toKey()]: new Block(new Point(1, 1)),
        [new Point(1, 2).toKey()]: new Block(new Point(1, 2)),
      });
    });
  });

  it("can rotate anticlockwise", async () => {
    tetromino.rotateAntiClockwise();
    expect(tetromino.state).toEqual([0b010, 0b011, 0b010]);
  });
});

describe(TetrominoI, async () => {
  let tetromino: Tetromino;

  beforeEach(() => {
    tetromino = new TetrominoI();
  });

  it("has a default state", async () => {
    expect(tetromino.state).toEqual([0b0000, 0b1111, 0b0000, 0b0000]);
  });

  it("can rotate clockwise", async () => {
    tetromino.rotateClockwise();
    expect(tetromino.state).toEqual([0b0010, 0b0010, 0b0010, 0b0010]);
  });

  it("can rotate anticlockwise", async () => {
    tetromino.rotateAntiClockwise();
    expect(tetromino.state).toEqual([0b0100, 0b0100, 0b0100, 0b0100]);
  });
});

describe(TetrominoO, async () => {
  let tetromino: Tetromino;

  beforeEach(() => {
    tetromino = new TetrominoO();
  });

  it("has a default state", async () => {
    expect(tetromino.state).toEqual([0b0000, 0b0110, 0b0110, 0b0000]);
  });

  it("can rotate clockwise", async () => {
    tetromino.rotateClockwise();
    expect(tetromino.state).toEqual([0b0000, 0b0110, 0b0110, 0b0000]);
  });

  it("can rotate anticlockwise", async () => {
    tetromino.rotateAntiClockwise();
    expect(tetromino.state).toEqual([0b0000, 0b0110, 0b0110, 0b0000]);
  });
});
