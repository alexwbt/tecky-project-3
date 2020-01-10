import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/blockly/BlocklyArea";
import Canvas from "../components/canvas/Canvas";
import TabSelect from "../components/TabSelect";
import DescriptionForm from "../components/DescriptionForm";
import ObjSelector from "../components/canvas/ObjSelector";
import BlockSelector from "../components/blockly/BlockSelector";
import { Tile, Char, Obj, WinningCondition } from "../components/canvas/CanvasContent";

import tileSprite from "../sprites/tileSprite.png";
import charSprite from "../sprites/charSprite.png";
import objSprite from "../sprites/objectSprite.png";
import { uploadProblem, getProblem } from "../thunks/problemThunk";
import { IProblemState } from "../reducers/problemReducer";
import { getCategoriesThunk } from "../thunks/categoryThunk";
import { getDifficultiesThunk } from "../thunks/difficultyThunks";

import { Prompt } from "react-router-dom";


interface ICreatorProps {
    match: {
        params: {
            problemId: number;
        };
    };
    problem: IProblemState;
    uploadProblem: (problem: IProblemState) => void;
    getProblem: (id: number) => void;
    getCategories: () => void;
    getDifficulties: () => void;
}

enum Tab {
    DES = "Description",
    EDITOR = "Editor",
    CODE = "Code"
}
export type CanvasTab = "Terrain" | "Characters" | "Objects" | "Enemy";

interface ICreatorStates {
    height: number;
    currentTab: Tab;
    canvas: {
        currentTab: CanvasTab;
        pen: Tile | Char | Obj;
        terrainSize: number;
        winningCondition: WinningCondition;
    };
    saving: boolean;
}

class Creator extends React.Component<ICreatorProps, ICreatorStates> {

    private tileSpriteImg: React.RefObject<HTMLImageElement>;
    private charSpriteImg: React.RefObject<HTMLImageElement>;
    private objSpriteImg: React.RefObject<HTMLImageElement>;

    constructor(props: ICreatorProps) {
        super(props);
        this.state = {
            height: 0,
            currentTab: Tab.DES,
            canvas: {
                currentTab: "Terrain",
                pen: 0,
                terrainSize: 8,
                winningCondition: WinningCondition.ANY_PLAYER_GOT_FLAG
            },
            saving: false
        };
        this.tileSpriteImg = React.createRef();
        this.charSpriteImg = React.createRef();
        this.objSpriteImg = React.createRef();
    }

    private updateHeight = () => {
        const nav = document.getElementById("navagation-bar");
        this.setState({ ...this.state, height: window.innerHeight - (nav ? nav.clientHeight : 0) });
    };

    private selectTile = (tile: Tile) => {
        this.setState({
            ...this.state,
            canvas: {
                ...this.state.canvas,
                pen: tile
            }
        });
    };

    private selectChar = (char: Char) => {
        this.setState({
            ...this.state,
            canvas: {
                ...this.state.canvas,
                pen: char
            }
        });
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        window.onbeforeunload = () => {
            if (!this.props.problem.saved) {
                return "Changes you made may not be saved."
            }
            return;
        };
        this.updateHeight();

        document.title = "BlockDojo - Editor";

        this.props.getCategories();
        this.props.getDifficulties();
        this.props.getProblem(this.props.match.params.problemId);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
        window.onbeforeunload = () => { };
    }

    componentDidUpdate() {
        if (this.state.saving) {
            this.props.uploadProblem(this.props.problem);
            this.setState({ ...this.state, saving: false });
        }
    }

    selectTab(tab: Tab) {
        this.setState({ ...this.state, currentTab: tab });
    }

    selectCanvasTab(tab: CanvasTab) {
        this.setState({ ...this.state, canvas: { ...this.state.canvas, currentTab: tab } });
    }

    uploadProblem() {
        this.setState({ ...this.state, saving: true });
    }

    render() {
        const getTabObj = (name: string, value: Tile | Char | Obj, index: number) => ({
            name, value, index, active: (this.state.canvas.pen === value)
        });
        return <>
            <Prompt
                when={!this.props.problem.saved}
                message='Changes you made may not be saved.' />
            <NavBar>
                <TabSelect tabs={[
                    Tab.DES, Tab.EDITOR, Tab.CODE
                ].map((tab: Tab) => ({
                    name: tab as string,
                    active: this.state.currentTab === tab,
                    callback: this.selectTab.bind(this, tab)
                }))} buttons={[
                    {
                        name: "Save",
                        callback: this.uploadProblem.bind(this)
                    }
                ]} color="info" color2="light">
                    <span className={` mx-2 px-2 ${this.props.problem.saved ? "text-white" : "text-danger"}`}>{this.props.problem.savingMessage}</span>
                </TabSelect>
            </NavBar>
            <img ref={this.tileSpriteImg} src={tileSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.charSpriteImg} src={charSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.objSpriteImg} src={objSprite} className={"d-none"} alt={"sprite"} />
            {
                this.tileSpriteImg.current &&
                this.charSpriteImg.current &&
                this.objSpriteImg.current && <div className="container-fluid p-0 bg-light">
                    {
                        !this.state.saving && <div className="row w-100 m-0" style={{ height: this.state.height }}>
                            <div className="col-4 p-1">
                                <Canvas
                                    tileSprite={this.tileSpriteImg.current}
                                    charSprite={this.charSpriteImg.current}
                                    objSprite={this.objSpriteImg.current}
                                    pen={this.state.canvas.pen}
                                    currentTab={this.state.canvas.currentTab}
                                    terrainSize={this.state.canvas.terrainSize}
                                    winningCondition={this.state.canvas.winningCondition}
                                    editable={this.state.currentTab === Tab.EDITOR} />
                            </div>
                            {
                                this.state.currentTab === Tab.DES && <div className="col-8">
                                    <DescriptionForm height={this.state.height} />
                                </div>
                            }
                            {
                                this.state.currentTab === Tab.EDITOR && <>
                                    <div className="col-4 p-0">
                                        <TabSelect tabs={[
                                            "Terrain" as CanvasTab,
                                            "Characters" as CanvasTab,
                                            "Objects" as CanvasTab,
                                            "Enemy" as CanvasTab
                                        ].map((name: CanvasTab) => ({
                                            name: name as string,
                                            active: this.state.canvas.currentTab === name,
                                            callback: this.selectCanvasTab.bind(this, name)
                                        }))} buttons={[]} color="light" color2="dark" />
                                        <div className="p-3 border-top h-25" style={{overflow: "auto"}}>
                                            {
                                                this.state.canvas.currentTab === "Terrain" && <ObjSelector
                                                    objs={[
                                                        getTabObj("Grass", Tile.GRASS, 0),
                                                        getTabObj("Road", Tile.ROAD, 1),
                                                        getTabObj("Water", Tile.WATER, 13)
                                                    ]}
                                                    sprite={this.tileSpriteImg.current}
                                                    select={this.selectTile} />
                                            }
                                            {
                                                this.state.canvas.currentTab === "Characters" && <ObjSelector
                                                    objs={[
                                                        getTabObj("Jason", Char.JASON, Char.JASON),
                                                        getTabObj("Owen", Char.OWEN, Char.OWEN),
                                                        getTabObj("Patrick", Char.PATRICK, Char.PATRICK),
                                                        getTabObj("Harry", Char.HARRY, Char.HARRY),
                                                        getTabObj("Sherman", Char.SHERMAN, Char.SHERMAN),
                                                        getTabObj("Wallace", Char.WALLACE, Char.WALLACE),
                                                        getTabObj("Ronald", Char.RONALD, Char.RONALD),
                                                        getTabObj("Raymend", Char.RAYMEND, Char.RAYMEND),
                                                        getTabObj("Steven", Char.STEVEN, Char.STEVEN),
                                                        getTabObj("Otis", Char.OTIS, Char.OTIS),
                                                        getTabObj("Andy", Char.ANDY, Char.ANDY),
                                                        getTabObj("Sunny", Char.SUNNY, Char.SUNNY)
                                                    ]}
                                                    sprite={this.charSpriteImg.current}
                                                    select={this.selectChar} />
                                            }
                                            {
                                                this.state.canvas.currentTab === "Objects" && <ObjSelector
                                                    objs={[
                                                        getTabObj("Gold Coin", Obj.GOLD_COIN, 0),
                                                        getTabObj("Silver Coin", Obj.SILV_COIN, 8),
                                                        getTabObj("Blue Gem", Obj.BLUE_GEM, 16),
                                                        getTabObj("Green Gem", Obj.GREEN_GEM, 24),
                                                        getTabObj("Flag", Obj.FLAG, 33)
                                                    ]}
                                                    sprite={this.objSpriteImg.current}
                                                    select={this.selectChar} />
                                            }
                                        </div>
                                        <div className="p-2">
                                            <hr />
                                            <h5>Settings</h5>
                                            <h6 className="d-inline p-2">Terrain Size:</h6>
                                            <input
                                                type="number"
                                                className="border-0 rounded-pill pl-2"
                                                style={{width: "3em"}}
                                                value={this.state.canvas.terrainSize}
                                                onChange={(event) => {
                                                const size = Math.min(Math.max(parseInt(event.target.value), 8), 16);
                                                this.setState({
                                                    ...this.state,
                                                    canvas: {
                                                        ...this.state.canvas,
                                                        terrainSize: size
                                                    }
                                                });
                                            }} />
                                            <br />
                                            <h6 className="d-inline p-2">End Game Condition:</h6>
                                            <select
                                                value={this.state.canvas.winningCondition}
                                                onChange={(event) => {
                                                    this.setState({
                                                        ...this.state,
                                                        canvas: {
                                                            ...this.state.canvas,
                                                            winningCondition: event.target.value as WinningCondition
                                                        }
                                                    });
                                                }}
                                                className="border-0 rounded-pill pl-2">
                                                <option>{WinningCondition.ALL_OBJECT_COLLECTED}</option>
                                                <option>{WinningCondition.ALL_PLAYER_GOT_FLAG}</option>
                                                <option>{WinningCondition.ANY_PLAYER_GOT_FLAG}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-4 p-0">
                                        <BlockSelector height={this.state.height} />
                                    </div>
                                </>
                            }
                            {
                                this.state.currentTab === Tab.CODE && <BlocklyArea
                                    useCategory={this.props.problem.useCategory}
                                    avalibleBlocks={this.props.problem.avalibleBlocks}
                                    avalibleCategories={this.props.problem.avalibleCategories}
                                    useVariables={this.props.problem.useCategory && this.props.problem.useVariables}
                                    useFunctions={this.props.problem.useCategory && this.props.problem.useFunctions}
                                    height={this.state.height}
                                    className="col-8 p-0" />
                            }
                        </div>
                    }
                    {
                        this.state.saving && <h1>
                            Saving...
                    </h1>
                    }
                </div>
            }
        </>
    }

}

const mapStateToProps = (state: IRootState) => ({
    problem: state.problem
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    uploadProblem: (problem: IProblemState) => dispatch(uploadProblem(problem)),
    getProblem: (id: number) => dispatch(getProblem(id)),
    getCategories: () => dispatch(getCategoriesThunk()),
    getDifficulties: () => dispatch(getDifficultiesThunk()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);
