import { Application, Assets, Container, Text } from "pixi.js";
import { Game, render } from "./game";
import "./style.css";
import { buildUi } from "./ui";
import { sounds } from "./ui/sounds";

const app = new Application();

await app.init({ background: "#000", resizeTo: window });
document.body.appendChild(app.canvas);

await Assets.load('tetromino.webp')

sounds.bgm.play()


let game = new Game(10, 24)

let stepTimer = 0;

app.ticker.add((time) => {

  if (!app.stage.getChildByLabel('fps')) {
    app.stage.addChild(new Text({
      text: Math.round(time.FPS),
      style: {
        fill: 0xffffff,
      },
      label: 'fps'
    }))
  } else {
    (app.stage.getChildByLabel('fps')! as Text).text = Math.round(time.FPS)
  }

  if (game.gamestate === 'playing') {
    stepTimer = stepTimer % game.speed
    stepTimer += 1 * time.elapsedMS;

    if (time.elapsedMS % 100) {
      const clearedRows = game.state.clearRows();
      switch(clearedRows) {
        case 1:
          game.score += 100;
          break;
        case 2:
          game.score += 300;
          break;
        case 3:
          game.score += 500;
          break;
        case 4:
          game.score += 800;
          break;
      }

      game.speed -= 10 * clearedRows
    }

    if (stepTimer >= game.speed) {
      game.state.moveTetrominoDown()
    }
  }

  render(time, app, game)
});

window.addEventListener(
  "keydown",
  (e) => {
    e.preventDefault();

    if (game.gamestate == 'menu') {
      if (e.key === 'Enter') {
        game.gamestate = 'playing'
        app.stage = new Container();
        game.reset();
        buildUi(app, game)
      }
    }

    if (game.gamestate == 'playing') {
      if (e.key === 'Escape') {
        game.gamestate = 'menu'
        app.stage = new Container()
      }

      if (e.key === "ArrowRight") {
        game.state.moveTetrominoRight();
      }

      if (e.key === "ArrowLeft") {
        game.state.moveTetrominoLeft();
      }

      if (e.key === "ArrowDown") {
        stepTimer = 0;
        game.state.moveTetrominoDown();
      }

      if (e.key === "ArrowUp") {
        stepTimer = 0;
        let moved = true;
        do {
          moved = game.state.moveTetrominoDown();
        } while(moved)
      }

      if (e.key === 'd') {
        game.state.attemptTetrominoRotateClockwise();
      }

      if (e.key === 'a') {
        game.state.attemptTetrominoRotateAntiClockwise();
      }
    }
  },
  { capture: true }
);
