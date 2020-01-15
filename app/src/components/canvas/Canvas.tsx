import React from "react";
import CanvasContent, { ICanvasContent, Tile, Char, Obj, WinningCondition } from "./CanvasContent";
import Character from "./Character";
import { IRootState, ReduxThunkDispatch } from "../../store";
import { connect } from "react-redux";
import { setCanvasContent, changed } from "../../actions/problemActions";
import { CanvasTab } from "../../containers/Creator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import GameEndModal from "./GameEndModal";
import { IProblemDeduction } from "../../models/Problem";
import { toast } from "react-toastify";

const Blockly = require("blockly");
const BlocklyJS = require("blockly/javascript");


export interface ICanvasProps {
    problemID?: number;

    content: ICanvasContent;
    code: string;
    score: number;
    maxUsedBlocks: number;
    maxMoveTimes: number;
    deduction: IProblemDeduction[];
    setContent: (content: ICanvasContent) => void;
    changed: () => void;

    terrainSize?: number;
    winningCondition?: WinningCondition;

    tileSprite: HTMLImageElement | null;
    charSprite: HTMLImageElement | null;
    objSprite: HTMLImageElement | null;

    pen?: Tile | Char | Obj;
    currentTab?: CanvasTab;

    editable: boolean;
}

interface ICanvasState {
    running: boolean;
    endGameModal: boolean;
    gameFailed: boolean;
}

/* eslint no-eval: 0 */
class Canvas extends React.Component<ICanvasProps, ICanvasState> {

    private canvas: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D | null = null;

    private animationFrameRequestId: number | null = null;
    private renderStartTime: number = 0;
    private renderDelta: number = 0;

    private buttons = [false, false, false];
    private mouse = { x: -1, y: -1 };

    private content: CanvasContent | null = null;

    private blockCount = 0;

    constructor(props: ICanvasProps) {
        super(props);
        this.state = {
            running: false,
            endGameModal: false,
            gameFailed: false
        };
        this.canvas = React.createRef();
    }

    // canvas
    private start() {
        if (this.props.tileSprite && this.props.charSprite && this.props.objSprite) {
            this.content = new CanvasContent(this.props.content, this.props.tileSprite, this.props.charSprite, this.props.objSprite, this.gameEnd);
        }

        this.animationFrameRequestId = window.requestAnimationFrame(this.gameloop);
    }

    private gameloop = (timestamp: number) => {
        this.renderDelta += (timestamp - this.renderStartTime) / (1000 / 30);
        this.renderStartTime = timestamp;

        let updated = false;
        while (this.renderDelta >= 1) {
            this.renderDelta--;

            if (this.content && this.state.running) {
                this.content.update();
            }

            updated = true;
        }
        if (updated) {
            let ctx = this.ctx;
            let canvas = this.canvas.current;
            if (ctx && canvas && this.content) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerWidth;
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

                    if (!this.state.running) {
                        if (this.buttons[0]) {
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
                            this.props.setContent(this.content.getContent());
                            this.props.changed();
                        } else if (this.buttons[2]) {
                            switch (this.props.currentTab) {
                                case "Terrain":
                                    this.content.setTerrain(x, y, Tile.GRASS);
                                    break;
                                case "Characters":
                                    this.content.removeCharacter(x, y);
                                    break;
                                case "Objects":
                                    this.content.setObject(x, y, null);
                                    break;
                                default:
                            }
                            this.props.setContent(this.content.getContent());
                            this.props.changed();
                        }
                    }
                }
            }
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

    private mouseLeave = () => {
        this.mouse = { x: -1, y: -1 };
        this.buttons = [false, false, false];
    };

    private run = () => {
        this.setState({ ...this.state, running: !this.state.running });

        if (!this.state.running) {
            if (this.props.code) {
                const workspace = new Blockly.Workspace();
                Blockly.Xml.appendDomToWorkspace(Blockly.Xml.textToDom(this.props.code), workspace);

                this.blockCount = workspace.getAllBlocks().filter((block: any) => !block.isShadow_).length;

                const code = BlocklyJS.workspaceToCode(workspace);
                try {
                    (function (code: string) {
                        eval(code);
                    }).call({
                        getPlayer: (id: number) => this.content ? this.content.getCharacter(id) : null,
                        getContent: () => this.content
                    }, code);
                } catch (err) {
                    toast.error(err.message);
                }
            }
        }
    };

    private gameEnd = (failed: boolean, score: number) => {
        this.setState({ ...this.state, gameFailed: failed, endGameModal: true });
        this.run();
    };

    componentDidUpdate() {
        if (this.content) {
            if (this.props.tileSprite && this.props.charSprite && this.props.objSprite && !this.state.running) {
                this.content = new CanvasContent(this.props.content, this.props.tileSprite, this.props.charSprite, this.props.objSprite, this.gameEnd);
            }
            if (this.props.terrainSize && this.props.terrainSize !== this.content.getTerrainSize()) {
                this.content.setTerrainSize(this.props.terrainSize);
            }
            if (this.props.winningCondition) {
                this.content.setWinningCondition(this.props.winningCondition);
            }
        }

        if (this.props.code) {
            const workspace = new Blockly.Workspace();
            Blockly.Xml.appendDomToWorkspace(Blockly.Xml.textToDom(this.props.code), workspace);
            this.blockCount = workspace.getAllBlocks().filter((block: any) => !block.isShadow_).length;
        }
    }

    // react component
    componentDidMount() {
        if (this.canvas.current) {
            this.ctx = this.canvas.current.getContext("2d");
            this.start();

            this.canvas.current.addEventListener("mousemove", this.mouseMove);
            this.canvas.current.addEventListener("mousedown", this.mouseDown);
            this.canvas.current.addEventListener("mouseup", this.mouseUp);
            this.canvas.current.addEventListener("mouseleave", this.mouseLeave);
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

        if (this.content && !this.state.running) {
            this.props.setContent(this.content.getContent());
        }
    }

    render() {
        return <div id="canvas-container">
            <GameEndModal
                show={this.state.endGameModal}
                handleClose={() => {
                    this.setState({
                        ...this.state,
                        endGameModal: false
                    });
                }}
                problemID={this.props.problemID}
                score={this.props.score}
                blockCount={this.blockCount}
                movedTime={this.content ? this.content.getMovedTime() : 0}
                missedObjects={this.content ? this.content.getMissedObjects() : 0}
                maxUsedBlocks={this.props.maxUsedBlocks}
                maxMoveTimes={this.props.maxMoveTimes}
                deduction={this.props.deduction}
                failed={this.state.gameFailed} />
            <canvas
                ref={this.canvas}
                className="w-100 h-100 border"
                onContextMenu={e => e.preventDefault()}>
            </canvas>
            <button
                className={"m-1 btn btn-" + (this.state.running ? "danger" : "success")}
                onClick={this.run}>
                <FontAwesomeIcon icon={this.state.running ? faStop : faPlay} />
            </button>
            <h5 className="float-right px-2">Block Used: {this.blockCount}</h5>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    content: state.problem.canvas,
    code: state.problem.code,
    score: state.problem.score,
    maxUsedBlocks: state.problem.maxUsedBlocks,
    maxMoveTimes: state.problem.maxMoveTimes,
    deduction: state.problem.deduction
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    setContent: (content: ICanvasContent) => dispatch(setCanvasContent(content)),
    changed: () => dispatch(changed())
});

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
