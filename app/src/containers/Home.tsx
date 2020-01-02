import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";
import NavBar from "../components/NavBar";


class Home extends React.Component {

    render() {
        return <div>
            <NavBar />
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
