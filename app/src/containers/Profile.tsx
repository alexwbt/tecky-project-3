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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { deletePost } from "../thunks/problemThunk";

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
        problemID: number;
        title: string;
        difficulty_id: number;
        score: number;
        created_at: string;
    }[];
    getProfile: (username: string) => void;
    getDifficulties: () => void;
    open: (path: string) => void;
    deletePost: (problemID: number) => void
}

interface IProfileState {
    currentTab: Tab;
}

type Tab = "Posts" | "Solved";

class Profile extends React.Component<IProfileProps, IProfileState> {

    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            currentTab: "Posts"
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

    private open = (id: number, editor: boolean) => {
        this.props.open(`/challenge/${editor ? "edit" : "solve"}/${id}`)
    }

    render() {
        let expbar = 0;
        if (this.props.level) {
            expbar = this.props.level.exp / this.props.level.req * 100;
        }
        return <div className="d-flex flex-column vh-100">
            <NavBar />
            <div className="container bg-white flex-grow-1" style={{ overflow: "auto" }}>
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

                    <div className="col-12 p-2 text-center">
                        {this.props.username && <h6>username: {this.props.username}</h6>}
                        {this.props.email && <h6>email: {this.props.email}</h6>}
                        {this.props.location && <h6>location: {this.props.location}</h6>}
                    </div>

                    {/* Tab */}
                    <TabSelect tabs={[
                        "Posts" as Tab,
                        "Solved" as Tab
                    ].map(tab => ({
                        name: tab,
                        active: this.state.currentTab === tab,
                        callback: this.selectTab.bind(this, tab)
                    }))} color="light" color2="info" className="mt-2 mx-auto text-center rounded-pill" />
                </div>

                {/* Posts Tab */}
                <div className="row pt-2 justify-content-center">
                    {
                        this.state.currentTab === "Posts" && <div className="col-10 p-2 text-center">
                            <Table hover responsive="lg" size="sm">
                                <thead>
                                    <tr>
                                        <th className="border-0">Title</th>
                                        <th className="border-0">Difficulty</th>
                                        <th className="border-0">Status</th>
                                        <th className="border-0">Created at</th>
                                        <th className="border-0">Last edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.postsRecord.map((post, i) =>
                                            <tr key={i} onClick={() => this.open(post.problemID, true)}>
                                                <td className="align-middle">{post.title}</td>
                                                <td className="text-white"><DifficultyBox difficultyID={post.difficulty_id} /></td>
                                                <td className="align-middle">{post.statusName}</td>
                                                <td className="align-middle">{post.created_at.substr(0, 10)}</td>
                                                <td className="align-middle">{post.updated_at.substr(0, 10)}</td>
                                                <td className="align-middle">
                                                    <Button
                                                        variant="link"
                                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                            if (window.confirm("Are you sure you want to delete this challenge?")) {
                                                                this.props.deletePost(post.problemID);
                                                            }
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                        }}>
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </Button>
                                                </td>
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
                            <Table hover responsive="lg" size="sm">
                                <thead>
                                    <tr>
                                        <th className="border-0">Title</th>
                                        <th className="border-0">Difficulty</th>
                                        <th className="border-0">Score</th>
                                        <th className="border-0">Submit Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.solvedRecord.map((solved, i) =>
                                            <tr key={i} onClick={() => this.open(solved.problemID, false)}>
                                                <td className="align-middle">{solved.title}</td>
                                                <td className="text-white"><DifficultyBox difficultyID={solved.difficulty_id} /></td>
                                                <td className="align-middle">{solved.score}</td>
                                                <td className="align-middle">{solved.created_at.substr(0, 10)}</td>
                                            </tr>)
                                    }
                                </tbody>
                            </Table>
                        </div>
                    }
                </div>
            </div>
        </div>
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
    deletePost: (problemID: number) => dispatch(deletePost(problemID)),
    getDifficulties: () => dispatch(getDifficultiesThunk()),
    open: (path: string) => dispatch(push(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
