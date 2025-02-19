import { Container, Graphics } from "pixi.js";

export function getBoard(width: number, height: number) {
  const board = new Container();
  board.setSize(width * 32, height * 32);

  const mask = new Graphics().rect(0, 0, width * 32, height * 32).fill({
    color: 0xffffff,
  });

  board.setMask({
    mask: mask,
  });

  board.addChild(mask);

  board.addChild(
    new Graphics().rect(0, 0, width * 32, height * 32).stroke({
      width: 2,
      color: 0xffffff,
    }),
  );

  return board;
}
