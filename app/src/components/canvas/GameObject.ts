
const SIZE = 16;
const SPRITE_SIZE = 8;


export default class GameObject {

    private moveTo: {x: number, y: number}[] = [];

    constructor(private x: number, private y: number, private type: number) { }

    move(x: number, y: number) {
        
    }

    update() {

    }

    render(ctx: CanvasRenderingContext2D, tileWidth: number, tileHeight: number, sprite: HTMLImageElement) {
        const width = tileWidth * 0.5;
        const height = tileHeight  * 0.5
        const ix = this.type % SPRITE_SIZE;
        const iy = Math.floor(this.type / SPRITE_SIZE);
        ctx.drawImage(sprite, ix * SIZE, iy * SIZE, SIZE, SIZE, this.x * tileWidth + width / 2, this.y * tileHeight + height * 0.2, width, height);
    }

}
