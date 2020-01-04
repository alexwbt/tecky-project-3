import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/BlocklyArea";
import Canvas from "../components/Canvas";
import TabSelect from "../components/TabSelect";
import DescriptionForm from "../components/DescriptionForm";

const BlocklyJS = require("blockly/javascript");


interface ICreatorProps {
    match: {
        params: {
            problemId: number;
        };
    };
}

type Tab = "Description" | "Canvas" | "Code";
type CanvasTab = "Terrain" | "Charactors" | "Structures" | "Enemy"

interface ICreatorStates {
    height: number;
    currentTab: Tab;
    canvas: {
        currentTab: CanvasTab;
    };
}

/* eslint no-eval: 0 */
class Creator extends React.Component<ICreatorProps, ICreatorStates> {

    private blocklyArea: React.RefObject<BlocklyArea>;

    constructor(props: ICreatorProps) {
        super(props);
        this.state = {
            height: 0,
            currentTab: "Description",
            canvas: {
                currentTab: "Terrain"
            }
        };
        this.blocklyArea = React.createRef();
    }

    updateHeight() {
        const nav = document.getElementById("navagation-bar");
        this.setState({ ...this.state, height: window.innerHeight - (nav ? nav.clientHeight : 0) });
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight.bind(this));
        this.updateHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight.bind(this));
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
        this.setState({ ...this.state, canvas: { currentTab: tab } });
    }

    uploadProblem() {
        window.alert("saved");
    }

    render() {
        return <div className="container-fluid p-0">
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

            <div className="row w-100 m-0" style={{ height: this.state.height }}>
                {
                    this.state.currentTab === "Description" && <div className="col-6 pt-3">
                        <DescriptionForm />
                    </div>
                }
                {
                    this.state.currentTab === "Canvas" && <>
                        <div className="col-4 p-1">
                            <Canvas size={16 * 100} terrain="empty" />

                            {/* <button onClick={this.generateCode.bind(this)}>run</button> */}
                        </div>
                        <div className="col-8 p-0">
                            <TabSelect tabs={[
                                "Terrain" as CanvasTab,
                                "Charactors" as CanvasTab,
                                "Structures" as CanvasTab,
                                "Enemy" as CanvasTab
                            ].map((name: CanvasTab) => ({
                                name: name as string,
                                active: this.state.canvas.currentTab === name,
                                callback: this.selectCanvasTab.bind(this, name)
                            }))} buttons={[]} color="light" color2="dark" />
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
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);
