import React from "react";
import { Container, Form, Modal, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { IProblemInfo, IProblemStatus, ProblemStatus } from "../models/Problem";
import { IRootState, ReduxThunkDispatch } from '../store';
import { connect } from "react-redux";
import { changed, setDescription } from "../actions/problemActions";
import { ICategory } from "../models/Category";
import { IDifficulty } from "../models/Difficulty";

import '../css/descForm.css';

interface IDescriptionFormProps extends IProblemInfo {
    pid: number;
    height: number;
    categories: ICategory[];
    difficulties: IDifficulty[];
    problemStatuses: IProblemStatus[];
    roleID: number;

    mode: "edit" | "audit";

    changed: () => void;
    setDescription: (description: IProblemInfo) => void;
}

interface IDescriptionFormState {
    showUploadedImg: boolean;
    imageSrc: string;
    croppedImageSrc: string;
    showImageCrop: boolean;
    imageCropCompleted: boolean;
    crop: Crop;
}

class DescriptionForm extends React.Component<IDescriptionFormProps, IDescriptionFormState> {
    private imageRef: HTMLImageElement;

    constructor(props: IDescriptionFormProps) {
        super(props)

        this.imageRef = new Image();

        this.state = {
            showUploadedImg: true,
            imageSrc: "",
            croppedImageSrc: "",
            showImageCrop: false,
            imageCropCompleted: false,
            crop: {
                width: 300,
                height: 300,
                aspect: 1,
            },
        }
    }

    private inputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value: string | number = event.target.value;
        if (event.target.type === 'number') {
            value = Math.max(Number(value), Number(event.target.getAttribute("min")))
        }

        this.props.setDescription({
            ...this.props,
            [event.target.name]: value
        });
        // this.setState({ ...this.state, [event.target.name]: event.target.value });
        this.props.changed();
    };

    private onStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.setDescription({
            ...this.props,
            statusID: parseInt(event.target.value)
        });
        this.props.changed();
    }

    private handleErrorOnUploadedImg = () => {
        this.setState({
            ...this.state,
            showUploadedImg: false,
        })
    }

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
            crop: {
                ...crop,
                width: 300,
                height: 300,
            }
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
                    imageCropCompleted: false,
                });
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
                            value={this.props.maxUsedBlocks !== null ? this.props.maxUsedBlocks.toString() : ""}
                            onChange={this.inputChange} />
                    </Form.Group>

                    <Form.Group controlId="formMaxMoveTimes">
                        <Form.Label>Max. Move Times</Form.Label>
                        <Form.Control
                            name="maxMoveTimes"
                            type="number"
                            min="0"
                            required
                            value={this.props.maxMoveTimes !== null ? Number(this.props.maxMoveTimes).toString() : ""}
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
                            // value={this.props.deduction[0] ? (this.props.deduction[0].deduct !== 0 ? Number(this.props.deduction[0].deduct).toString() : "") : ""}
                            value={this.props.deduction[0] ? this.props.deduction[0].deduct.toString() : "0"}
                            onChange={this.deductionChange} />
                    </Form.Group>

                    <Form.Group controlId="formMoveMoreThanMaxLose">
                        <Form.Label>Move Times more than Max. Move will lose</Form.Label>
                        <Form.Control
                            name="moveMoreThanMaxLose"
                            type="number"
                            min="0"
                            required
                            // value={this.props.deduction[1] ? (this.props.deduction[1].deduct !== 0 ? Number(this.props.deduction[1].deduct).toString() : "") : ""}
                            value={this.props.deduction[1] ? this.props.deduction[1].deduct.toString() : "0"}
                            onChange={this.deductionChange} />
                    </Form.Group>

                    <Form.Group controlId="formObjectNotGetLose">
                        <Form.Label>Each object haven't got will lose</Form.Label>
                        <Form.Control
                            name="objectNotGetLose"
                            type="number"
                            min="0"
                            required
                            // value={this.props.deduction[2] ? (this.props.deduction[2].deduct !== 0 ? Number(this.props.deduction[2].deduct).toString() : "") : ""}
                            value={this.props.deduction[2] ? this.props.deduction[2].deduct.toString() : "0"}
                            onChange={this.deductionChange} />
                    </Form.Group>
                </>
            default:
                return <></>
        }

    }

    private getSelectableStatuses = () => {
        let ids: number[] = [];

        if (this.props.roleID === 1 && this.props.mode === "audit") {
            // WIP & Ready to audit
            ids = [2, 4, 3];
        } else {


            switch (Number(this.props.statusID)) {
                case 1:
                case 2:
                    // WIP & Ready to audit
                    ids = [1, 2];
                    break;
                case 3:
                    // Rejected & Ready to audit
                    ids = [3, 2];
                    break;
                case 4:
                    // Published
                    ids = [4];
                    break;
                default:
                    break;
            }
        }

        const statuses = this.props.problemStatuses.filter(status =>
            ids.indexOf(status.id) >= 0
        ).sort((s1, s2) =>
            ids.indexOf(s1.id) - ids.indexOf(s2.id)
        )

        return statuses;
    }

    render() {
        return <Container className="shadow" style={{ overflowY: "auto", height: this.props.height, padding: "20px 75px 50% 75px" }}>
            {
                this.props.statusID === ProblemStatus.Rejected && this.props.mode === "edit" &&
                <Alert variant="danger">
                    <Alert.Heading>Rejected Reason</Alert.Heading>
                    <p>{this.props.reason}</p>
                </Alert>
            }

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
                                {
                                    ((this.props.image && this.state.imageCropCompleted) || (this.state.showUploadedImg)) &&
                                    <img
                                        src={this.props.image ? this.props.image : `${process.env.REACT_APP_CHALLENGE_IMAGE_LINK}/${this.props.pid}.png`}
                                        onError={this.handleErrorOnUploadedImg}
                                        className="imageSize imagePreview"
                                        alt="cropped" />
                                }
                                {

                                    !this.props.image && !this.state.showUploadedImg &&
                                    <div className="d-flex flex-column justify-content-center align-items-center h-100 btn btn-light">
                                        <FontAwesomeIcon icon={faImage} size="3x" className="text-black-50" />
                                        Upload
                                    </div>
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
                            maxWidth={300}
                            maxHeight={300}
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
                        value={this.props.score !== null ? this.props.score.toString() : ""}
                        onChange={this.inputChange} />
                </Form.Group>

                <hr className="mt-5" />
                {this.renderRequirement(this.props.categoryID)}

                <Form.Group controlId="formStatus">
                    <Form.Label>Status:</Form.Label>
                    <Form.Control name="statusID" as="select" value={this.props.statusID.toString()} onChange={this.onStatusChange}>
                        {
                            this.getSelectableStatuses().map(status =>
                                <option key={status.id} value={status.id}>{status.name}</option>
                            )
                        }
                    </Form.Control>
                </Form.Group>

                {
                    this.props.statusID === ProblemStatus.Rejected && this.props.mode === "audit" &&
                    <Form.Group controlId="formRejectedReason">
                        <Form.Label>Rejected Reason:</Form.Label>
                        <Form.Control
                            name="reason"
                            as="textarea"
                            rows="3"
                            placeholder="Reason"
                            required
                            value={this.props.reason}
                            onChange={this.inputChange} />
                    </Form.Group>
                }
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

    reason: state.problem.reason,

    categories: state.category.list,
    difficulties: state.difficulty.list,
    problemStatuses: state.problemStatuses.list,
    roleID: state.auth.role,
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    changed: () => dispatch(changed()),
    setDescription: (description: IProblemInfo) => dispatch(setDescription(description))
});

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionForm)