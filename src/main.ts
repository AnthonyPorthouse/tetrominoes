import { Application, Assets, Container } from "pixi.js";
import { Game } from "./game";
import "./style.css";
import { buildUi } from "./ui";
import { sounds } from "./ui/sounds";

(async () => {
  const app = new Application();

  await app.init({ background: "#000", resizeTo: window });
  document.body.appendChild(app.canvas);

  await Assets.load("tetromino.webp");

  sounds.bgm.play();

  let game = new Game(10, 24, app.stage);
  game.gamestate = "playing";

  // app.ticker.add((time) => {

  //   if (!app.stage.getChildByLabel('fps')) {
  //     app.stage.addChild(new Text({
  //       text: Math.round(time.FPS),
  //       style: {
  //         fill: 0xffffff,
  //       },
  //       label: 'fps'
  //     }))
  //   } else {
  //     (app.stage.getChildByLabel('fps')! as Text).text = Math.round(time.FPS)
  //   }

  //   render(time, app, game)
  // });

  window.addEventListener(
    "keydown",
    (e) => {
      e.preventDefault();

      if (game.gamestate == "menu") {
        if (e.key === "Enter") {
          game.gamestate = "playing";
          app.stage = new Container();
          game.reset();
          buildUi(app, game);
        }
      }

      if (game.gamestate == "playing") {
        if (e.key === "Escape") {
          game.gamestate = "menu";
          app.stage = new Container();
        }

        if (e.key === "ArrowRight") {
          game.state.moveTetrominoRight();
        }

        if (e.key === "ArrowLeft") {
          game.state.moveTetrominoLeft();
        }

        if (e.key === "ArrowDown") {
          game.resetStepCooldown();
          game.state.moveTetrominoDown();
        }

        if (e.key === "ArrowUp") {
          game.resetStepCooldown();
          let moved = true;
          do {
            moved = game.state.moveTetrominoDown();
          } while (moved);
        }

        if (e.key === "d") {
          game.state.attemptTetrominoRotateClockwise();
        }

        if (e.key === "a") {
          game.state.attemptTetrominoRotateAntiClockwise();
        }

        if (e.key === "s") {
          game.state.swapTetromino();
        }
      }
    },
    { capture: true },
  );
})();
