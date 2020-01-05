import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";
import NavBar from "../components/NavBar";
import TabSelect from "../components/TabSelect";


interface IProfileProps {
    match: {
        params: {
            username: string;
        };
    };
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

    selectTab(tab: Tab) {
        this.setState({ ...this.state, currentTab: tab });
    }

    render() {
        return <>
            <NavBar />
            <div className="container bg-white border shadow">
                <div className="row">
                    <div className="col-12 text-center mt-4">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0150/0643/3380/files/patrick.png?7948"
                            width="180"
                            className="rounded-circle shadow"
                            style={{ border: "5px solid white" }}
                            alt="user-icon" />
                        <h2 className="mt-3 mb-0">{this.props.match.params.username}</h2>
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
                            <h6>username: {this.props.match.params.username}</h6>
                            <h6>email: patrick@gmail.com</h6>
                        </div>
                    }
                </div>
            </div>
        </>
    }

}

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
