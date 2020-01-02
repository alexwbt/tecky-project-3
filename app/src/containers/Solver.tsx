import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/BlocklyArea";
import { Navbar } from "react-bootstrap";

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

class Solver extends React.Component<ISolverProps, ISolverStates> {

    private blocklyArea: BlocklyArea | null = null;

    constructor(props: ISolverProps) {
        super(props);
        this.state = {
            height: 0
        };
    }

    updateHeight() {
        const nav = document.querySelector("#navagation-bar");
        if (nav) {
            const styles = window.getComputedStyle(nav);
            const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
            this.setState({ ...this.state, height: window.innerHeight - (nav.clientHeight + margin)});
        }
    }

    componentDidUpdate() {
        this.blocklyArea?.forceUpdate();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight.bind(this));
        this.updateHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight.bind(this));
    }

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
            <div className="row w-100 m-0" style={{ height: this.state.height }}>
                <div className="col-4 p-1">
                    <button onClick={this.generateCode.bind(this)}>run</button>
                </div>
                <BlocklyArea ref={e => this.blocklyArea = e} className="col-8 p-0" />
            </div>
        </div>
    }

}

const mapStateToState = (state: IRootState) => ({});

const mapDispatchToState = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToState, mapDispatchToState)(Solver);
