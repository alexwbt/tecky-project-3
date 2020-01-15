import React from "react";
import { connect } from "react-redux";
import { IRootState, ReduxThunkDispatch } from "../store";

import NavBar from "../components/NavBar";
import tileSprite from "../sprites/tileSprite.png";
import charSprite from "../sprites/charSprite.png";
import objSprite from "../sprites/objectSprite.png";
import Canvas from "../components/canvas/Canvas";
import { IProblemState } from "../reducers/problemReducer";
import BlocklyArea from "../components/blockly/BlocklyArea";
import { getProblem } from "../thunks/problemThunk";
import ProblemRater from "../components/ProblemRater";


interface ISolverProps {
    match: {
        params: {
            problemId: number;
        };
    };
    authenticated: boolean;
    problem: IProblemState;
    getProblem: (id: number) => void;
}

interface ISolverStates {
    height: number;
    myRating: number;
}

class Solver extends React.Component<ISolverProps, ISolverStates> {

    private tileSpriteImg: React.RefObject<HTMLImageElement>;
    private charSpriteImg: React.RefObject<HTMLImageElement>;
    private objSpriteImg: React.RefObject<HTMLImageElement>;

    constructor(props: ISolverProps) {
        super(props);
        this.state = {
            height: 0,
            myRating: -1
        };
        this.tileSpriteImg = React.createRef();
        this.charSpriteImg = React.createRef();
        this.objSpriteImg = React.createRef();
    }

    private updateHeight = () => {
        const nav = document.getElementById("navagation-bar");
        this.setState({
            ...this.state,
            height: nav ? window.innerHeight - nav.clientHeight : 0
        });
    };

    async getMyRatingOfThisProblem() {
        const res = await fetch(`${process.env.REACT_APP_API_SERVER}/problem/userRating/${this.props.match.params.problemId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const result = await res.json();

        if (res.status === 200 && result.success) {
            this.setState({
                ...this.state,
                myRating: result.rating
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        this.updateHeight();

        document.title = "BlockDojo - Solver";

        this.props.getProblem(this.props.match.params.problemId);
        if (this.props.authenticated) {
            this.getMyRatingOfThisProblem();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }

    render() {
        return <div style={{ overflow: "hidden" }}>
            <NavBar />
            <img ref={this.tileSpriteImg} src={tileSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.charSpriteImg} src={charSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.objSpriteImg} src={objSprite} className={"d-none"} alt={"sprite"} />
            <div className="container-fluid p-0 bg-light">
                <div className="row w-100 m-0" style={{ height: this.state.height }}>
                    <div className="col-4 p-1" style={{ overflowY: "auto", height: this.state.height }}>
                        {
                            this.tileSpriteImg.current &&
                            this.charSpriteImg.current &&
                            this.objSpriteImg.current && <Canvas
                                problemID={this.props.match.params.problemId}
                                tileSprite={this.tileSpriteImg.current}
                                charSprite={this.charSpriteImg.current}
                                objSprite={this.objSpriteImg.current}
                                editable={false} />
                        }
                        <h2>{this.props.problem.title}</h2>
                        {this.state.myRating >= 0 && <ProblemRater default={this.state.myRating} problemID={this.props.match.params.problemId} />}
                        <h6>Rules:</h6>
                        <ul className="p-2">
                            <li className="ml-3">
                                You can use no more than {this.props.problem.maxUsedBlocks} blocks.
                                        (-{this.props.problem.deduction[0]?.deduct}points / blocks)
                                    </li>
                            <li className="ml-3">
                                Player can move no more than {this.props.problem.maxMoveTimes} times.
                                        (-{this.props.problem.deduction[1]?.deduct}points / move)
                                    </li>
                            <li className="ml-3">
                                Collect all collectables.
                                        (-{this.props.problem.deduction[2]?.deduct}points / collectables missed)
                                    </li>
                        </ul>
                        <h6>Description:</h6>
                        <p className="p-2">{this.props.problem.description}</p>
                    </div>
                    {
                        !!this.props.problem.avalibleBlocks[this.props.problem.avalibleCategories[0]]?.length && <BlocklyArea
                            useCategory={this.props.problem.useCategory}
                            avalibleBlocks={this.props.problem.avalibleBlocks}
                            avalibleCategories={this.props.problem.avalibleCategories}
                            useVariables={this.props.problem.useCategory && this.props.problem.useVariables}
                            useFunctions={this.props.problem.useCategory && this.props.problem.useFunctions}
                            height={this.state.height}
                            className="col-8 p-0" />
                    }
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    authenticated: state.auth.authenticated,
    problem: state.problem
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProblem: (id: number) => dispatch(getProblem(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Solver);
