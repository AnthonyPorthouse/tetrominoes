export class Point {
    public readonly x: number
    public readonly y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(other: Point) {
        return new Point(this.x + other.x, this.y + other.y)
    }

    public toKey() {
        return `${this.x},${this.y}`
    }

    get [Symbol.toStringTag]() {
        return this.toKey()
    }

    static fromKey(key: string) {
        const [x, y] = key.split(',')

        return new Point(Number(x), Number(y))
    }
}
