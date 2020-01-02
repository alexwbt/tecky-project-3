import React from "react";


interface ICanvasProps {
    size: number;
}

export default class Canvas extends React.Component<ICanvasProps> {

    private canvas: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D | null = null;

    private animationFrameRequestId: number | null = null;
    private renderStartTime: number = 0;
    private renderDelta: number = 0;
    private fpsStartTime: number = 0;
    private fps: number = 0;

    constructor(props: ICanvasProps) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        if (this.canvas.current) {
            this.ctx = this.canvas.current.getContext("2d");
            this.start();
        }
    }

    componentWillUnmount() {
        if (this.animationFrameRequestId !== null) {
            cancelAnimationFrame(this.animationFrameRequestId);
        }
    }

    start() {
        this.fpsStartTime = this.renderStartTime = performance.now();
        this.animationFrameRequestId = window.requestAnimationFrame(this.gameloop.bind(this));
    }

    gameloop(timestamp: number) {
        this.renderDelta += (timestamp - this.renderStartTime) / (1000 / 30);
        this.renderStartTime = timestamp;
        
        while (this.renderDelta >= 1) {
            this.renderDelta--;
            this.fps++;

        }
        
        // FPS Counter
        const fpsDelta = timestamp - this.fpsStartTime;
        if (fpsDelta > 1000) {
            console.log(this.fps);
            this.fpsStartTime = timestamp;
            this.fps = 0;
            let ctx = this.ctx;
            let canvas = this.canvas.current;
            if (ctx && canvas) {
                ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        this.animationFrameRequestId = window.requestAnimationFrame(this.gameloop.bind(this));
    }

    render() {
        return <div style={{ width: this.props.size, height: this.props.size }}>
            <canvas ref={this.canvas} className="w-100 h-100 border"></canvas>
        </div>
    }

}
