
const SIZE = 16;
const SPRITE_SIZE = 8;

// Tiles
// const GRASS = 0;
const ROAD = 1;

const FOUR = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
];

export interface CanvasContentExport {
    terrain?: number[][];
}

export default class CanvasContent {

    private size: number;
    private terrain: number[][];
    private spriteImg: HTMLImageElement;

    constructor(size: number, terrain: number[][], spriteImg: HTMLImageElement) {
        this.size = size;
        this.terrain = terrain;
        this.spriteImg = spriteImg;
    }

    exportContent() {
        return {
            terrain: this.terrain
        };
    }

    renderTerrain(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        let width = canvas.width / this.size;
        let height = canvas.height / this.size;
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                switch (this.terrain[x][y]) {
                    case ROAD:
                        this.renderRoad(ctx, x, y, width, height);
                        break;
                    default:
                        this.renderTile(ctx, this.terrain[x][y], x, y, width, height);
                }
            }
        }
    }

    private getRoad(near: number[], count: number) {
        let angle = 0, offset = false;
        switch (count) {
            case 1:
                if (near[0] === ROAD) angle = 90;
                else if (near[1] === ROAD) angle = -90;
                else if (near[2] === ROAD) angle = 180;
                break;
            case 2:
                if (near[0] === ROAD) {
                    if (near[1] === ROAD) { offset = true; angle = 90; }
                    else if (near[3] === ROAD) angle = 90;
                    else if (near[2] === ROAD) angle = 180;
                } else if (near[2] === ROAD) {
                    if (near[3] === ROAD) offset = true;
                    else if (near[1] === ROAD) angle = -90;
                }
                break;
            case 3:
                if (near[0] !== ROAD) angle = -90;
                else if (near[1] !== ROAD) angle = 90;
                else if (near[3] !== ROAD) angle = 180;
                break;
            default:
        }
        return { angle, offset };
    }

    private renderRoad(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        let near: number[] = [];
        let count = 0, tileOffset = 1;
        for (let p of FOUR) {
            let ix = x + p[0];
            let iy = y + p[1];
            if (ix >= 0 && ix < this.size && iy >= 0 && iy < this.size) {
                near.push(this.terrain[ix][iy]);
                if (this.terrain[ix][iy] === ROAD) {
                    count++;
                }
            } else {
                near.push(-1);
            }
        }
        let road = this.getRoad(near, count);
        if (count > 2 || road.offset) {
            tileOffset++;
        }
        ctx.save();
        ctx.translate((x + 0.5) * width, (y + 0.5) * height);
        ctx.rotate(road.angle * Math.PI / 180);
        const i = tileOffset + count;
        const ix = i % SPRITE_SIZE;
        const iy = Math.floor(i / SPRITE_SIZE);
        ctx.drawImage(this.spriteImg, ix * SIZE, iy * SIZE, SIZE, SIZE, -0.5 * width, -0.5 * height, width, height);
        ctx.restore();
    }

    private renderTile(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, width: number, height: number) {
        const ix = i % SPRITE_SIZE;
        const iy = Math.floor(i / SPRITE_SIZE);
        ctx.drawImage(this.spriteImg, ix * SIZE, iy * SIZE, SIZE, SIZE, x * width, y * height, width, height);
    }

}

