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
    problemList: IProblemBox[];
    search: string;
}

export interface IProblemBox {
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
        const data = localStorage.getItem("savedCodes");
        const recents = JSON.parse(data ? data : "[]");
        return <div>
            <NavBar />
            <div className="container-fluid bg-light" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                {
                    !!data && this.state.problemList && <>
                        <div className="row px-5 pt-5 border-bottom py-3">
                            <h3 className="col-12">Recents</h3>
                            {
                                recents.map((r: any, i: number) => {
                                    const problem = this.state.problemList.find((p) => p.id === parseInt(r.pid));
                                    if (problem) {
                                        return <React.Fragment key={i}>
                                            <div
                                                className="col-xl-3 p-3">
                                                <ChallengeBox key={i} {...problem} />
                                            </div>
                                        </React.Fragment>
                                    }
                                    return <React.Fragment key={i}></React.Fragment>
                                })
                            }
                        </div>
                    </>
                }
                <div className="row p-3 px-5">
                    <h3 className="col-12">All Challenges</h3>
                    {/* searchBar */}
                    <div className="col-12 px-3">
                        <input
                            className="rounded-pill border p-2 pl-4 w-100"
                            placeholder="search"
                            value={this.state.search}
                            onChange={this.searchOnChange}
                        />
                    </div>
                    {/* ChallengeBox */}
                    {
                        this.state.problemList && this.state.problemList.map(problem => {
                            if (!this.state.search) {
                                return { ...problem, score: 1 };
                            }
                            const title = problem.title.toLowerCase();
                            const search = this.state.search.toLowerCase();
                            let score = 0;
                            for (let i = 0; i < title.length; i++) {
                                if (search.includes(title[i])) {
                                    score++;
                                }
                            }
                            return { ...problem, score };
                        }).sort((a, b) => b.score - a.score).filter(p => p.score > 0).map((problem, i) => <div
                            key={i}
                            className="col-xl-3 p-3">
                            <ChallengeBox key={i} {...problem} />
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
