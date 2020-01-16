import React from "react";
import { Container, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

interface IDescriptionFormState {
    imageSrc: string;
    croppedImageSrc: string;
    // croppedImageBlob: Blob;
    showImageCrop: boolean;
    imageCropCompleted: boolean;
    // imageRef: HTMLImageElement;
    crop: Crop;
}

class DescriptionForm extends React.Component<IDescriptionFormProps, IDescriptionFormState> {
    private imageRef: HTMLImageElement;

    constructor(props: IDescriptionFormProps) {
        super(props)

        this.imageRef = new Image();

        this.state = {
            imageSrc: "",
            croppedImageSrc: "",
            // croppedImageBlob: new Blob([]),
            showImageCrop: false,
            imageCropCompleted: false,
            // imageRef: new Image(),
            crop: {
                width: 300,
                height: 300,
                aspect: 1,
            },
        }
    }

    private inputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.props.setDescription({
            ...this.props,
            [event.target.name]: event.target.value
        });
        // this.setState({ ...this.state, [event.target.name]: event.target.value });
        this.props.changed();
    };

    private onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                if (reader.result) {
                    this.setState({
                        ...this.state,
                        showImageCrop: true,
                        imageSrc: reader.result as string,
                    });
                }

            });
            reader.readAsDataURL(event.target.files[0]);
            event.target.value = "";

            this.setState({
                ...this.state,
                showImageCrop: true,
            });
        }
    }

    private onHideImagePreview = () => {
        this.setState({
            ...this.state,
            showImageCrop: false,
        });
    }

    private onCropChange = (crop: Crop) => {
        this.setState({
            ...this.state,
            crop
        });
    }

    private onImageLoaded = (image: HTMLImageElement) => {
        this.imageRef = image;
    };

    private onSaveImage = () => {
        this.setState({
            ...this.state,
            showImageCrop: false,
            imageCropCompleted: true,
        });

        this.props.setDescription({
            ...this.props,
            image: this.state.croppedImageSrc,
        });
        this.props.changed();
    }

    private onCropComplete = (crop: Crop) => {
        const image = this.imageRef;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        if (crop.width !== undefined && crop.height !== undefined && crop.x !== undefined && crop.y !== undefined) {
            console.log("crop true");
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                const dataURL = canvas.toDataURL();
                this.setState({
                    ...this.state,
                    croppedImageSrc: dataURL,
                    // showImageCrop: false,
                    imageCropCompleted: false,
                });

                // canvas.toBlob((blob) => {
                //     if (blob) {
                //         const url = URL.createObjectURL(blob);
                //         console.log("url", url);

                //         this.setState({
                //             ...this.state,
                //             croppedImageSrc: url,
                //             croppedImageBlob: blob,
                //             // showImageCrop: false,
                //             imageCropCompleted: false,
                //         });
                //     }
                // });
            }
        }
    }

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
                            value={this.props.deduction[0] ? (this.props.deduction[0].deduct !== 0 ? Number(this.props.deduction[0].deduct).toString() : "") : ""}
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
                        <Form.Label>Each object haven't got will lose</Form.Label>
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
        switch (Number(this.props.statusID)) {
            case 1:
            case 2:
                // WIP & Ready to audit
                selectableStatuses = [1, 2];
                break;
            case 3:
                // Rejected & Ready to audit
                selectableStatuses = [3, 2];
                break;
            case 4:
                // Published
                selectableStatuses = [4];
                break;
            default:
                break;
        }

        return <Container className="shadow" style={{ overflowY: "auto", height: this.props.height, padding: "20px 75px 50% 75px" }}>
            <Form className="pb-3" id="descForm">
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

                <Form.Group controlId="formImage">
                    <Form.Label className="d-block">
                        <div className="mb-2">Image:</div>

                        <div className="border bg-lightgray d-block">
                            <div className="bg-white m-3 imageSize">
                                {!this.props.image && <FontAwesomeIcon icon={faImage} size="3x" className="text-black-50" />}
                                {
                                    this.props.image && this.state.imageCropCompleted &&
                                    <img src={this.props.image} className="imageSize imagePreview" alt="cropped" />
                                }
                            </div>
                        </div>
                    </Form.Label>
                    <Form.Control
                        name="image"
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={this.onSelectFile}
                    />
                </Form.Group>

                <Modal centered size="lg" show={this.state.showImageCrop} onHide={this.onHideImagePreview} >
                    <Modal.Body>
                        <ReactCrop
                            minWidth={300}
                            minHeight={300}
                            src={this.state.imageSrc}
                            crop={this.state.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.onHideImagePreview}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.onSaveImage}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

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
                    <Form.Control name="statusID" as="select" value={this.props.statusID.toString()} onChange={this.inputChange}>

                        {
                            this.props.problemStatuses.filter(status =>
                                selectableStatuses.indexOf(status.id) >= 0
                            ).sort((s1, s2) =>
                                selectableStatuses.indexOf(s1.id) - selectableStatuses.indexOf(s2.id)
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
    image: state.problem.image,

    categories: state.category.list,
    difficulties: state.difficulty.list,
    problemStatuses: state.problemStatuses.list,
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    changed: () => dispatch(changed()),
    setDescription: (description: IProblemInfo) => dispatch(setDescription(description))
});

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionForm)