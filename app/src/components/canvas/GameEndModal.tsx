import React from "react";
import { Button, Modal } from "react-bootstrap";


interface IGameEndModalProps {
    show: boolean;
    handleClose: () => void;
}

const GameEndModal: React.FC<IGameEndModalProps> = (props: IGameEndModalProps) => {
    return <>
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
          </Button>
                <Button variant="primary" onClick={props.handleClose}>
                    Save Changes
          </Button>
            </Modal.Footer>
        </Modal>
    </>
};
export default GameEndModal;