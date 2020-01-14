import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IProblemDeduction } from "../../models/Problem";


interface IGameEndModalProps {
    show: boolean;
    failed: boolean;
    score: number;
    blockCount: number;
    movedTime: number;
    missedObjects: number;
    maxUsedBlocks: number;
    maxMoveTimes: number;
    deduction: IProblemDeduction[];
    handleClose: () => void;
}

const GameEndModal: React.FC<IGameEndModalProps> = (props: IGameEndModalProps) => {
    if (props.deduction.length < 3) {
        return <></>
    }

    let score = props.score;

    const blockCountEx = props.blockCount > props.maxUsedBlocks;
    const blockCountDe = (props.blockCount - props.maxUsedBlocks) * props.deduction[0].deduct;
    if (blockCountEx) {
        score -= blockCountDe;
    }

    const movedTimesEx = props.movedTime > props.maxMoveTimes;
    const movedTimesDe = (props.movedTime - props.maxMoveTimes) * props.deduction[1].deduct;
    if (movedTimesEx) {
        score -= movedTimesDe;
    }

    const missedObjEx = props.missedObjects > 0;
    const missedObjDe = props.missedObjects * props.deduction[2].deduct;
    if (missedObjEx) {
        score -= missedObjDe;
    }

    return <>
        <Modal size="lg" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h2>{props.failed ? "Sorry." : "Congratulation!"}</h2></Modal.Title>
            </Modal.Header>
            {
                props.failed ?
                    <Modal.Body>
                        You fave failed the challenge.
                    </Modal.Body>
                    :
                    <Modal.Body>
                        <div className="text-center">
                            <h4>You have completed the challenge.</h4>
                            <h1 style={{fontSize: 100}}>{score}/{props.score}</h1>
                        </div>

                        <div>You've used {props.blockCount} blocks.</div>
                        {
                            blockCountEx && <div className="text-danger border-bottom">
                                You've used more than {props.maxUsedBlocks} blocks.
                                <span className="float-right">(-{blockCountDe} points)</span>
                            </div>
                        }

                        <div>You've moved {props.movedTime} times.</div>
                        {
                            movedTimesEx && <div className="text-danger border-bottom">
                                You've moved more than {props.maxMoveTimes} times.
                                <span className="float-right">(-{movedTimesDe} points)</span>
                            </div>
                        }

                        {
                            missedObjEx && <div className="text-danger border-bottom">
                                You've missed {props.missedObjects} collectables.
                                <span className="float-right">(-{missedObjDe} points)</span>
                            </div>
                        }
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