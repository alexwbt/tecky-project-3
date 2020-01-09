import React from "react";
import { Container, Form } from "react-bootstrap";
import { IProblemInfo } from "../models/Problem";
import { IRootState } from '../store';
import { connect } from "react-redux";


interface IDescriptionFormProps extends IProblemInfo {

}

interface IDescriptionFormStates extends IProblemInfo {

}


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
            deduction: props.deduction,
        };
    }

    private inputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log("inputChange", event.target.value);

        this.setState({ ...this.state, [event.target.name]: event.target.value });
    }

    render() {
        return (
            <Container>
                <Form>
                    <h2>Information</h2>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            type="text"
                            value={this.state.title}
                            placeholder="Title"
                            onChange={this.inputChange} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            name="description"
                            as="textarea"
                            rows="3"
                            placeholder="Description"
                            onChange={this.inputChange} />
                    </Form.Group>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control name="category" as="select">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDifficulty">
                        <Form.Label>Difficulty</Form.Label>
                        <Form.Control name="difficulty" as="select">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formScore">
                        <Form.Label>Score</Form.Label>
                        <Form.Control
                            name="score"
                            type="number"
                            min="0"
                            value={Number(this.state.score).toString()}
                            placeholder="Title"
                            onChange={this.inputChange} />
                    </Form.Group>

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

    // private checkBoxChange(field: "publish", event: React.ChangeEvent<HTMLInputElement>) {
    //     this.setState({ ...this.state, [field]: event.target.checked });
    // }

    // render() {
    //     return <form className="p-2">
    //         <label htmlFor="titleInput" className="input-group-prepend">
    //             <span className="">Title:</span>
    //         </label>
    //         <input
    //             id="titleInput"
    //             className="form-control"
    //             name="title"
    //             placeholder="Title"
    //             value={this.state.title}
    //             onChange={this.inputChange.bind(this, "title")}
    //             required />
    //         <label htmlFor="descriptionInput" className="input-group-prepend mt-1">
    //             <span className="">Description:</span>
    //         </label>
    //         <textarea
    //             id="descriptionInput"
    //             rows={5}
    //             className="form-control"
    //             placeholder="Description"
    //             value={this.state.description}
    //             onChange={this.inputChange.bind(this, "description")}
    //             required />
    //         {/* <label htmlFor="publishInput" className="input-group-prepend mt-1">
    //             <span className="">Publish:</span>
    //         </label>
    //         <input
    //             type="checkbox"
    //             id="publishInput"
    //             className="d-inline"
    //             placeholder="publish"
    //             checked={this.state.publish}
    //             onChange={this.checkBoxChange.bind(this, "publish")}
    //             required /> */}
    //     </form>
    // }

}

const mapStateToProps = (state: IRootState) => ({
    title: state.problem.title,
    category: state.problem.category,
    difficulty: state.problem.difficulty,
    status: state.problem.status,
    description: state.problem.description,
    score: state.problem.score,
    deduction: state.problem.deduction,
})

// const mapDispatchToProps = {

// }

export default connect(mapStateToProps)(DescriptionForm)