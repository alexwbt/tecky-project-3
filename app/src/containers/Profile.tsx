import React from "react";
import NavBar from "../components/NavBar";
import TabSelect from "../components/TabSelect";
import DifficultyBox from "../components/DifficultyBox";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { getProfile } from "../thunks/profileThunks";
import { Button, Table } from "react-bootstrap";
import { getDifficultiesThunk } from "../thunks/difficultyThunks";
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
    level: {
        lvl: number,
        exp: number,
        req: number
    };
    location: string;
    postsRecord: {
        problemID: number;
        title: string;
        difficulty_id: number;
        statusName: string;
        created_at: string;
        updated_at: string;
    }[];
    solvedRecord: {
        title: string;
        difficulty_id: number;
        score: number;
        created_at: string;
    }[];
    getProfile: (username: string) => void;
    getDifficulties: () => void;
    open: (path: string) => void
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

        this.props.getDifficulties();
        this.props.getProfile(this.props.match.params.username);
    }

    selectTab(tab: Tab) {
        this.setState({ ...this.state, currentTab: tab });
    }

    private openEditor = (id: number) => {
        console.log(id);
        this.props.open(`/challenge/edit/${id}`)
    }

    render() {
        let expbar = 0;
        if (this.props.level) {
            expbar = this.props.level.exp / this.props.level.req * 100;
        }
        return <>
            <NavBar />
            <div className="container bg-white border shadow" style={{ height: "100vh", overflow: "auto" }}>
                <div className="row">
                    <div className="col-12 text-center mt-4">
                        <img
                            src="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
                            width="180"
                            className="rounded-circle shadow"
                            style={{ border: "5px solid white" }}
                            alt="user-icon" />
                        <h2 className="mt-3 mb-0 text-warning">{this.props.username}</h2>
                        <h4 className="text-monospace text-warning">Lvl. {this.props.level?.lvl}</h4>
                        <div className="progress w-25 m-auto rounded-pill">
                            <div
                                className="progress-bar bg-info progress-bar-striped"
                                role="progressbar"
                                aria-valuenow={expbar}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: `${expbar}%` }}>
                                <span className="sr-only">{expbar}% Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Tab */}
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

                {/* Info Tab */}
                <div className="row pt-2 justify-content-center">
                    {
                        this.state.currentTab === "Info" && <div className="col-6 p-2 text-center">
                            <h6>username: {this.props.username}</h6>
                            <h6>email: {this.props.email}</h6>
                            <h6>location: {this.props.location}</h6>
                        </div>
                    }
                </div>

                {/* Posts Tab */}
                <div className="row pt-2 justify-content-center">
                    {
                        this.state.currentTab === "Posts" && <div className="col-10 p-2 text-center">
                            <h6>Posts Challenge</h6>
                            <Table striped bordered hover responsive="lg" size="sm" style={{ marginTop: "5px" }}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Title</th>
                                        <th>Difficulty</th>
                                        <th>Status</th>
                                        <th>Created at</th>
                                        <th>Last edit</th>
                                        <th>Delete?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.postsRecord.map((post, i) =>
                                            <tr key={i} onClick={() => this.openEditor(post.problemID)}>
                                                <td>{i + 1}</td>
                                                <td>{post.title}</td>
                                                <td className="text-white"><DifficultyBox difficultyID={post.difficulty_id} /></td>
                                                <td>{post.statusName}</td>
                                                <td>{post.created_at.substr(0, 10)}</td>
                                                <td>{post.updated_at.substr(0, 10)}</td>
                                                <td><Button variant="info">Delete</Button></td>
                                            </tr>)
                                    }
                                </tbody>
                            </Table>
                        </div>
                    }
                </div>

                {/* Solved Tab */}
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
                                    {
                                        this.props.solvedRecord.map((solved, i) => <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{solved.title}</td>
                                            <td className="text-white"><DifficultyBox difficultyID={solved.difficulty_id} /></td>
                                            <td>{solved.score}</td>
                                            <td>{solved.created_at.substr(0, 10)}</td>
                                        </tr>)
                                    }
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
    level: state.profile.level,
    location: state.profile.location,
    postsRecord: state.profile.postsRecord,
    solvedRecord: state.profile.solvedRecord,
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProfile: (username: string) => dispatch(getProfile(username)),
    getDifficulties: () => dispatch(getDifficultiesThunk()),
    open: (path: string) => dispatch(push(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
