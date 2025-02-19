import { Sprite } from "pixi.js";
import { Point } from "../utils";

export class Block {
  private _point: Point;
  private _color: number;

  constructor(point: Point, color: number = 0xffffff) {
    this._point = point;
    this._color = color;
  }

  get point() {
    return this._point;
  }

  set point(p: Point) {
    this._point = p;
  }

  get color() {
    return this._color;
  }

  render(offset?: Point) {
    const pos = this.point.add(offset ?? new Point(0, 0));

    const sprite = Sprite.from("tetromino.webp");
    sprite.position.set(pos.x * sprite.width, pos.y*sprite.height);
    sprite.tint = this.color;
    sprite.label = "block";

    return sprite;
  }
}
