import React from "react";
import { Container, Form } from "react-bootstrap";
import { IProblemInfo } from "../models/Problem";
import { IRootState, ReduxThunkDispatch } from '../store';
import { connect } from "react-redux";
import { changed, setDescription } from "../actions/problemActions";
import { ICategory } from "../models/Category";
import { IDifficulty } from "../models/Difficulty";

import '../css/descForm.css';

interface IDescriptionFormProps extends IProblemInfo {
    height: number;
    categories: ICategory[];
    difficulties: IDifficulty[];
    changed: () => void;
    setDescription: (description: IProblemInfo) => void;
}

interface IDescriptionFormStates extends IProblemInfo { }


class DescriptionForm extends React.Component<IDescriptionFormProps, IDescriptionFormStates> {

    constructor(props: IDescriptionFormProps) {
        super(props);
        this.state = {
            title: props.title,
            categoryID: props.categoryID,
            difficultyID: props.difficultyID,
            statusID: props.statusID,
            description: props.description,
            score: props.score,
            maxUsedBlocks: props.maxUsedBlocks,
            maxMoveTimes: props.maxMoveTimes,
            deduction: props.deduction,
        };
    }

    private inputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(event.target.name, event.target.value);
        
        this.setState({ ...this.state, [event.target.name]: event.target.value });
        this.props.changed();
    };

    private categorySelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        // const category = this.props.categories.find(category => category.id === parseInt(event.target.value));
        // this.setState({ ...this.state, category: category });
        // this.props.changed();
    }

    componentWillUnmount() {
        this.props.setDescription({
            title: this.state.title,
            categoryID: this.state.categoryID,
            difficultyID: this.state.difficultyID,
            statusID: this.state.statusID,
            description: this.state.description,
            score: this.state.score,
            maxUsedBlocks: this.state.maxUsedBlocks,
            maxMoveTimes: this.state.maxMoveTimes,
            deduction: this.state.deduction,
        });
    }

    renderRequirement(categoryID: number) {
        switch (categoryID) {
            case 1:
                return <>
                    <h2>Requirement</h2>
                    <h3>Full Marks</h3>

                    <Form.Group controlId="formMaxUsedBlocks">
                        <Form.Label>Max. Used Blocks</Form.Label>
                        <Form.Control
                            name="maxUsedBlocks"
                            type="number"
                            min="0"
                            value={Number(this.state.maxUsedBlocks).toString()}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <Form.Group controlId="formMaxMoveTimes">
                        <Form.Label>Max. Move Times</Form.Label>
                        <Form.Control
                            name="maxMoveTimes"
                            type="number"
                            min="0"
                            value={Number(this.state.maxMoveTimes).toString()}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <h3>Deduction</h3>
                </>
            default:
                return <></>
        }

    }

    render() {
        return <Container style={{ overflowY: "auto", height: this.props.height }}>
            <Form>
                <h2 className="pt-3">Information</h2>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={this.state.title}
                        onChange={this.inputChange} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        name="description"
                        as="textarea"
                        rows="3"
                        placeholder="Description"
                        value={this.state.description}
                        onChange={this.inputChange} />
                </Form.Group>
                <Form.Group controlId="formCategory">
                    <Form.Label>Category:</Form.Label>
                    <Form.Control name="category" as="select">
                        {
                            this.props.categories.map(category =>
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )
                        }
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formDifficulty">
                    <Form.Label>Difficulty:</Form.Label>
                    <Form.Control name="difficulty" as="select">
                        {
                            this.props.difficulties.map(difficulty =>
                                <option key={difficulty.id} value={difficulty.id}>{difficulty.name} (Exp: {difficulty.experience})</option>
                            )
                        }
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formScore">
                    <Form.Label>Score:</Form.Label>
                    <Form.Control
                        name="score"
                        type="number"
                        min="0"
                        value={Number(this.state.score).toString()}
                        onChange={this.inputChange} />
                </Form.Group>

                <hr className="mt-5" />
                {this.renderRequirement(this.state.categoryID)}

                {/* <Form.Group controlId="formEachBlocksLose">
                        <Form.Label>Each blocks more the Max. Used Blocks will lose</Form.Label>
                        <Form.Control
                            name="eachBlocksLose"
                            type="number"
                            min="0"
                            value={Number(this.state.eachBlocksLose).toString()}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <Form.Group controlId="formMoveMoreThanMax">
                        <Form.Label>Move Times more than Max. Move will lose</Form.Label>
                        <Form.Control
                            name="moveMoreThanMax"
                            type="number"
                            min="0"
                            value={Number(this.state.moveMoreThanMax).toString()}
                            onChange={this.inputChange} />
                    </Form.Group> */}


            </Form>
        </Container>
    }

}

const mapStateToProps = (state: IRootState) => ({
    title: state.problem.title,
    categoryID: state.problem.categoryID,
    difficultyID: state.problem.difficultyID,
    statusID: state.problem.statusID,
    description: state.problem.description,
    score: state.problem.score,
    maxUsedBlocks: state.problem.maxUsedBlocks,
    maxMoveTimes: state.problem.maxMoveTimes,
    deduction: state.problem.deduction,

    categories: state.category.list,
    difficulties: state.difficulty.list,
})

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    changed: () => dispatch(changed()),
    setDescription: (description: IProblemInfo) => dispatch(setDescription(description))
});

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionForm)