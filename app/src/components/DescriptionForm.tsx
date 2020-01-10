import React from "react";
import { Container, Form } from "react-bootstrap";
import { IProblemInfo } from "../models/Problem";
import { IRootState, ReduxThunkDispatch } from '../store';
import { connect } from "react-redux";
import { changed, setDescription } from "../actions/problemActions";
import { ICategory } from "../models/Category";
import { IDifficulty } from "../models/Difficulty";


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
            category: props.category,
            difficulty: props.difficulty,
            status: props.status,
            description: props.description,
            score: props.score,
            deduction: props.deduction
        };
    }

    private inputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({ ...this.state, [event.target.name]: event.target.value });
        this.props.changed();
    };

    componentWillUnmount() {
        this.props.setDescription({
            title: this.state.title,
            category: this.state.category,
            difficulty: this.state.difficulty,
            status: this.state.status,
            description: this.state.description,
            score: this.state.score,
            deduction: this.state.deduction
        });
    }

    render() {
        return (
            <Container style={{ overflowY: "auto", height: this.props.height }}>
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
                            placeholder="Title"
                            value={Number(this.state.score).toString()}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <hr className="mt-5" />
                    <h2>Requirement</h2>
                    <h3>Full Marks</h3>


                    {/* <Form.Group controlId="form">
                        <Form.Label></Form.Label>
                        <Form.Control />
                    </Form.Group> */}
                </Form>
            </Container>

        )
    }

}

const mapStateToProps = (state: IRootState) => ({
    title: state.problem.title,
    category: state.problem.category,
    difficulty: state.problem.difficulty,
    status: state.problem.status,
    description: state.problem.description,
    score: state.problem.score,
    deduction: state.problem.deduction,
    
    categories: state.category.list,
    difficulties: state.difficulty.list,
})

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    changed: () => dispatch(changed()),
    setDescription: (description: IProblemInfo) => dispatch(setDescription(description))
});

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionForm)