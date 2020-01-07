import { Obj, getSpritePos, SIZE } from "./CanvasContent";


export default class GameObject {

    private startFrame: number;
    private currentFrame: number = 0;
    private frameCount: number;
    private counter: number = 0;
    private speed: number;

    constructor(private type: Obj) {
        switch (type) {
            case Obj.GOLD_COIN:
                this.startFrame = 0;
                this.frameCount = 5;
                this.speed = 0.25;
                break;
            case Obj.SILV_COIN:
                this.startFrame = 8;
                this.frameCount = 5;
                this.speed = 0.25;
                break;
            case Obj.BLUE_GEM:
                this.startFrame = 16;
                this.frameCount = 4;
                this.speed = 0.25;
                break;
            case Obj.GREEN_GEM:
                this.startFrame = 24;
                this.frameCount = 4;
                this.speed = 0.25;
                break;
        }
    }

    getType() {
        return this.type;
    }

    update() {
        this.counter += this.speed;
        if (this.counter >= 1) {
            this.counter = 0;
            this.currentFrame++;
            this.currentFrame %= this.frameCount;
        }
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, sprite: HTMLImageElement) {
        // const width = tileWidth * 0.5;
        // const height = tileHeight * 0.5
        const ip = getSpritePos(this.startFrame + this.currentFrame);

        // const jumpHeight = this.moveTo.length ? Math.pow(Math.sin(this.moving * 2 * Math.PI), 2) : 0;

        // const mx = this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][0] * width * this.moving * 2 : 0;
        // const my = this.moveTo.length > 0 ? EIGHT[this.moveTo[0]][1] * height * this.moving * 2 : 0;

        // const angle = this.moveTo.length ? Math.cos(this.moving * 2 * Math.PI) : 0;

        // ctx.save();
        // ctx.translate((this.x + 0.5 + this.standOffset.x) * tileWidth + mx, (this.y + 0.6 - jumpHeight * 0.1 + this.standOffset.x) * tileHeight + my);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.ellipse((x + 0.5) * width, (y + 0.5) * height, width * 0.2, height * 0.1, 0, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.rotate(12 * angle * Math.PI / 180);
        // if (this.flip) {
        //     ctx.scale(-1, 1);
        // }
        ctx.drawImage(sprite, ip.x, ip.y, SIZE, SIZE, (x + 0.25) * width, y * height, width / 2, height / 2);
        // ctx.restore();
    }

}
