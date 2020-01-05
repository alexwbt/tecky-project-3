import Character from "./Character";

export const SIZE = 16;
export const SPRITE_SIZE = 8;

// Tiles
export const GRASS = 0;
export const ROAD = 1;
export const WATER = 2;

export function getSpritePos(i: number) {
    const ix = i % SPRITE_SIZE;
    const iy = Math.floor(i / SPRITE_SIZE);
    return {
        x: ix * SIZE,
        y: iy * SIZE
    };
}

export const EIGHT = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    
    // corners
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
];

export interface ICanvasContent {
    terrainSize?: number;
    terrain?: number[][];
}

export default class CanvasContent {

    private terrainSize: number;
    private terrain: number[][];
    private tileSprite: HTMLImageElement;
    private charSprite: HTMLImageElement;

    private objs: Character[] = [];

    constructor(terrainSize: number, terrain: number[][], tileSprite: HTMLImageElement, charSprite: HTMLImageElement) {
        this.terrainSize = terrainSize;
        this.terrain = terrain;
        this.tileSprite = tileSprite;
        this.charSprite = charSprite;
    }

    addCharacter(obj: Character) {
        this.objs.push(obj);
    }

    setTerrain(x: number, y: number, tile: number) {
        if (x >= 0 && x < this.terrainSize && y >= 0 && y < this.terrainSize) {
            this.terrain[x][y] = tile;
        }
    }

    getTerrainSize() {
        return this.terrainSize;
    }

    getContent() {
        return {
            terrainSize: this.terrainSize,
            terrain: this.terrain
        };
    }

    // updating
    update() {
        this.objs.forEach(obj => obj.update(this.terrain));
    }

    // rendering
    render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        let width = canvas.width / this.terrainSize;
        let height = canvas.height / this.terrainSize;
        for (let x = 0; x < this.terrainSize; x++) {
            for (let y = 0; y < this.terrainSize; y++) {
                switch (this.terrain[x][y]) {
                    case ROAD:
                        this.renderTile2(ctx, x, y, width, height, 1, ROAD, false);
                        break;
                    case WATER:
                        this.renderTile2(ctx, x, y, width, height, 7, WATER, true);
                        break;
                    default:
                        this.renderTile(ctx, this.terrain[x][y], x, y, width, height);
                }
            }
        }

        this.objs.forEach(obj => obj.render(ctx, width, height, this.charSprite));
    }

    private renderTile(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, width: number, height: number) {
        const ip = getSpritePos(i);
        ctx.drawImage(this.tileSprite, ip.x, ip.y, SIZE, SIZE, x * width, y * height, width, height);
    }

    private renderTile2(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, offset: number, tile: number, offset2: boolean) {
        let near: number[] = [];
        let count = 0;
        for (let i = 0; i < EIGHT.length; i++) {
            let ix = x + EIGHT[i][0];
            let iy = y + EIGHT[i][1];
            if (ix >= 0 && ix < this.terrainSize && iy >= 0 && iy < this.terrainSize) {
                near.push(this.terrain[ix][iy]);
                if (this.terrain[ix][iy] === tile && (offset2 || i < 4)) {
                    count++;
                }
            } else {
                near.push(-1);
            }
        }
        if (count > 2) {
            offset++;
        }
        let off = offset2 ? this.getOffset2(near, count, tile) : this.getOffset(near, count, tile);
        offset += off.offset;
        ctx.save();
        ctx.translate((x + 0.5) * width, (y + 0.5) * height);
        ctx.rotate(off.angle * Math.PI / 180);
        const i = offset + count;
        const ip = getSpritePos(i);
        ctx.drawImage(this.tileSprite, ip.x, ip.y, SIZE, SIZE, -0.5 * width, -0.5 * height, width, height);
        ctx.restore();
    }

    private getOffset(near: number[], count: number, tile: number) {
        let angle = 0, offset = 0;
        switch (count) {
            case 1:
                if (near[0] === tile) angle = 90;
                else if (near[1] === tile) angle = -90;
                else if (near[2] === tile) angle = 180;
                break;
            case 2:
                if (near[0] === tile) {
                    if (near[1] === tile) { offset = 1; angle = 90; }
                    else if (near[3] === tile) angle = 90;
                    else if (near[2] === tile) angle = 180;
                } else if (near[2] === tile) {
                    if (near[3] === tile) offset = 1;
                    else if (near[1] === tile) angle = -90;
                }
                break;
            case 3:
                if (near[0] !== tile) angle = -90;
                else if (near[1] !== tile) angle = 90;
                else if (near[3] !== tile) angle = 180;
                break;
            default:
        }
        return { angle, offset };
    }

    private getOffset2(near: number[], count: number, tile: number) {
        const off = this.getOffset(near, count, tile);
        // off.offset++;
        return off;
    }

}

