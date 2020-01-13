import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";
import NavBar from "../components/NavBar";
import ChallengeBox from "../components/ChallengeBox";
import { getDifficultiesThunk } from "../thunks/difficultyThunks";


interface IHomeProps {
    problemList: { id: number, title: string, difficultyID: number, rating: number }[];
    getDifficulties: () => void;
}

class Home extends React.Component<IHomeProps> {

    componentDidMount() {
        document.title = "BlockDojo - Home";

        this.props.getDifficulties();
    }

    render() {
        return <div>
            <NavBar />
            <div className="container-fluid bg-light px-5">
                <h2 className="pb-0 pt-4 px-4 mb-0">Challenges</h2>
                <div className="row p-3">
                    {
                        this.props.problemList.map((problem, i) => <div
                            key={i}
                            className="col-lg-3 p-3">
                            <ChallengeBox
                                key={i}
                                problemID={problem.id}
                                title={problem.title}
                                difficultyID={problem.difficultyID}
                                rating={problem.rating} />
                        </div>)
                    }
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    problemList: [
        {id: 1, title: "patrick1", difficultyID: 1, rating: 1 },
        {id: 2, title: "patrick2", difficultyID: 2, rating: 2 },
        {id: 3, title: "patrick3", difficultyID: 3, rating: 3 },
        {id: 4, title: "patrick4", difficultyID: 4, rating: 4 },
        {id: 5, title: "patrick1", difficultyID: 1, rating: 5 },
        {id: 6, title: "patrick2", difficultyID: 1, rating: 5 },
        {id: 7, title: "patrick3", difficultyID: 1, rating: 2 },
        {id: 8, title: "patrick2", difficultyID: 2, rating: 2 },
        {id: 9, title: "patrick3", difficultyID: 3, rating: 3 },
        {id: 10, title: "patrick4", difficultyID: 4, rating: 4 },
        {id: 11, title: "patrick1", difficultyID: 1, rating: 5 },
        {id: 12, title: "patrick2", difficultyID: 1, rating: 5 },
        {id: 13, title: "patrick3", difficultyID: 1, rating: 2 },
        {id: 14, title: "patrick4asdasdasdasdasdasdasdasdasdasdasdadasdadasdasdaend", difficultyID: 2, rating: 0 }
    ]
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getDifficulties: () => dispatch(getDifficultiesThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
