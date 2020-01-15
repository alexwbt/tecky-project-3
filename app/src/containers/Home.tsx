import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";
import NavBar from "../components/NavBar";
import ChallengeBox from "../components/ChallengeBox";
import { getDifficultiesThunk } from "../thunks/difficultyThunks";
import { toast } from "react-toastify";


interface IHomeProps {
    // authenticated: boolean;
    getDifficulties: () => void;
}

interface IHomeState {
    problemList: { id: number, title: string, difficulty_id: number, rating: { rating: number, rated: number } }[];
}

class Home extends React.Component<IHomeProps, IHomeState> {

    constructor(props: IHomeProps) {
        super(props);
        this.state = {
            problemList: []
        };
    }

    componentDidMount() {
        document.title = "BlockDojo - Home";

        this.props.getDifficulties();
        this.getProblemList();
    }

    private async getProblemList() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/problem`);
            const result = await res.json();

            this.setState({
                problemList: result.problemList
            });
        } catch (err) {
            toast.error(err.message);
        }
    }

    render() {
        return <div>
            <NavBar />
            <div className="container-fluid bg-light px-5">
                <h2 className="pb-0 pt-4 px-4 mb-0">Challenges</h2>
                <div className="row p-3">
                    {
                        this.state.problemList && this.state.problemList.map((problem, i) => <div
                            key={i}
                            className="col-sm-6 col-md-4 col-xl-3 p-3">
                            <ChallengeBox
                                key={i}
                                problemID={problem.id}
                                title={problem.title}
                                difficultyID={problem.difficulty_id}
                                rating={problem.rating} />
                        </div>)
                    }
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    // authenticated: state.auth.authenticated
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getDifficulties: () => dispatch(getDifficultiesThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
