import React from "react";
import { Button, Modal } from "react-bootstrap";


interface IGameEndModalProps {
    show: boolean;
    failed: boolean;
    handleClose: () => void;
}

const complete = {
    title: "Congratulation!",
    body: "You have completed the challenge."
};
const failed = {
    title: "Sorry.",
    body: "You fave failed the challenge."
};

const GameEndModal: React.FC<IGameEndModalProps> = (props: IGameEndModalProps) => {
    const content = props.failed ? failed : complete;
    return <>
        <Modal size="lg" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{content.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content.body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
};
export default GameEndModal;