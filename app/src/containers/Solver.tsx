import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import BlocklyArea from "../components/BlocklyArea";


interface ISolverProps {
    match: {
        params: {
            problemId: number;
        };
    };
}

class Solver extends React.Component<ISolverProps> {

    render() {
        return <div className="container-fluid p-0">
            <NavBar />
            <div className="row" style={{height: 600}}>
                <BlocklyArea className="col-12 p-0" />
            </div>
            {this.props.match.params.problemId}
        </div>
    }

}

const mapStateToState = (state: IRootState) => ({});

const mapDispatchToState = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToState, mapDispatchToState)(Solver
);
