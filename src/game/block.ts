import { Point } from "../utils";

export class Block {
    private _point: Point
    private _color: number;

    constructor(point: Point, color: number = 0xffffff) {
        this._point = point
        this._color = color
    }

    get point() {
        return this._point
    }

    get color() {
        return this._color
    }
}
