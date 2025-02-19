import { State } from "./game/state";
import { Point } from "./utils/point";

let direction: "forward" | "backward" = "forward";
let currentX = 0;

export function linesDemo(state: State) {
  state.clearRow(state.height - 1);

  state.setBlock(new Point(currentX, 0));
  if (direction === "forward") {
    currentX += 1;
  } else {
    currentX -= 1;
  }

  if (currentX === state.width - 1 && direction === "forward") {
    direction = "backward";
  }

  if (currentX === 0 && direction === "backward") {
    direction = "forward";
  }
}
