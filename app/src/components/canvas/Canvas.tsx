import React from "react";
import CanvasContent from "./CanvasContent";
import tileSprite from "./tileSprite.png";
import charSprite from "./charSprite.png";
import GameObject from "./GameObject";


interface ICanvasProps {
    size: number;
    terrain: number[][] | "empty";

    editable: boolean;
}

export default class Canvas extends React.Component<ICanvasProps> {

    private canvas: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D | null = null;

    private animationFrameRequestId: number | null = null;
    private renderStartTime: number = 0;
    private renderDelta: number = 0;
    private fpsStartTime: number = 0;
    private fps: number = 0;

    private buttons = [false, false, false];
    private mouse = { x: -1, y: -1 };

    private tilsSpriteImg: React.RefObject<HTMLImageElement>;
    private charSpriteImg: React.RefObject<HTMLImageElement>;
    private content: CanvasContent | null = null;

    public tilePen = 1;

    constructor(props: ICanvasProps) {
        super(props);
        this.canvas = React.createRef();
        this.tilsSpriteImg = React.createRef();
        this.charSpriteImg = React.createRef();
    }

    // canvas
    private start() {
        if (this.tilsSpriteImg.current && this.charSpriteImg.current) {
            const size = 8;
            let terrain: number[][] = [];
            for (let x = 0; x < size; x++) {
                terrain.push(Array(size).fill(0));
            }
            this.content = new CanvasContent(size,
                this.props.terrain === "empty" ? terrain : this.props.terrain,
                this.tilsSpriteImg.current, this.charSpriteImg.current);

            this.content.addGameObject(new GameObject(0, 0, 0));
        }

        this.fpsStartTime = this.renderStartTime = performance.now();
        this.animationFrameRequestId = window.requestAnimationFrame(this.gameloop);
    }

    private gameloop = (timestamp: number) => {
        this.renderDelta += (timestamp - this.renderStartTime) / (1000 / 30);
        this.renderStartTime = timestamp;

        let updated = false;
        while (this.renderDelta >= 1) {
            this.renderDelta--;
            
            if (this.content) {
                this.content.update();
            }

            updated = true;
        }
        if (updated) {
            this.fps++;

            let ctx = this.ctx;
            let canvas = this.canvas.current;
            if (ctx && canvas && this.content) {
                canvas.width = this.props.size;
                canvas.height = this.props.size;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.content.render(ctx, canvas);

                if (this.props.editable) {
                    const terrainSize = this.content.getTerrainSize();
                    let width = canvas.width / terrainSize;
                    let height = canvas.height / terrainSize;
                    let x = Math.floor((this.mouse.x * canvas.width) / width);
                    let y = Math.floor((this.mouse.y * canvas.height) / height);
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.fillRect(x * width, y * height, width, height);

                    if (this.buttons[0]) {
                        this.content.setTerrain(x, y, this.tilePen);
                    } else if (this.buttons[2]) {
                        this.content.setTerrain(x, y, 0);
                    }
                }
            }
        }

        // FPS Counter
        const fpsDelta = timestamp - this.fpsStartTime;
        if (fpsDelta > 1000) {
            this.fpsStartTime = timestamp;
            this.fps = 0;
        }

        this.animationFrameRequestId = window.requestAnimationFrame(this.gameloop);
    };

    private mouseMove = (event: MouseEvent) => {
        if (this.canvas.current) {
            let rect = this.canvas.current.getBoundingClientRect();
            this.mouse = {
                x: (event.x - Math.round(rect.x)) / rect.width,
                y: (event.y - Math.round(rect.y)) / rect.height
            };
        }
    };

    private mouseDown = (event: MouseEvent) => {
        this.buttons[event.button] = true;
    };

    private mouseUp = (event: MouseEvent) => {
        this.buttons[event.button] = false;
    };

    private mouseLeave = (event: MouseEvent) => {
        this.mouse = { x: -1, y: -1 };
    };

    // react component
    componentDidMount() {
        if (this.canvas.current) {
            this.ctx = this.canvas.current.getContext("2d");
            this.start();

            if (this.props.editable) {
                this.canvas.current.addEventListener("mousemove", this.mouseMove);
                this.canvas.current.addEventListener("mousedown", this.mouseDown);
                this.canvas.current.addEventListener("mouseup", this.mouseUp);
                this.canvas.current.addEventListener("mouseleave", this.mouseLeave);
            }
        }
    }

    componentWillUnmount() {
        if (this.canvas.current && this.animationFrameRequestId !== null) {
            cancelAnimationFrame(this.animationFrameRequestId);
            this.canvas.current.removeEventListener("mousemove", this.mouseMove);
            this.canvas.current.removeEventListener("mousedown", this.mouseDown);
            this.canvas.current.removeEventListener("mouseup", this.mouseUp);
            this.canvas.current.removeEventListener("mouseleave", this.mouseLeave);
        }
    }

    render() {
        return <div>
            <img ref={this.tilsSpriteImg} src={tileSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.charSpriteImg} src={charSprite} className={"d-none"} alt={"sprite"} />
            <canvas ref={this.canvas} className="w-100 h-100 border" onContextMenu={e => e.preventDefault()}></canvas>
        </div>
    }

}
