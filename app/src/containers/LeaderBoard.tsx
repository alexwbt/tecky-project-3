import React from "react";
import NavBar from "../components/NavBar";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { getProfile } from "../thunks/profileThunks";
import { IRootState, ReduxThunkDispatch } from "../store";
import { toast } from "react-toastify";
import { push } from "connected-react-router";


interface IProfileProps {
    username: string;
    exp: number;
    level: {
        lvl: number,
        exp: number,
        req: number
    };
    rankingList: {
        username: string;
        experience: number;
        name: string;
    }[];
    getProfile: (username: string) => void;
    open: (path: string) => void;
}

interface IProfileState {
    rankingList: {
        username: string;
        experience: number;
        name: string;
    }[];
    search: string;
    userRank: number;
}

class LeaderBoard extends React.Component<IProfileProps, IProfileState> {

    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            rankingList: [],
            search: "",
            userRank: 0
        };
    }

    componentDidMount() {
        document.title = "BlockDojo - LeaderBoard";

        const username = localStorage.getItem("username");
        if (username) {
            this.props.getProfile(username);
        }

        this.getRankingList();
    }

    private async getRankingList() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/user/rankingList`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await res.json();
            if (res.status === 200 && result.success) {
                this.setState({
                    rankingList: result.rankingList,
                    userRank: result.rankingList.findIndex((u: any) => u.username === this.props.username) + 1
                });
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    render() {
        return <div className="d-flex flex-column vh-100">
            <NavBar />
            <div className="container bg-white border shadow flex-grow-1" style={{ overflow: "auto" }}>
                <div className="row p-2">
                    <div className="ml-5 mt-3 rounded-pill" style={{ minWidth: 300, background: "rgba(240, 240, 240)" }}>
                        <img
                            src="https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
                            width="130"
                            className="rounded-circle d-inline-block"
                            style={{ border: "5px solid white" }}
                            alt="user-icon" />
                        <div className="pl-3 pr-5 d-inline-block align-top">
                            <h2 className="my-0 text-monospace">{this.props.username}</h2>
                            <h6 className="my-0 text-monospace text-warning pl-1">Lvl. {this.props.level?.lvl}</h6>
                            <h2 className="my-0 text-monospace text-warning">Rank.{this.state.userRank}</h2>
                        </div>
                    </div>

                    <div className="col d-flex align-items-end px-5">
                        <input
                            className="rounded-pill border p-2 pl-4 w-100"
                            value={this.state.search}
                            placeholder="Search for user"
                            onChange={(event) => this.setState({ search: event.target.value })} />
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-11 p-2 pt-4 text-center">
                        <Table hover responsive="lg" size="sm">
                            <thead>
                                <tr>
                                    <th className="border-0">Rank</th>
                                    <th className="border-0">Username</th>
                                    <th className="border-0">Exp</th>
                                    <th className="border-0">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.rankingList && this.state.rankingList.map(user => {
                                        if (!this.state.search) {
                                            return { ...user, score: 1 };
                                        }
                                        const title = user.username.toLowerCase();
                                        const search = this.state.search.toLowerCase();
                                        let score = 0;
                                        for (let i = 0; i < title.length; i++) {
                                            if (search.includes(title[i])) {
                                                score++;
                                            }
                                        }
                                        return { ...user, score };
                                    }).sort((a, b) => b.score - a.score).filter(p => p.score > 0).map((user, i) =>
                                        <tr key={i} onClick={() => this.props.open("/profile/" + user.username)}>
                                            <td className="py-3">{this.state.rankingList.findIndex((u: any) => u.username === user.username) + 1}</td>
                                            <td className="py-3">{user.username}</td>
                                            <td className="py-3">{user.experience}</td>
                                            <td className="py-3">{user.name}</td>
                                        </tr>)
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div >
    }

}

const mapStateToProps = (state: IRootState) => ({
    username: state.profile.username,
    level: state.profile.level
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProfile: (username: string) => dispatch(getProfile(username)),
    open: (path: string) => dispatch(push(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
