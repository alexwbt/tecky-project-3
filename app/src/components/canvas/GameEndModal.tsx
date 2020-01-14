import React from "react";
import { Button, Modal } from "react-bootstrap";
import { IProblemDeduction } from "../../models/Problem";
import ReactCountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { submitProgress } from "../../thunks/profileThunks";


interface IGameEndModalProps {
    show: boolean;
    problemID?: number;
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
    const dispatch = useDispatch();

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

    score = Math.max(0, score);

    let failed = props.failed;
    if (score < props.score / 2) {
        failed = true;
    }

    return <>
        <Modal size="lg" show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h2>{failed ? "Sorry." : "Congratulation!"}</h2></Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center">
                    <h4>{failed ? "You have failed the challenge." : "You have completed the challenge."}</h4>
                    <h6>Your Score:</h6>
                    <h1 className={failed ? "text-danger" : "text-success"} style={{ fontSize: 100, paddingBottom: "40px" }}>
                        <ReactCountUp end={score} start={props.score} duration={2} />
                        /{props.score}
                    </h1>
                </div>

                <div>You've used {props.blockCount} blocks.</div>
                {
                    blockCountEx && <div className="text-danger border-bottom">
                        <FontAwesomeIcon icon={faExclamation} className="mr-2" />
                        You've used more than {props.maxUsedBlocks} blocks.
                        <span className="float-right">(-{blockCountDe} points)</span>
                    </div>
                }

                <div>You've moved {props.movedTime} times.</div>
                {
                    movedTimesEx && <div className="text-danger border-bottom">
                        <FontAwesomeIcon icon={faExclamation} className="mr-2" />
                        You've moved more than {props.maxMoveTimes} times.
                        <span className="float-right">(-{movedTimesDe} points)</span>
                    </div>
                }

                {
                    missedObjEx && <div className="text-danger border-bottom">
                        <FontAwesomeIcon icon={faExclamation} className="mr-2" />
                        You've missed {props.missedObjects} collectables.
                        <span className="float-right">(-{missedObjDe} points)</span>
                    </div>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    props.handleClose();
                    if (props.problemID) {
                        dispatch(submitProgress(props.problemID, score));
                    }
                }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>
};
export default GameEndModal;