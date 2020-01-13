import React from "react";
import { Container, Form } from "react-bootstrap";
import { IProblemInfo, IProblemStatus } from "../models/Problem";
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
    problemStatuses: IProblemStatus[];
    changed: () => void;
    setDescription: (description: IProblemInfo) => void;
}


class DescriptionForm extends React.Component<IDescriptionFormProps> {
    private inputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.props.setDescription({
            ...this.props,
            [event.target.name]: event.target.value
        });
        // this.setState({ ...this.state, [event.target.name]: event.target.value });
        this.props.changed();
    };

    private deductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const deductionSets = [{
            categoryID: 1,
            typeIDs: [
                {
                    id: 1,
                    formName: "eachBlocksLose"
                },
                {
                    id: 2,
                    formName: "moveMoreThanMaxLose"
                },
                {
                    id: 3,
                    formName: "objectNotGetLose"
                },
            ],
        }]

        const deductionSet = deductionSets.find(set => set.categoryID === this.props.categoryID);

        if (deductionSet) {
            const deduction = this.props.deduction.slice(0);
            const arrIndex = deductionSet.typeIDs.findIndex(type => type.formName === event.target.name);
            if (arrIndex >= 0) {
                deduction[arrIndex] = {
                    id: deductionSet.typeIDs[arrIndex].id,
                    deduct: Number(event.target.value)
                }
                this.props.setDescription({
                    ...this.props,
                    deduction: deduction,
                });
            }
        }
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
                            required
                            value={this.props.maxUsedBlocks ? Number(this.props.maxUsedBlocks).toString() : ""}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <Form.Group controlId="formMaxMoveTimes">
                        <Form.Label>Max. Move Times</Form.Label>
                        <Form.Control
                            name="maxMoveTimes"
                            type="number"
                            min="0"
                            required
                            value={this.props.maxMoveTimes ? Number(this.props.maxMoveTimes).toString() : ""}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <h3>Deduction</h3>
                    <Form.Group controlId="formEachBlocksLose">
                        <Form.Label>Each blocks more the Max. Used Blocks will lose</Form.Label>
                        <Form.Control
                            name="eachBlocksLose"
                            type="number"
                            min="0"
                            required
                            value={this.props.deduction[0] ? (this.props.deduction[0].deduct !== 0 ? Number(this.props.deduction[0].deduct).toString() : "")  : ""}
                            onChange={this.deductionChange} />
                    </Form.Group>

                    <Form.Group controlId="formMoveMoreThanMaxLose">
                        <Form.Label>Move Times more than Max. Move will lose</Form.Label>
                        <Form.Control
                            name="moveMoreThanMaxLose"
                            type="number"
                            min="0"
                            required
                            value={this.props.deduction[1] ? (this.props.deduction[1].deduct !== 0 ? Number(this.props.deduction[1].deduct).toString() : "") : ""}
                            onChange={this.deductionChange} />
                    </Form.Group>

                    <Form.Group controlId="formObjectNotGetLose">
                        <Form.Label>Move Times more than Max. Move will lose</Form.Label>
                        <Form.Control
                            name="objectNotGetLose"
                            type="number"
                            min="0"
                            required
                            value={this.props.deduction[2] ? (this.props.deduction[2].deduct !== 0 ? Number(this.props.deduction[2].deduct).toString() : "") : ""}
                            onChange={this.deductionChange} />
                    </Form.Group>
                </>
            default:
                return <></>
        }

    }

    render() {
        let selectableStatuses: number[] = [];
        switch (this.props.statusID) {
            case 1:
            case 2:
                // WIP & Ready to audit
                selectableStatuses = [1, 2];
                break;
            case 3:
                // WIP & Rejected
                selectableStatuses = [1, 3];
                break;
            case 4:
                // Published
                selectableStatuses = [4];
                break;
            default:
                break;
        }

        console.log();


        return <Container style={{ overflowY: "auto", height: this.props.height }}>
            <Form className="pb-3">
                <h2 className="pt-3">Information</h2>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        placeholder="Title"
                        required
                        value={this.props.title}
                        onChange={this.inputChange} />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        name="description"
                        as="textarea"
                        rows="3"
                        placeholder="Description"
                        required
                        value={this.props.description}
                        onChange={this.inputChange} />
                </Form.Group>
                <Form.Group controlId="formCategory">
                    <Form.Label>Category:</Form.Label>
                    <Form.Control name="categoryID" as="select" value={this.props.categoryID.toString()} onChange={this.inputChange}>
                        {
                            this.props.categories.map(category =>
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )
                        }
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formDifficulty">
                    <Form.Label>Difficulty:</Form.Label>
                    <Form.Control name="difficultyID" as="select" value={this.props.difficultyID.toString()} onChange={this.inputChange}>
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
                        required
                        value={this.props.score ? Number(this.props.score).toString() : ""}
                        onChange={this.inputChange} />
                </Form.Group>

                <hr className="mt-5" />
                {this.renderRequirement(this.props.categoryID)}

                <Form.Group controlId="formStatus">
                    <Form.Label>Status:</Form.Label>
                    <Form.Control name="status" as="select">
                        {
                            this.props.problemStatuses.filter(status =>
                                selectableStatuses.indexOf(status.id) >= 0
                            ).map(status =>
                                <option key={status.id} value={status.id}>{status.name}</option>
                            )
                        }
                    </Form.Control>
                </Form.Group>
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
    problemStatuses: state.problemStatuses.list,
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    changed: () => dispatch(changed()),
    setDescription: (description: IProblemInfo) => dispatch(setDescription(description))
});

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionForm)