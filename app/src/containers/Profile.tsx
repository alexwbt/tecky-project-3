import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";
import NavBar from "../components/NavBar";


interface IProfileProps {
    match: {
        params: {
            username: string;
        };
    };
}

class Profile extends React.Component<IProfileProps> {

    render() {
        return <div>
            <NavBar />
            {this.props.match.params.username}
        </div>
    }

}

const mapStateToState = (state: IRootState) => ({});

const mapDispatchToState = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToState, mapDispatchToState)(Profile);
