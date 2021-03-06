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
import { editProblem, getProblemAsCreator } from "../thunks/problemThunk";
import { IProblemState } from "../reducers/problemReducer";
import { getCategoriesThunk } from "../thunks/categoryThunk";
import { getDifficultiesThunk } from "../thunks/difficultyThunks";
import { getProblemStatusesThunk } from "../thunks/problemStatusThunk";

import { Prompt } from "react-router-dom";
import { setWinningCondition, changed } from "../actions/problemActions";


interface ICreatorProps {
    match: {
        params: {
            problemId: number;
        };
    };
    problem: IProblemState;

    mode: "edit" | "audit";

    editProblem: (problem: IProblemState, mode: "edit" | "audit") => void;
    getProblem: (id: number) => void;
    getCategories: () => void;
    getDifficulties: () => void;
    getProblemStatuses: () => void;
    setWinningCondition: (condition: WinningCondition) => void;
    changed: () => void;
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
                terrainSize: 0
            },
            saving: false
        };
        this.tileSpriteImg = React.createRef();
        this.charSpriteImg = React.createRef();
        this.objSpriteImg = React.createRef();
    }

    private updateHeight = () => {
        const nav = document.getElementById("navigation-bar");
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
        this.props.getProblemStatuses();
        this.props.getProblem(this.props.match.params.problemId);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
        window.onbeforeunload = () => { };
    }

    componentDidUpdate() {
        if (this.state.saving) {
            this.props.editProblem(this.props.problem, this.props.mode);
            this.setState({ ...this.state, saving: false });
        }
        if (this.state.canvas.terrainSize < 8 && this.props.problem.canvas.terrainSize
            && this.props.problem.canvas.terrainSize !== this.state.canvas.terrainSize) {
            this.setState({
                ...this.state,
                canvas: {
                    ...this.state.canvas,
                    terrainSize: this.props.problem.canvas.terrainSize
                }
            });
        }
    }

    selectTab(tab: Tab) {
        this.setState({ ...this.state, currentTab: tab });
    }

    selectCanvasTab(tab: CanvasTab) {
        this.setState({ ...this.state, canvas: { ...this.state.canvas, currentTab: tab } });
    }

    editProblem() {
        this.setState({ ...this.state, saving: true });
    }

    render() {
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
                }))} buttons={
                    [
                    {
                        name: "Save",
                        callback: this.editProblem.bind(this)
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
                                    editable={this.state.currentTab === Tab.EDITOR} />
                            </div>
                            {
                                this.state.currentTab === Tab.DES && <div className="col-8">
                                    <DescriptionForm height={this.state.height} pid={this.props.match.params.problemId} mode={this.props.mode}/>
                                </div>
                            }
                            {
                                this.state.currentTab === Tab.EDITOR && this.renderEditor()
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

    renderEditor() {
        const getTabObj = (name: string, value: Tile | Char | Obj, index: number) => ({
            name, value, index, active: (this.state.canvas.pen === value)
        });
        return <>
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
                <div className="p-3 border-top h-25" style={{ overflow: "auto" }}>
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
                        style={{ width: "3em" }}
                        value={this.state.canvas.terrainSize}
                        onChange={(event) => {
                            const size = Math.min(Math.max(parseInt(event.target.value), 8), 16);
                            this.setState({
                                ...this.state,
                                canvas: {
                                    currentTab: this.state.canvas.currentTab,
                                    pen: this.state.canvas.pen,
                                    terrainSize: size
                                }
                            });
                            this.props.changed();
                        }} />
                    <br />
                    <h6 className="d-inline p-2">End Game Condition:</h6>
                    <select
                        value={this.props.problem.winningCondition}
                        onChange={(event) => {
                            this.props.setWinningCondition(event.target.value as WinningCondition);
                            this.props.changed();
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

}

const mapStateToProps = (state: IRootState) => ({
    problem: state.problem
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    editProblem: (problem: IProblemState, mode: "edit" | "audit") => {
        dispatch(editProblem(problem, mode))
    },
    getProblem: (id: number) => dispatch(getProblemAsCreator(id)),
    getCategories: () => dispatch(getCategoriesThunk()),
    getDifficulties: () => dispatch(getDifficultiesThunk()),
    getProblemStatuses: () => dispatch(getProblemStatusesThunk()),
    setWinningCondition: (condition: WinningCondition) => dispatch(setWinningCondition(condition)),
    changed: () => dispatch(changed())
});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);
