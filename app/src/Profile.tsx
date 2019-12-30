import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "./store";
import NavBar from "./NavBar";


class Profile extends React.Component {

    render() {
        return <div>
            <NavBar />
        </div>
    }

}

const mapStateToState = (state: IRootState) => ({});

const mapDispatchToState = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToState, mapDispatchToState)(Profile);
