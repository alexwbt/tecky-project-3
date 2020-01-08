import React from "react";
import NavBar from "../components/NavBar";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";


class LeaderBoard extends React.Component {

    render() {
        return <div>
            <NavBar />
            <div className="container bg-white border shadow" style={{ height: "100vh" }}>

                <div className="row">
                    <div className="col-6 mt-4">
                        {/* search bar & filter tag */}
                    </div>
                    
                    <div className="col-2 mt-4">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0150/0643/3380/files/patrick.png?7948"
                            width="130"
                            className="rounded-circle shadow"
                            style={{ border: "5px solid white" }}
                            alt="user-icon" />
                    </div>
                        
                    <div className="col-2 mt-4 ">
                        <h2 className="mt-3 mb-0 text-monospace text-warning text-center">admin</h2>
                        <h6 className="text-monospace text-warning text-center">Lvl. 10</h6>
                        <div className="progress rounded-pill">
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

                    <div className="col-2 mt-4 mb-0 text-monospace text-center" style={{border:"2px outset", backgroundColor: 'rgba(22, 152, 175, 0.7)'}}>
                        <h6 className="mt-3" style={{display:'flex', justifyContent: 'center', alignItems:'center'}}>Ranking No.</h6>
                        <h4 className="mt-3" style={{alignItems:'center'}}>(Number)</h4>
                    </div>
                </div>

                <br />
                <br />
                
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
                                    <td>Alex</td>
                                    <td>100 (10000)</td>
                                    <td>Hong Kong</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
