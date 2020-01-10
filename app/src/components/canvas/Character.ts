import { SIZE, EIGHT, getSpritePos, Char, Tile, Obj } from "./CanvasContent";


export default class Character {

    private moveTo: number[] = [];
    private moving = 0;
    private flip = false;

    public collected: Obj[] = [];

    private standOffset = {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2
    };

    constructor(private x: number, private y: number, private type: Char) { }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getAbsY(tileHeight: number) {
        return (this.y + 0.6 + this.standOffset.x) * tileHeight + (this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][1] * tileHeight / 2 * this.moving * 2 : 0);
    }

    export() {
        return {
            x: this.x,
            y: this.y,
            type: this.type
        }
    }

    move(dir: number) {
        this.moveTo.push(dir);
    }

    update(terrain: Tile[][]) {
        if (this.moveTo.length > 0 && this.moveTo[0] >= 0 && this.moveTo[0] < 4) {
            const x = this.x + EIGHT[this.moveTo[0]][0];
            const y = this.y + EIGHT[this.moveTo[0]][1];
            if (x >= 0 && x < terrain.length && y >= 0 && y < terrain[x].length && terrain[x][y] === Tile.ROAD) {
                this.moving += 0.05;
                this.flip = this.x > x;
                if (this.moving >= 1) {
                    this.moveTo.shift();
                    this.moving = 0;
                    this.x = x;
                    this.y = y;
                }
            } else {
                this.moveTo.shift();
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, tileWidth: number, tileHeight: number, sprite: HTMLImageElement) {
        const width = tileWidth * 0.5;
        const height = tileHeight * 0.5
        const ip = getSpritePos(this.type);

        const jumpHeight = this.moveTo.length ? Math.pow(Math.sin(this.moving * 2 * Math.PI), 2) : 0;

        const mx = this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][0] * width * this.moving * 2 : 0;
        const my = this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][1] * height * this.moving * 2 : 0;

        const angle = this.moveTo.length > 0 ? Math.cos(this.moving * 2 * Math.PI) : 0;

        ctx.save();
        ctx.translate((this.x + 0.5 + this.standOffset.x) * tileWidth + mx, (this.y + 0.6 - jumpHeight * 0.1 + this.standOffset.x) * tileHeight + my);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.4, height * 0.2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.rotate(12 * angle * Math.PI / 180);
        if (this.flip) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(sprite, ip.x, ip.y, SIZE, SIZE, -0.5 * width, -1 * height, width, height);
        ctx.restore();
    }

}
