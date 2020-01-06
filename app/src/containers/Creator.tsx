import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/blockly/BlocklyArea";
import Canvas, { Pen } from "../components/canvas/Canvas";
import TabSelect from "../components/TabSelect";
import DescriptionForm from "../components/DescriptionForm";
import ObjSelector from "../components/canvas/ObjSelector";

import tileSprite from "../sprites/tileSprite.png";
import charSprite from "../sprites/charSprite.png";
import { GRASS, ROAD, WATER, BOB, ICanvasContent } from "../components/canvas/CanvasContent";

const BlocklyJS = require("blockly/javascript");


interface ICreatorProps {
    match: {
        params: {
            problemId: number;
        };
    };
}

type Tab = "Description" | "Canvas" | "Code";
type CanvasTab = "Terrain" | "Characters" | "Structures" | "Enemy"

interface ICreatorStates {
    height: number;
    currentTab: Tab;
    canvas: {
        currentTab: CanvasTab;
        pen: Pen;
    };
}

/* eslint no-eval: 0 */
class Creator extends React.Component<ICreatorProps, ICreatorStates> {

    private blocklyArea: React.RefObject<BlocklyArea>;
    private canvas: React.RefObject<Canvas>;
    private tilsSpriteImg: React.RefObject<HTMLImageElement>;
    private charSpriteImg: React.RefObject<HTMLImageElement>;

    constructor(props: ICreatorProps) {
        super(props);
        this.state = {
            height: 0,
            currentTab: "Description",
            canvas: {
                currentTab: "Terrain",
                pen: {
                    type: "tile",
                    value: 1
                }
            }
        };
        this.blocklyArea = React.createRef();
        this.canvas = React.createRef();
        this.tilsSpriteImg = React.createRef();
        this.charSpriteImg = React.createRef();
    }

    private updateHeight = () => {
        const nav = document.getElementById("navagation-bar");
        this.setState({ ...this.state, height: window.innerHeight - (nav ? nav.clientHeight : 0) });
    };

    private selectTile = (tile: number) => {
        if (this.canvas.current) {
            this.setState({
                ...this.state,
                canvas: {
                    ...this.state.canvas,
                    pen: { type: "tile", value: tile }
                }
            });
        }
    };

    private selectChar = (char: number) => {
        if (this.canvas.current) {
            this.setState({
                ...this.state,
                canvas: {
                    ...this.state.canvas,
                    pen: { type: "char", value: char }
                }
            });
        }
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        this.updateHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }

    generateCode() {
        if (this.blocklyArea.current) {
            var code = BlocklyJS.workspaceToCode(this.blocklyArea.current.workspace);
            console.log(code);
            try {
                (function (code: string) {
                    eval(code);
                }).call({
                    testing: () => console.log("test")
                }, code);
            } catch (err) {
                console.log(err.message);
            }
        }
    }

    selectTab(tab: Tab) {
        this.setState({ ...this.state, currentTab: tab });
    }

    selectCanvasTab(tab: CanvasTab) {
        this.setState({ ...this.state, canvas: { ...this.state.canvas, currentTab: tab } });
    }

    uploadProblem() {
        window.alert("saved");
    }

    render() {
        return <>
            <NavBar>
                <TabSelect tabs={[
                    "Description" as Tab,
                    "Canvas" as Tab,
                    "Code" as Tab
                ].map((name: Tab) => ({
                    name: name as string,
                    active: this.state.currentTab === name,
                    callback: this.selectTab.bind(this, name)
                }))} buttons={[
                    {
                        name: "Save",
                        callback: this.uploadProblem.bind(this)
                    }
                ]} color="info" color2="light" />
            </NavBar>
            <img ref={this.tilsSpriteImg} src={tileSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.charSpriteImg} src={charSprite} className={"d-none"} alt={"sprite"} />
            <div className="container-fluid p-0 bg-light">
                <div className="row w-100 m-0" style={{ height: this.state.height }}>
                    {
                        this.state.currentTab === "Description" && <div className="col-6 pt-3">
                            <DescriptionForm />
                        </div>
                    }
                    {
                        this.state.currentTab === "Canvas" && <>
                            <div className="col-4 p-1">
                                <Canvas
                                    tileSprite={this.tilsSpriteImg.current}
                                    charSprite={this.charSpriteImg.current}
                                    pen={this.state.canvas.pen}
                                    ref={this.canvas}
                                    size={16 * 100}
                                    terrain="empty"
                                    editable={true} />
                            </div>
                            <div className="col-8 p-0">
                                <TabSelect tabs={[
                                    "Terrain" as CanvasTab,
                                    "Characters" as CanvasTab,
                                    "Structures" as CanvasTab,
                                    "Enemy" as CanvasTab
                                ].map((name: CanvasTab) => ({
                                    name: name as string,
                                    active: this.state.canvas.currentTab === name,
                                    callback: this.selectCanvasTab.bind(this, name)
                                }))} buttons={[]} color="light" color2="dark" />
                                <div className="p-3">
                                    {
                                        this.state.canvas.currentTab === "Terrain" && <ObjSelector
                                            objs={[
                                                {
                                                    name: "Grass",
                                                    value: GRASS,
                                                    index: 0,
                                                    active: this.state.canvas.pen.type === "tile"
                                                        && this.state.canvas.pen.value === GRASS
                                                },
                                                {
                                                    name: "Road",
                                                    value: ROAD,
                                                    index: 1,
                                                    active: this.state.canvas.pen.type === "tile"
                                                        && this.state.canvas.pen.value === ROAD
                                                },
                                                {
                                                    name: "Grass",
                                                    value: WATER,
                                                    index: 13,
                                                    active: this.state.canvas.pen.type === "tile"
                                                        && this.state.canvas.pen.value === WATER
                                                }
                                            ]}
                                            sprite={this.tilsSpriteImg.current}
                                            select={this.selectTile} />
                                    }
                                    {
                                        this.state.canvas.currentTab === "Characters" && <ObjSelector
                                            objs={[
                                                {
                                                    name: "Bob",
                                                    value: BOB,
                                                    index: 0,
                                                    active: this.state.canvas.pen.type === "char"
                                                        && this.state.canvas.pen.value === BOB
                                                }
                                            ]}
                                            sprite={this.charSpriteImg.current}
                                            select={this.selectChar} />
                                    }
                                </div>
                            </div>
                        </>
                    }
                    {
                        this.state.currentTab === "Code" && <BlocklyArea
                            ref={this.blocklyArea}
                            height={this.state.height}
                            className="col-12 p-0" />
                    }
                </div>
            </div>
        </>
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    // uploadProblem: (canvasContent: ICanvasContent) => dispatch()
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);
