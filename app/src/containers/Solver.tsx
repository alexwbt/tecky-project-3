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


interface ISolverProps {
    match: {
        params: {
            problemId: number;
        };
    };
    problem: IProblemState;
    getProblem: (id: number) => void;
}

interface ISolverStates {
    height: number;
    desHeight: number;
}

class Solver extends React.Component<ISolverProps, ISolverStates> {

    private tileSpriteImg: React.RefObject<HTMLImageElement>;
    private charSpriteImg: React.RefObject<HTMLImageElement>;
    private objSpriteImg: React.RefObject<HTMLImageElement>;

    constructor(props: ISolverProps) {
        super(props);
        this.state = {
            height: 0,
            desHeight: 0
        };
        this.tileSpriteImg = React.createRef();
        this.charSpriteImg = React.createRef();
        this.objSpriteImg = React.createRef();
    }

    private updateHeight = () => {
        const nav = document.getElementById("navagation-bar");
        const canvas = document.getElementById("canvas-container");
        this.setState({
            ...this.state,
            height: nav ? window.innerHeight - nav.clientHeight : 0,
            desHeight: nav && canvas ? window.innerHeight - nav.clientHeight - canvas.clientHeight : 0
        });
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        setTimeout(this.updateHeight, 100);
        setTimeout(this.updateHeight, 500);

        document.title = "BlockDojo - Solver";

        this.props.getProblem(this.props.match.params.problemId);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }

    render() {
        return <div>
            <NavBar />
            <img ref={this.tileSpriteImg} src={tileSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.charSpriteImg} src={charSprite} className={"d-none"} alt={"sprite"} />
            <img ref={this.objSpriteImg} src={objSprite} className={"d-none"} alt={"sprite"} />
            <div className="container-fluid p-0 bg-light">
                <div className="row w-100 m-0" style={{ height: this.state.height }}>
                    <div className="col-4 p-1">
                        {
                            this.tileSpriteImg.current &&
                            this.charSpriteImg.current &&
                            this.objSpriteImg.current && <Canvas
                                    tileSprite={this.tileSpriteImg.current}
                                    charSprite={this.charSpriteImg.current}
                                    objSprite={this.objSpriteImg.current}
                                    size={16 * 100}
                                    editable={false} />
                        }
                        {
                            !!this.state.desHeight && <div style={{ overflowY: "auto", maxHeight: this.state.desHeight - 10 }}>
                                <h1>{this.props.problem.title}</h1>
                            </div>
                        }
                    </div>
                    <BlocklyArea
                        useCategory={this.props.problem.useCategory}
                        avalibleBlocks={this.props.problem.avalibleBlocks}
                        avalibleCategories={this.props.problem.avalibleCategories}
                        useVariables={this.props.problem.useCategory && this.props.problem.useVariables}
                        useFunctions={this.props.problem.useCategory && this.props.problem.useFunctions}
                        height={this.state.height}
                        className="col-8 p-0" />
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    problem: state.problem
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    getProblem: (id: number) => dispatch(getProblem(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Solver);
