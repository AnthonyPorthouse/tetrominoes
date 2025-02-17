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
let stepSpeed = 1500;

const stepSpeedText = new Text({
  text: stepSpeed,
  style: {
    fill: 0xffffff,
  }
})

stepSpeedText.y = 32;

app.stage.addChild(stepSpeedText)

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
    stepTimer = stepTimer % stepSpeed
    stepTimer += 1 * time.elapsedMS;

    if (time.elapsedMS % 100) {
      const clearedRows = game.state.clearRows();
    }

    if (stepTimer >= stepSpeed) {
      stepSpeed = Math.round(Math.max(50, stepSpeed * 0.975))

      stepSpeedText.text = stepSpeed

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
        game.state.tetromino.rotateClockwise();
      }

      if (e.key === 'a') {
        game.state.tetromino.rotateAntiClockwise();
      }
    }
  },
  { capture: true }
);
