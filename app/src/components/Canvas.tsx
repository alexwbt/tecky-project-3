import React from "react";
import CanvasContent from "./CanvasContent";
import sprite from "../sprite.png";

interface ICanvasProps {
    size: number;
    terrain: number[][] | "empty";
}

export default class Canvas extends React.Component<ICanvasProps> {

    private canvas: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D | null = null;

    private animationFrameRequestId: number | null = null;
    private renderStartTime: number = 0;
    private renderDelta: number = 0;
    private fpsStartTime: number = 0;
    private fps: number = 0;

    private spriteImg: React.RefObject<HTMLImageElement>;
    private content: CanvasContent | null = null;

    constructor(props: ICanvasProps) {
        super(props);
        this.canvas = React.createRef();
        this.spriteImg = React.createRef();
    }

    // canvas
    private start() {
        if (this.spriteImg.current) {
            const size = 8;
            let terrain: number[][] = [];
            for (let x = 0; x < size; x++) {
                terrain.push([]);
                for (let y = 0; y < size; y++) {
                    terrain[x].push(Math.floor(Math.random() * 2));
                }
            }
            this.content = new CanvasContent(size, this.props.terrain === "empty" ? terrain : this.props.terrain, this.spriteImg.current);
        }

        this.fpsStartTime = this.renderStartTime = performance.now();
        this.animationFrameRequestId = window.requestAnimationFrame(this.gameloop);
    }

    private gameloop = (timestamp: number) => {
        this.renderDelta += (timestamp - this.renderStartTime) / (1000 / 30);
        this.renderStartTime = timestamp;

        while (this.renderDelta >= 1) {
            this.renderDelta--;
            this.fps++;

            let ctx = this.ctx;
            let canvas = this.canvas.current;
            if (ctx && canvas && this.content) {
                canvas.width = this.props.size;
                canvas.height = this.props.size;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.content.renderTerrain(ctx, canvas);
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
        console.log("mousemove");
    };

    private mouseDown = (event: MouseEvent) => {
        console.log("mousedown");
    };

    private mouseUp = (event: MouseEvent) => {

    };

    // react component
    componentDidMount() {
        if (this.canvas.current) {
            this.ctx = this.canvas.current.getContext("2d");
            this.canvas.current.addEventListener("mousemove", this.mouseMove);
            this.canvas.current.addEventListener("mousedown", this.mouseDown);
            this.start();
        }
    }

    componentWillUnmount() {
        if (this.canvas.current && this.animationFrameRequestId !== null) {
            cancelAnimationFrame(this.animationFrameRequestId);
            this.canvas.current.removeEventListener("mousemove", this.mouseMove);
            this.canvas.current.removeEventListener("mousedown", this.mouseDown);
        }
    }

    render() {
        return <div >
            <img ref={this.spriteImg} src={sprite} className={"d-none"} alt={"sprite"} />
            <canvas ref={this.canvas} className="w-100 h-100 border"></canvas>
        </div>
    }

}
