import React from "react";
import { Button, Modal } from "react-bootstrap";


interface IGameEndModalProps {
    show: boolean;
    handleClose: () => void;
}

const GameEndModal: React.FC<IGameEndModalProps> = (props: IGameEndModalProps) => {
    return <>
        <Modal size="lg" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Congratulation!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You have completed the challenge.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
};
export default GameEndModal;