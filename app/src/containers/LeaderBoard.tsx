import React from "react";
import NavBar from "../components/NavBar";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { getProfile } from "../thunks/profileThunks";
import { IRootState, ReduxThunkDispatch } from "../store";

interface IProfileProps {
    username: string;
    exp: number;
    getProfile: (username: string) => void;
}

class LeaderBoard extends React.Component <IProfileProps> {

    constructor (props: IProfileProps) {
        super(props);
        this.state = this.setState;
    }

    componentDidMount() {
        document.title = "BlockDojo - LeaderBoard";
        const username = localStorage.getItem("username");
        if (username) {
            this.props.getProfile(username);
        }
    }

    render() {
        return <div>
            <NavBar />
            <div className="container bg-white border shadow" style={{ height: "100vh" }}>

                <div className="row">
                    <div className="col-6 mt-4">
                        {/* search bar & filter tag */}
                    </div>
                    
                    {/* user image */}
                    <div className="col-2 mt-4">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0150/0643/3380/files/patrick.png?7948"
                            width="130"
                            className="rounded-circle shadow"
                            style={{ border: "5px solid white" }}
                            alt="user-icon" />
                    </div>
                        
                    {/* user information (name,lv,progress bar) */}
                    <div className="col-2 mt-4 ">
                        <h2 className="mt-3 mb-0 text-monospace text-warning text-center">{this.props.username}</h2>
                        <h6 className="mb-0 text-monospace text-warning text-center">Lvl. 10</h6>
                        <div className="progress rounded-pill">
                            <div
                                className="mb-0 progress-bar bg-info progress-bar-striped"
                                role="progressbar"
                                aria-valuenow={70}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: "70%" }}>
                                <span className="sr-only">70% Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* user ranking */}
                    <div className="col-2 mt-4 text-monospace text-center" style={{border:"2px outset", backgroundColor: 'rgba(22, 152, 175, 0.7)'}}>
                        <h6 style={{marginTop:'25px', marginBottom:'20px'}}>Ranking No</h6>
                        <h4 style={{marginBottom:'25px'}}>(Number)</h4>
                    </div>
                </div>

                <br />
                <br />
                
                {/* ranking list (only show big 10) */}
                <div className="row pt-2 justify-content-center">
                    <div className="col-11 p-2 text-center">
                        <h6>Ranking list</h6>
                        <Table striped bordered hover responsive="lg" size="sm">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>User Name</th>
                                    <th>Level</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{this.props.username}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
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
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProfile: (username: string) => dispatch(getProfile(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
