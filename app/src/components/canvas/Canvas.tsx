import React from "react";
import CanvasContent, { ICanvasContent, Tile, Char, Obj } from "./CanvasContent";
import Character from "./Character";
import { IRootState, ReduxThunkDispatch } from "../../store";
import { connect } from "react-redux";
import { setCanvasContent } from "../../actions/problemActions";
import { CanvasTab } from "../../containers/Creator";


interface ICanvasProps {
    content: ICanvasContent;
    setContent: (content: ICanvasContent) => void;

    size: number;

    tileSprite: HTMLImageElement | null;
    charSprite: HTMLImageElement | null;
    objSprite: HTMLImageElement | null;

    pen?: Tile | Char | Obj;
    currentTab?: CanvasTab;

    editable: boolean;
}

class Canvas extends React.Component<ICanvasProps> {

    private canvas: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D | null = null;

    private animationFrameRequestId: number | null = null;
    private renderStartTime: number = 0;
    private renderDelta: number = 0;
    private fpsStartTime: number = 0;
    private fps: number = 0;

    private buttons = [false, false, false];
    private mouse = { x: -1, y: -1 };

    private content: CanvasContent | null = null;

    constructor(props: ICanvasProps) {
        super(props);
        this.canvas = React.createRef();
    }

    // canvas
    private start() {
        if (this.props.tileSprite && this.props.charSprite && this.props.objSprite) {
            this.content = new CanvasContent(this.props.content, this.props.tileSprite, this.props.charSprite, this.props.objSprite);
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
                    let mouseX = this.mouse.x * canvas.width;
                    let mouseY = this.mouse.y * canvas.height;
                    let x = Math.floor(mouseX / width);
                    let y = Math.floor(mouseY / height);
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.fillRect(x * width, y * height, width, height);
                    ctx.fillStyle = "red";
                    ctx.font = "30px Arial";
                    ctx.fillText(`x: ${x}, y: ${y}`, mouseX, mouseY);

                    if (this.buttons[0] && this.props.currentTab) {
                        switch (this.props.currentTab) {
                            case "Terrain":
                                this.content.setTerrain(x, y, this.props.pen as Tile);
                                break;
                            case "Characters":
                                this.content.addCharacter(new Character(x, y, this.props.pen as Char));
                                this.buttons[0] = false;
                                break;
                            case "Objects":
                                this.content.setObject(x, y, this.props.pen as Obj);
                                this.buttons[0] = false;
                                break;
                            default:
                        }
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
        this.buttons = [false, false, false];
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

        if (this.content) {
            this.props.setContent(this.content.getContent());
        }
    }

    render() {
        return <div>
            <canvas
                ref={this.canvas}
                className="w-100 h-100 border"
                onContextMenu={e => e.preventDefault()}>
            </canvas>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    content: state.problem.canvas
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    setContent: (content: ICanvasContent) => dispatch(setCanvasContent(content))
});

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
