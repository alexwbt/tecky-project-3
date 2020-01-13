import React from "react";
import Table from "react-bootstrap/Table";
import NavBar from "../components/NavBar";
import TabSelect from "../components/TabSelect";
import { connect } from "react-redux";
import { getProfile } from "../thunks/profileThunks";
import { IRootState, ReduxThunkDispatch } from "../store";


interface IProfileProps {
    match: {
        params: {
            username: string;
        };
    };
    username: string;
    email: string;
    exp: number;
    location: string;

    postsTitle: string;
    postsName: string;
    status: boolean;
    postsCreatedAt: string;
    postsUpdatedAt: string;

    solvedTitle: string;
    solvedName: string;
    score: number;
    solvedCreatedAt: string;

    getProfile: (username: string) => void;
}

interface IProfileState {
    currentTab: Tab;
}

type Tab = "Info" | "Posts" | "Solved";

class Profile extends React.Component<IProfileProps, IProfileState> {

    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            currentTab: "Info"
        };
    }

    componentDidMount() {
        document.title = "BlockDojo - Profile";
        this.props.getProfile(this.props.match.params.username);
    }

    selectTab(tab: Tab) {
        this.setState({ ...this.state, currentTab: tab });
    }

    render() {
        return <>
            <NavBar />
            <div className="container bg-white border shadow" style={{height:"100vh"}}>
                <div className="row">
                    <div className="col-12 text-center mt-4">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0150/0643/3380/files/patrick.png?7948"
                            width="180"
                            className="rounded-circle shadow"
                            style={{ border: "5px solid white" }}
                            alt="user-icon" />
                        <h2 className="mt-3 mb-0 text-warning">{this.props.username}</h2>
                        <h4 className="text-monospace text-warning">Lvl. 10</h4>
                        <div className="progress w-25 m-auto rounded-pill">
                            <div
                                className="progress-bar bg-info progress-bar-striped"
                                role="progressbar"
                                aria-valuenow={70}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: "70%" }}>
                                <span className="sr-only">70% Complete</span>
                            </div>
                        </div>
                    </div>
                    <TabSelect tabs={[
                        "Info" as Tab,
                        "Posts" as Tab,
                        "Solved" as Tab
                    ].map(tab => ({
                        name: tab,
                        active: this.state.currentTab === tab,
                        callback: this.selectTab.bind(this, tab)
                    }))} color="light" color2="info" className="mt-4 mx-auto text-center rounded-pill" />
                </div>
                <div className="row pt-2 justify-content-center">
                    {
                        this.state.currentTab === "Info" && <div className="col-6 p-2 text-center">
                            <h6>username: {this.props.username}</h6>
                            <h6>email: {this.props.email}</h6>
                            <h6>location: {this.props.location}</h6>
                        </div>
                    }
                </div>

                <div className="row pt-2 justify-content-center">
                    {
                        this.state.currentTab === "Posts" && <div className="col-10 p-2 text-center">
                            <h6>Posts Challenge</h6>
                            <Table striped bordered hover responsive="lg" size="sm">
                                <thead>
                                    <tr>
                                        <th></th>  
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Audit</th>
                                        <th>Created at</th>
                                        <th>Last edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{this.props.postsTitle}</td>
                                    <td>{this.props.postsName}</td>
                                    <td>{String(this.props.status)}</td>
                                    <td>{this.props.postsCreatedAt.substr(0,10)}</td>
                                    <td>{this.props.postsUpdatedAt.substr(0,10)}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    }
                </div>

                <div className="row pt-2 justify-content-center">
                    {
                        this.state.currentTab === "Solved" && <div className="col-10 p-2 text-center">
                            <h6>Solved Challenge</h6>
                            <Table striped bordered hover responsive="lg" size="sm">
                                <thead>
                                    <tr>
                                        <th></th>  
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Score</th>
                                        <th>Submit Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{this.props.solvedTitle}</td>
                                    <td>{this.props.solvedName}</td>
                                    <td>{this.props.score}</td>
                                    <td>{this.props.solvedCreatedAt.substr(0,10)}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    }
                </div>
            </div>
        </>
    }

}

const mapStateToProps = (state: IRootState) => ({
    username: state.profile.username,
    email: state.profile.email,
    exp: state.profile.exp,
    location: state.profile.location,

    postsTitle: state.profile.postsTitle,
    postsName: state.profile.postsName,
    status: state.profile.status,
    postsCreatedAt: state.profile.postsCreatedAt,
    postsUpdatedAt: state.profile.postsUpdatedAt,

    solvedTitle: state.profile.solvedTitle,
    solvedName: state.profile.solvedName,
    score: state.profile.score,
    solvedCreatedAt: state.profile.solvedCreatedAt,
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProfile: (username: string) => dispatch(getProfile(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
