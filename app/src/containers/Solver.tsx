import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/BlocklyArea";

const BlocklyJS = require("blockly/javascript");


interface ISolverProps {
    match: {
        params: {
            problemId: number;
        };
    };
}

class Solver extends React.Component<ISolverProps> {

    private blocklyArea: BlocklyArea | null = null;

    generateCode() {
        if (this.blocklyArea) {
            var code = BlocklyJS.workspaceToCode(this.blocklyArea.workspace);
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

    render() {
        return <div className="container-fluid p-0">
            <NavBar />
            <button onClick={this.generateCode.bind(this)}>run</button>
            <div className="row" style={{ height: 600 }}>
                <BlocklyArea ref={e => this.blocklyArea = e} className="col-12 p-0" />
            </div>
            {this.props.match.params.problemId}
        </div>
    }

}

const mapStateToState = (state: IRootState) => ({});

const mapDispatchToState = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToState, mapDispatchToState)(Solver);
