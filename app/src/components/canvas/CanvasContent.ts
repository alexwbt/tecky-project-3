import Character from "./Character";
import GameObject from "./GameObject";

export const SIZE = 16;
export const SPRITE_SIZE = 8;

// Tiles
export enum Tile {
    GRASS,
    ROAD,
    WATER
}

// Chars
export enum Char {
    JASON,
    OWEN,
    PATRICK,
    HARRY,
    SHERMAN,
    WALLACE,
    RONALD,
    RAYMEND,
    STEVEN,
    OTIS,
    ANDY,
    SUNNY
}

// Objs
export enum Obj {
    GOLD_COIN,
    SILV_COIN,
    BLUE_GEM,
    GREEN_GEM,
    SPARKS,
    FLAG
}

export enum WinningCondition {
    ALL_PLAYER_GOT_FLAG = "All Players Got A Flag",
    ANY_PLAYER_GOT_FLAG = "Any Player Got A Flag",
    ALL_OBJECT_COLLECTED = "All Objects Collected"
}

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
    terrain?: Tile[][];
    objs?: (Obj | null)[][];
    chars?: { x: number, y: number, type: Char }[];
}

export default class CanvasContent {

    private terrainSize: number;
    private terrain: Tile[][];
    private tileSprite: HTMLImageElement;
    private charSprite: HTMLImageElement;
    private objSprite: HTMLImageElement;

    private chars: Character[];
    private objs: (GameObject | null)[][];
    private initObjCount = 0;

    private winningCondition: WinningCondition = WinningCondition.ANY_PLAYER_GOT_FLAG;
    private score = 0;

    private coinAudio = new Audio("/coin.wav");

    constructor(
        content: ICanvasContent,
        tileSprite: HTMLImageElement,
        charSprite: HTMLImageElement,
        objSprite: HTMLImageElement,
        private gameEnd: (failed: boolean, score: number) => void) {
        if (!content.terrainSize || !content.terrain) {
            this.terrainSize = 0;
            this.terrain = [];
            this.setTerrainSize(8);
        } else {
            this.terrainSize = content.terrainSize;
            this.terrain = content.terrain;
        }

        this.chars = [];
        if (content.chars) {
            content.chars.map(char => this.addCharacter(new Character(char.x, char.y, char.type)))
        }

        this.objs = [];
        for (let x = 0; x < this.terrainSize; x++) {
            this.objs[x] = Array(this.terrainSize).fill(null);
            if (content.objs) {
                for (let y = 0; y < this.terrainSize; y++) {
                    if (content.objs[x][y] !== null) {
                        this.objs[x][y] = new GameObject(content.objs[x][y] as Obj);
                        this.initObjCount++;
                    }
                }
            }
        }

        this.tileSprite = tileSprite;
        this.charSprite = charSprite;
        this.objSprite = objSprite;
    }

    setWinningCondition(condition: WinningCondition) {
        this.winningCondition = condition;
    }

    addCharacter(obj: Character) {
        const char = this.chars.find(o => o.getX() === obj.getX() && o.getY() === obj.getY());
        if (!char) {
            this.chars.push(obj);
        }
    }

    getCharacter(id: number): Character | undefined {
        return this.chars[id];
    }

    removeCharacter(x: number, y: number) {
        this.chars = this.chars.filter(char => char.getX() !== x || char.getY() !== y);
    }

    getMovedTime() {
        let movedTime = 0;
        for (let i = 0; i < this.chars.length; i++) {
            movedTime += this.chars[i].getMovedTime();
        }
        return movedTime;
    }

    getMissedObjects() {
        let collected = 0;
        for (let i = 0; i < this.chars.length; i++) {
            collected += this.chars[i].collected.length;
        }
        return this.initObjCount - collected;
    }

    setTerrainSize(size: number) {
        const rs = Math.min(Math.max(size, 8), 16);
        if (rs !== this.terrainSize) {
            let terrain: Tile[][] = [];
            for (let x = 0; x < rs; x++) {
                terrain.push(Array(rs).fill(Tile.GRASS));
            }
            this.terrainSize = rs;
            this.terrain = terrain;

            this.objs = [];
            for (let x = 0; x < this.terrainSize; x++) {
                this.objs[x] = Array(this.terrainSize).fill(null);
            }
        }
    }

    setTerrain(x: number, y: number, tile: Tile) {
        if (x >= 0 && x < this.terrainSize && y >= 0 && y < this.terrainSize) {
            this.terrain[x][y] = tile;
        }
    }

    isRoad(char: Character, dir: number) {
        if (dir >= 0 && dir < 4) {
            const x = char.getX() + EIGHT[dir][0];
            const y = char.getY() + EIGHT[dir][0];
            if (x >= 0 && x < this.terrainSize && y >= 0 && y < this.terrainSize)
                return this.terrain[x][y] === Tile.ROAD;
            else return false;
        }
        return false;
    }

    setObject(x: number, y: number, obj: Obj | null) {
        if (x >= 0 && x < this.terrainSize && y >= 0 && y < this.terrainSize) {
            this.objs[x][y] = obj !== null ? new GameObject(obj) : null;
        }
    }

    getTerrainSize() {
        return this.terrainSize;
    }

    getContent() {
        return {
            terrainSize: this.terrainSize,
            terrain: this.terrain,
            chars: this.chars.map(char => char.export()),
            objs: this.objs.map(x => x.map(y => y ? y.getType() : null))
        };
    }

    // updating
    update() {
        this.chars.forEach(char => char.update(this.terrain));

        for (let x = 0; x < this.terrainSize; x++) {
            for (let y = 0; y < this.terrainSize; y++) {
                if (this.objs[x][y]) {
                    this.objs[x][y]?.update();
                    const obj = (this.objs[x][y] as GameObject).getType();
                    if (obj !== 4) {
                        const char = this.chars.find(char => char.getX() === x && char.getY() === y);
                        if (char) {
                            this.coinAudio.play();
                            char.collected.push(obj);
                            this.objs[x][y] = new GameObject(Obj.SPARKS);
                            setTimeout(() => this.objs[x][y] = null, 200);
                        }
                    }
                }
            }
        }

        switch (this.winningCondition) {
            case WinningCondition.ANY_PLAYER_GOT_FLAG:
                for (let i = 0; i < this.chars.length; i++) {
                    if (this.chars[i].collected.includes(Obj.FLAG)) {
                        this.gameEnd(false, this.score);
                        break;
                    }
                }
                break;
            case WinningCondition.ALL_PLAYER_GOT_FLAG:
                let allChars = true;
                for (let i = 0; i < this.chars.length; i++) {
                    if (!this.chars[i].collected.includes(Obj.FLAG)) {
                        allChars = false;
                        break;
                    }
                }
                if (allChars) {
                    this.gameEnd(false, this.score);
                }
                break;
            case WinningCondition.ALL_OBJECT_COLLECTED:
                let allTarrs = true;
                out:
                for (let x = 0; x < this.terrainSize; x++) {
                    for (let y = 0; y < this.terrainSize; y++) {
                        if (this.objs[x][y] !== null) {
                            allTarrs = false;
                            break out;
                        }
                    }
                }
                if (allTarrs) {
                    this.gameEnd(false, this.score);
                }
                break;
        }
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
                    case Tile.ROAD:
                        this.renderTile2(ctx, x, y, width, height, 1);
                        break;
                    case Tile.WATER:
                        this.renderTile2(ctx, x, y, width, height, 7, true, 13);
                        break;
                    default:
                        this.renderTile(ctx, this.terrain[x][y], x, y, width, height);
                }
            }
        }

        for (let x = 0; x < this.terrainSize; x++) {
            if (this.objs[x]) {
                for (let y = 0; y < this.terrainSize; y++) {
                    this.objs[x][y]?.render(ctx, x, y, width, height, this.objSprite);
                }
            }
        }

        this.chars.slice().sort((a, b) => a.getAbsY(height) - b.getAbsY(height)).forEach(obj => obj.render(ctx, width, height, this.charSprite));
    }

    private renderTile(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, width: number, height: number) {
        const ip = getSpritePos(i);
        ctx.drawImage(this.tileSprite, ip.x, ip.y, SIZE, SIZE, x * width, y * height, width, height);
    }

    private renderTile2(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, offset: number, corner = false, cornerIndex = 0) {
        let near: number[] = [];
        let count = 0;
        for (let i = 0; i < EIGHT.length / 2; i++) {
            let ix = x + EIGHT[i][0];
            let iy = y + EIGHT[i][1];
            if (ix >= 0 && ix < this.terrainSize && iy >= 0 && iy < this.terrainSize) {
                near.push(this.terrain[ix][iy]);
                if (this.terrain[ix][iy] === this.terrain[x][y]) {
                    count++;
                }
            } else {
                near.push(-1);
            }
        }
        let off = this.getOffset(near, count, this.terrain[x][y]);
        if (count > 2 || off.offset) {
            offset++;
        }
        ctx.save();
        ctx.translate((x + 0.5) * width, (y + 0.5) * height);
        ctx.rotate(off.angle * Math.PI / 180);
        const i = offset + count;
        const ip = getSpritePos(i);
        ctx.drawImage(this.tileSprite, ip.x, ip.y, SIZE, SIZE, -0.5 * width, -0.5 * height, width, height);

        ctx.restore();

        if (corner) {
            this.renderTileCorner(ctx, x, y, width, height, cornerIndex, near, count);
        }
    }

    private renderTileCorner(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, index: number, nearFour: number[], count: number) {
        let corners: number[] = [];
        let cornerCount = 0;
        for (let i = 4; i < EIGHT.length; i++) {
            let ix = x + EIGHT[i][0];
            let iy = y + EIGHT[i][1];
            if (ix >= 0 && ix < this.terrainSize && iy >= 0 && iy < this.terrainSize) {
                corners.push(this.terrain[ix][iy]);
                cornerCount += this.terrain[ix][iy] === this.terrain[x][y] ? 1 : 0;
            } else {
                corners.push(-1);
            }
        }

        const offs = [
            [-0.5, -0.5, nearFour[0], nearFour[2]],
            [-0.5, 0, nearFour[0], nearFour[3]],
            [0, -0.5, nearFour[2], nearFour[1]],
            [0, 0, nearFour[1], nearFour[3]],
        ];

        ctx.save();
        ctx.translate((x + 0.5) * width, (y + 0.5) * height);
        const ip = getSpritePos(index);
        for (let i = 0; i < corners.length; i++) {
            if (count + cornerCount >= 8) {
                ctx.drawImage(this.tileSprite, ip.x, ip.y, SIZE, SIZE, -0.5 * width, -0.5 * height, width, height);
            } else if (corners[i] === this.terrain[x][y]
                && offs[i][2] === this.terrain[x][y]
                && offs[i][3] === this.terrain[x][y]) {
                ctx.drawImage(this.tileSprite, ip.x, ip.y, SIZE / 2, SIZE / 2, offs[i][0] * width, offs[i][1] * height, width / 2, height / 2);
            }
        }
        ctx.restore();
    }

    private getOffset(near: number[], count: number, tile: number) {
        let angle = 0, offset = false;
        switch (count) {
            case 1:
                if (near[0] === tile) angle = 90;
                else if (near[1] === tile) angle = -90;
                else if (near[2] === tile) angle = 180;
                break;
            case 2:
                if (near[0] === tile) {
                    if (near[1] === tile) { offset = true; angle = 90; }
                    else if (near[3] === tile) angle = 90;
                    else if (near[2] === tile) angle = 180;
                } else if (near[2] === tile) {
                    if (near[3] === tile) offset = true;
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

}

