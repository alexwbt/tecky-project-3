import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "./store";
import NavBar from "./NavBar";


class Home extends React.Component {

    render() {
        return <div>
            <NavBar />
        </div>
    }

}

const mapStateToState = (state: IRootState) => ({});

const mapDispatchToState = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToState, mapDispatchToState)(Home);
