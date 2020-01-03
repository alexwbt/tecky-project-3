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

interface ICreatorStates {
    height: number;
    currentTab: Tab;
}

class Creator extends React.Component<ICreatorProps, ICreatorStates> {

    private blocklyArea: React.RefObject<BlocklyArea>;

    constructor(props: ICreatorProps) {
        super(props);
        this.state = {
            height: 0,
            currentTab: "Description"
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

    render() {
        return <div className="container-fluid p-0">
            <div id="navagation-bar">
                <NavBar />
                <TabSelect tabs={[
                    { name: "Description", active: this.state.currentTab === "Description", callback: this.selectTab.bind(this, "Description") },
                    { name: "Canvas", active: this.state.currentTab === "Canvas", callback: this.selectTab.bind(this, "Canvas") },
                    { name: "Code", active: this.state.currentTab === "Code", callback: this.selectTab.bind(this, "Code") }
                ]} />
            </div>

            <div className="row w-100 m-0" style={{ height: this.state.height }}>
                {
                    this.state.currentTab === "Description" && <div className="col-6 pt-3"><DescriptionForm /></div>
                }
                {
                    this.state.currentTab === "Canvas" && <div className="col-4 p-1">
                        <Canvas size={16 * 100} terrain="empty" />
                        {/* <button onClick={this.generateCode.bind(this)}>run</button> */}
                    </div>
                }
                {
                    this.state.currentTab === "Code" && <BlocklyArea
                        ref={this.blocklyArea}
                        height={this.state.height}
                        className="col-8 p-0" />
                }
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Creator);
