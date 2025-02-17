import { getRandomColor, Point } from "../utils";
import { Block } from "./block";

export interface Tetromino {
    readonly position: Point
    rotateClockwise(): void;
    rotateAntiClockwise(): void;
    readonly state: number[]
    readonly blocks: Record<string, Block>
}

export abstract class TetrominoBase implements Tetromino {
    protected _color: number
    protected _state: number
    protected _states: number[][] = []
    protected _size: number = 3;

    constructor() {
        this._color = getRandomColor();
        this._state = 0
    }

    get position(): Point {
        throw new Error("Method not implemented.");
    }

    /**
     * Uses the remainder operator to rotate the value through states forwards
     */
    rotateClockwise() {
        this._state = (this._state + 1) % this._states.length
    }
    /**
     * Applies modulo math to rotate the value through states backwards
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
     */
    rotateAntiClockwise() {
        this._state = (((this._state - 1) % this._states.length) + this._states.length) % this._states.length
    }

    get state() {
        return this._states[this._state]
    }

    get blocks() {
        const state = this.state;
        const blocks: Record<string, Block> = {};

        for (let row = 0; row < this._size; row++) {
            let rowVal = state[row]

            for (let col = 0; col < this._size; col++) {
                const shiftAmount = -col + this._size - 1;
                const shifted = (rowVal >> shiftAmount);

                if ((shifted & 1) === 1) {
                    const point = new Point(col, row);
                    blocks[point.toKey()] = new Block(point, this._color);
                }
            }
        }

        return blocks
    }
}

export class TetrominoO extends TetrominoBase {
    protected _size: number = 4
    protected _states = [
        [
            0b0000,
            0b0110,
            0b0110,
            0b0000,
        ],
    ]
}

export class TetrominoI extends TetrominoBase {
    protected _size: number = 4

    protected _states = [
        [
            0b0000,
            0b1111,
            0b0000,
            0b0000,
        ],
        [
            0b0010,
            0b0010,
            0b0010,
            0b0010,
        ],
        [
            0b0000,
            0b0000,
            0b1111,
            0b0000,
        ],
        [
            0b0100,
            0b0100,
            0b0100,
            0b0100,
        ],
    ]


}

export class TetrominoT extends TetrominoBase {
    protected _states = [
        [
            0b000,
            0b111,
            0b010,
        ],
        [
            0b010,
            0b110,
            0b010,
        ],
        [
            0b010,
            0b111,
            0b000,
        ],
        [
            0b010,
            0b011,
            0b010,
        ],
    ]
}

export class TetrominoJ extends TetrominoBase {
    protected _states = [
        [
            0b100,
            0b111,
            0b000,
        ],
        [
            0b011,
            0b010,
            0b010,
        ],
        [
            0b000,
            0b111,
            0b001,
        ],
        [
            0b010,
            0b010,
            0b110,
        ],
    ]
}

export class TetrominoL extends TetrominoBase {
    protected _states = [
        [
            0b001,
            0b111,
            0b000,
        ],
        [
            0b010,
            0b010,
            0b011,
        ],
        [
            0b000,
            0b111,
            0b100,
        ],
        [
            0b110,
            0b010,
            0b010,
        ],
    ]
}

export class TetrominoS extends TetrominoBase {
    protected _states = [
        [
            0b011,
            0b110,
            0b000,
        ],
        [
            0b010,
            0b011,
            0b001,
        ],
        [
            0b000,
            0b011,
            0b110,
        ],
        [
            0b100,
            0b110,
            0b010,
        ],
    ]
}

export class TetrominoZ extends TetrominoBase {
    protected _states = [
        [
            0b110,
            0b011,
            0b000,
        ],
        [
            0b001,
            0b011,
            0b010,
        ],
        [
            0b000,
            0b110,
            0b011,
        ],
        [
            0b010,
            0b110,
            0b100,
        ],
    ]
}

export class TetrominoBag {
    private tetrominos = [
        new TetrominoI,
        new TetrominoO,
        new TetrominoT,
        new TetrominoL,
        new TetrominoJ,
        new TetrominoS,
        new TetrominoZ,
    ]

    private bag: Tetromino[] = [];

    constructor() {
        this.shuffle();
    }

    private shuffle() {
        this.bag = [...this.tetrominos]
        .map((t) => ({ val: t, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({ val }) => val )
    }

    public getNext(): Tetromino {
        const t = this.bag.shift()!;

        if (this.bag.length === 0) {
            this.shuffle();
        }

        return t;
    }

    public previewNext(): Tetromino {
        return this.bag.at(0)!;
    }
}
