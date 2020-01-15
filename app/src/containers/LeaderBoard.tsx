import React from "react";
import NavBar from "../components/NavBar";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { getProfile } from "../thunks/profileThunks";
import { IRootState, ReduxThunkDispatch } from "../store";

interface IProfileProps {
    username: string;
    exp: number;
    rankingList: {
        username: string;
        experience: number;
        name: string;
    }[];
    getProfile: (username: string) => void;
}

interface IProfileState {
    rankingList: {
        username: string;
        experience: number;
        name: string;
    }[];
    search: string;
}

class LeaderBoard extends React.Component<IProfileProps, IProfileState> {

    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            rankingList: [],
            search: ""
        };
    }

    componentDidUpdate() {
        if (!this.state.search && this.state.rankingList !== this.props.rankingList && this.props.rankingList.length > 0) {
            this.setState({ rankingList: this.props.rankingList });
        }
    }

    componentDidMount() {
        document.title = "BlockDojo - LeaderBoard";
        const username = localStorage.getItem("username");
        if (username) {
            this.props.getProfile(username);
        }
    }

    filterList = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const search = event.target.value.toLowerCase();
        this.setState({ search });
        if (search) {
            const items = this.props.rankingList.filter((item) => {
                return item.username.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
            });
            this.setState({ rankingList: items });
        }
    }

    render() {
        return <div>
            <NavBar />
            <div className="container bg-white border shadow" style={{ height: "100vh" }}>
                <div className="col-12">
                    <div className="row">
                        <div className="col-4 mt-4" style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end",padding:"0"}}>
                            {/* search bar */}
                            <div>
                                <input
                                    value={this.state.search}
                                    type="Search"
                                    placeholder="Search By Username"
                                    onChange={this.filterList}
                                    style={{width:"232px",borderRadius:"5px",height:"35px"}}
                                />
                            </div>
                        </div>

                        {/* user image */}
                        <div className="col-2 mt-4" style={{ display: "flex", justifyContent: "center", padding: "0" }}>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0150/0643/3380/files/patrick.png?7948"
                                width="130"
                                className="rounded-circle shadow"
                                style={{ border: "5px solid white" }}
                                alt="user-icon" />
                        </div>

                        {/* user information (name,lv,progress bar) */}
                        <div className="col-3 mt-4" style={{padding:"0"}}>
                            <h2 className="mt-3 mb-0 text-monospace text-warning text-center">{this.props.username}</h2>
                            <h6 className="mt-3 mb-0 text-monospace text-warning text-center">Lvl. 10</h6>
                            {/* <h6>user ranking: </h6> */}
                            <div className="mt-3 progress rounded-pill" style={{margin:"10px"}}>
                                <div className="mb-0 progress-bar bg-info progress-bar-striped"
                                    role="progressbar"
                                    aria-valuenow={70}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    style={{width:"70%"}}>
                                    <span className="sr-only">70% Complete</span>
                                </div>
                            </div>
                        </div>

                        {/* user ranking */}
                        <div className="col-3 mt-4 text-monospace text-center" style={{border:"6px outset",backgroundColor:'rgba(22, 152, 175, 0.7)'}}>
                            <h4 style={{marginTop:'25px',marginBottom:'20px'}}>Ranking No:</h4>
                            <h4 style={{marginBottom:'25px'}}>(Number)</h4>
                        </div>
                    </div>
                </div>

                <br />
                <br />

                {/* ranking list (only show big 10) */}
                <div className="row pt-2 justify-content-center">
                    <div className="col-11 p-2 text-center">
                        <h3>Ranking list</h3>
                        <Table striped bordered hover responsive="lg" size="sm">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Username</th>
                                    <th>Level</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.rankingList.map((ranking, i) => <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{ranking.username}</td>
                                        <td>{ranking.experience}</td>
                                        <td>{ranking.name}</td>
                                    </tr>)
                                }

                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    username: state.profile.username,
    rankingList: state.profile.rankingList,
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProfile: (username: string) => dispatch(getProfile(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
