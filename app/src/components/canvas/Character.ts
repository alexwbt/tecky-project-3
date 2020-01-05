import { SIZE, SPRITE_SIZE, EIGHT, ROAD } from "./CanvasContent";


export default class Character {

    private moveTo: number[] = [];
    private moving = 0;
    private flip = false;

    constructor(private x: number, private y: number, private type: number) {
        setInterval(() => {
            this.move(Math.floor(Math.random() * 4));
        }, 100);
    }

    move(dir: number) {
        this.moveTo.push(dir);
    }

    update(terrain: number[][]) {
        if (this.moveTo.length > 0 && this.moveTo[0] >= 0 && this.moveTo[0] < 4) {
            const x = this.x + EIGHT[this.moveTo[0]][0];
            const y = this.y + EIGHT[this.moveTo[0]][1];
            if (x >= 0 && x < terrain.length && y >= 0 && y < terrain[x].length && terrain[x][y] === ROAD) {
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
        const ix = this.type % SPRITE_SIZE;
        const iy = Math.floor(this.type / SPRITE_SIZE);

        const jumpHeight = this.moveTo.length ? Math.pow(Math.sin(this.moving * 2 * Math.PI), 2) : 0;

        const mx = this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][0] * width * this.moving * 2 : 0;
        const my = this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][1] * height * this.moving * 2 : 0;

        const angle = this.moveTo.length ? Math.cos(this.moving * 2 * Math.PI) : 0;
        console.log(this.flip);
        ctx.save();
        ctx.translate((this.x + 0.5) * tileWidth + mx, (this.y + 0.7 - jumpHeight * 0.1) * tileHeight + my);
        ctx.rotate(12 * angle * Math.PI / 180);
        if (this.flip) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(sprite, ix * SIZE, iy * SIZE, SIZE, SIZE, -0.5 * width, -1 * height, width, height);
        ctx.restore();
    }

}
