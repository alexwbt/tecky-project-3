import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/BlocklyArea";
import Canvas from "../components/Canvas";

const BlocklyJS = require("blockly/javascript");


interface ISolverProps {
    match: {
        params: {
            problemId: number;
        };
    };
}

interface ISolverStates {
    height: number;
}

/* eslint no-eval: 0 */
class Solver extends React.Component<ISolverProps, ISolverStates> {

    private blocklyArea: React.RefObject<BlocklyArea>;

    constructor(props: ISolverProps) {
        super(props);
        this.state = {
            height: 0
        };
        this.blocklyArea = React.createRef();
    }

    private updateHeight = () => {
        const nav = document.getElementById("navagation-bar");
        this.setState({ ...this.state, height: window.innerHeight - (nav ? nav.clientHeight : 0) });
    };

    private generateCode = () => {
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
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        this.updateHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }

    render() {
        return <>
            <NavBar />
            <div className="container-fluid p-0 bg-light">
                <div className="row w-100 m-0" style={{ height: this.state.height }}>
                    <div className="col-4 p-1">
                        <Canvas size={16 * 100} terrain="empty" editable={false} />
                        <button onClick={this.generateCode}>run</button>
                    </div>
                    <BlocklyArea ref={this.blocklyArea} height={this.state.height} className="col-8 p-0" />
                </div>
            </div>
        </>
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Solver);
