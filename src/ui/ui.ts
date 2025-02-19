import { Application } from "pixi.js";
import { Game } from "../game";
import { getBoard } from "./board";

export function buildUi(app: Application, game: Game) {
  const board = getBoard(game.width, game.height);
  board.label = "board";
  app.stage.addChild(board);

  board.x = (app.screen.width - board.width) / 2;
  board.y = 32;
}
