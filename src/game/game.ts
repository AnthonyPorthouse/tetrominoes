import { State } from "./state";

export class Game {
    private _width: number
    private _height: number

    private _state: State
    private _score: number = 0
    private _speed: number = 1000

    private readonly _initialSpeed = 1000

    private _gamestate: 'menu' | 'playing' = 'menu'

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;

        this._state = new State(this._width, this._height)
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }

    get speed() {
        return this._speed
    }

    set speed(speed: number) {
        this._speed = Math.round(Math.max(150, speed))
    }

    get score() {
        return this._score
    }

    set score(score: number) {
        this._score = score
    }

    get state() {
        return this._state
    }

    get gamestate() {
        return this._gamestate
    }

    set gamestate(state: typeof this._gamestate) {
        this._gamestate = state
    }

    reset() {
        this._state = new State(this.width, this.height);
        this.score = 0;
        this.speed = this._initialSpeed;
    }
}
