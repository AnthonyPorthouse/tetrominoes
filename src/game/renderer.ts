import { Application, Container, Sprite, Text, Ticker } from "pixi.js";
import { buildUi } from "../ui";
import { Point } from "../utils";
import { Block } from "./block";
import { Game } from "./game";

const fps = new Text({
    text: '',
    label: 'fps'
})

export function render(time: Ticker, app: Application, game: Game) {
    fps.text = Math.round(time.FPS)

    if (game.gamestate === 'menu') {
        renderMenu(time, app, game);
    }

    if (game.gamestate === 'playing') {
        renderGame(time, app, game)
    }

    if (!app.stage.getChildByLabel('fps')) {
        app.stage.addChild(fps);
    }
}

let currentScale = 1;
function renderMenu(time: Ticker, app: Application, game: Game) {

    const stage = app.stage

    currentScale += 0.05 * time.deltaTime

    const currentStartText = app.stage.getChildByLabel('start');
    if (currentStartText) {
        (currentStartText as Text).style.fontSize = 16 + (16 * Math.abs(Math.sin(currentScale)));
    } else {
        const text = new Text({
            text: 'Click to Start',
            style: {
                fill: 0xffffff,
                fontSize: 16 + (16 * Math.abs(Math.sin(currentScale)))
            },
            label: 'start'
        })

        text.anchor.set(0.5)
        text.position.set(app.screen.width / 2, app.screen.height / 2)
        text.eventMode = 'dynamic'

        text.addEventListener('click', (e) => {
            e.preventDefault();
            game.gamestate = 'playing'
            app.stage = new Container();
            game.reset();
            buildUi(app, game)
        })

        stage.addChild(text)
    }
}

function renderGame(time: Ticker, app: Application, game: Game) {

    const stage = app.stage;

    const board = stage.getChildByLabel('board')!;

    board.children.map((el) => {
        if (el instanceof Sprite) {
            el.destroy()
        }
    })

    stage.getChildByLabel('next')?.destroy()

    for (let row = 0; row < game.height; row++) {
        for(let col = 0; col < game.width; col++) {

            const point = new Point(col, row);

            if (game.state.hasBlock(point)) {

                const block = game.state.getBlock(point)!

                const sprite = Sprite.from('tetromino.webp');
                sprite.position.set(col * sprite.width, row * sprite.height)
                sprite.tint = block.color
                board.addChild(sprite)
            }
        }
    }

    const tetromino = game.state.tetromino;
    const position = game.state.tetrominoPosition;
    for (let block of Object.values(tetromino.blocks)) {
        const sprite = Sprite.from('tetromino.webp');
        sprite.position.set((block.point.x + position.x) * sprite.width, (block.point.y + position.y) * sprite.height)
        sprite.tint = block.color
        board.addChild(sprite)
    }

    const nextWrapper = new Container();

    const nextBlocks = Object.values<Block>(game.state.blockBag.previewNext().blocks).map((block) => {
        const sprite = Sprite.from('tetromino.webp');
        sprite.position.set(block.point.x * sprite.width, block.point.y * sprite.height)
        return sprite
    })

    nextWrapper.addChild(...nextBlocks);
    nextWrapper.label = 'next'
    nextWrapper.x = board.getBounds().right + 32
    nextWrapper.y = 32
    stage.addChild(nextWrapper)

    let scoreText = stage.getChildByLabel('score')

    if (scoreText) {
        (scoreText as Text).text = game.score
    } else {
        const score = new Text({
            text: game.score,
            style: {
                fill: 0xffffff,
            },
            label: 'score'
        })

        score.anchor.set(1, 1)
        score.position.y = board.getBounds().bottom;
        score.position.x = board.getBounds().left - 32;

        stage.addChild(score)
    }

    let speedText = stage.getChildByLabel('speed')
    if (speedText) {
        (speedText as Text).text = game.speed
    } else {
        const speedText = new Text({
            text: game.speed,
            style: {
              fill: 0xffffff,
            },
            label: 'speed'
          })
          speedText.position.y = 32;
          stage.addChild(speedText)

    }
}
