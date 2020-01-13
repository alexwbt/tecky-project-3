import React from "react";
import { Button, Modal } from "react-bootstrap";
import { IProblemDeduction } from "../../models/Problem";


interface IGameEndModalProps {
    show: boolean;
    failed: boolean;
    blockCount: number;
    movedTime: number;
    missedObjects: number;
    maxUsedBlocks: number;
    maxMoveTimes: number;
    deduction: IProblemDeduction[];
    handleClose: () => void;
}

const GameEndModal: React.FC<IGameEndModalProps> = (props: IGameEndModalProps) => {
    console.log(props.deduction);
    return <>
        <Modal size="lg" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h1>{props.failed ? "Sorry." : "Congratulation!"}</h1></Modal.Title>
            </Modal.Header>
            {
                props.failed ?
                    <Modal.Body>
                        You fave failed the challenge.
                    </Modal.Body>
                    :
                    <Modal.Body>
                        <h4>You have completed the challenge.</h4>
                        <div>You've used {props.blockCount} blocks.</div>
                        {props.deduction.length > 0 && props.blockCount > props.maxUsedBlocks &&
                            <div className="text-danger border-bottom">
                                You've used more than {props.maxUsedBlocks} blocks.
                                <span className="float-right">(-{(props.blockCount - props.maxUsedBlocks) * props.deduction[0].deduct} points)</span>
                            </div>}
                        <div>You've moved {props.movedTime} times.</div>
                        {props.deduction.length > 0 && props.movedTime > props.maxMoveTimes &&
                            <div className="text-danger border-bottom">
                                You've moved more than {props.maxMoveTimes} times.
                                <span className="float-right">(-{(props.movedTime - props.maxMoveTimes) * props.deduction[1].deduct} points)</span>
                            </div>}
                        {props.deduction.length > 0 && props.blockCount > props.maxUsedBlocks &&
                            <div className="text-danger border-bottom">
                                You've missed {props.missedObjects} collectables.
                                <span className="float-right">(-{props.missedObjects * props.deduction[2].deduct} points)</span>
                            </div>}
                    </Modal.Body>
            }
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
};
export default GameEndModal;