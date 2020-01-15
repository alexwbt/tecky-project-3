import React, { ChangeEvent } from "react";
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
    problemList: {
        id: number;
        title: string;
        difficulty_id: number;
        rating: {
            rating: number;
            rated: number;
        };
        created_at: string;
        updated_at: string;
        user: string;
    }[];
    search: string;
}

class Home extends React.Component<IHomeProps, IHomeState> {

    constructor(props: IHomeProps) {
        super(props);
        this.state = {
            problemList: [],
            search: ""
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

            console.log(result);

            this.setState({
                problemList: result.problemList
            });
        } catch (err) {
            toast.error(err.message);
        }
    }

    private searchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            search: event.target.value
        });
    };

    render() {
        return <div>
            <NavBar />
            <div className="container-fluid bg-light" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                <div className="row px-5 pt-5">
                    <input
                        className="rounded-pill border p-2 pl-4 w-100 mx-3"
                        placeholder="search"
                        value={this.state.search}
                        onChange={this.searchOnChange}
                    />
                </div>
                <div className="row p-3 px-5">
                    {
                        this.state.problemList && this.state.problemList.filter(problem => {
                            if (!this.state.search) {
                                return true;
                            }
                            return problem.title.toLowerCase().search(this.state.search.toLowerCase()) !== -1;
                        }).map((problem, i) => <div
                            key={i}
                            className="col-xl-3 p-3">
                            <ChallengeBox
                                key={i}
                                problemID={problem.id}
                                title={problem.title}
                                difficultyID={problem.difficulty_id}
                                rating={problem.rating}
                                user={problem.user}
                                created_at={problem.created_at}
                                updated_at={problem.updated_at} />
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
