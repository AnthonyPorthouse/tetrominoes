export class Point {
    public readonly x: number
    public readonly y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toKey() {
        return `${this.x},${this.y}`
    }

    static fromKey(key: string) {
        const [x, y] = key.split(',')

        return new Point(Number(x), Number(y))
    }
}
