import React from "react";
import NavBar from "../components/NavBar";
import { Form, Button } from 'react-bootstrap';


class AuditForm extends React.Component {


    render() {
        return <>
            <div>
                <NavBar />
                <div className="container" style={{marginTop:"30px",marginBottom:"30px",paddingLeft:"100px",paddingRight:"100px"}}>
                    <div className="auditForm">
                        <Form>
                            <h3>Audit the Challenge <Button type="button" variant="info">Challenge Page</Button></h3>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Title" />
                            </Form.Group>
                            <Form.Group controlId="formCoverImage">
                                <Form.Label>Cover Image</Form.Label>
                                <br />
                                <input type='file' id='multi' />
                            </Form.Group>
                            <Form.Group controlId="formDetails">
                                <Form.Label>Details</Form.Label>
                                <Form.Control type="text" placeholder="Details" />
                            </Form.Group>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control as="select">
                                    <option>Select</option>
                                    <option>Maze</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formDifficulty">
                                <Form.Label>Difficulty</Form.Label>
                                <Form.Control as="select">
                                    <option>Select</option>
                                    <option>Easy (Age: 6-8)</option>
                                    <option>Medium (Age: 9-12)</option>
                                    <option>Hard (Age: 13-15)</option>
                                    <option>Very Hard (Age: 16-18)</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formScore">
                                <Form.Label>Score</Form.Label>
                                <Form.Control type="text" placeholder="Between nim score and max score of the difficulty" />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="problemRequirement">
                        <div className="fullMarks">
                            <h3>Full Marks</h3>
                            <Form.Group controlId="formMaxUsedBlocks">
                                <Form.Label>Max Used Blocks</Form.Label>
                                <Form.Control type="number" placeholder="Number > 0" />
                            </Form.Group>
                            <Form.Group controlId="formMaxMoveTimes">
                                <Form.Label>Max Move Times</Form.Label>
                                <Form.Control type="number" placeholder="Number >= 0" />
                            </Form.Group>
                        </div>
                        <div className="deduction">
                            <h3>Deduction</h3>
                            <Form.Group controlId="formEachBlocksMoreThanMaxLose">
                                <Form.Label>Each blocks more than maximum lose</Form.Label>
                                <Form.Control type="number" placeholder="Number > 0" />
                            </Form.Group>
                            <Form.Group controlId="formMoveTimesMoreThanMaxLose">
                                <Form.Label>Move times more than maximum lose</Form.Label>
                                <Form.Control type="number" placeholder="Number >= 0" />
                            </Form.Group>
                            <Form.Group controlId="formEachCoinHaveNotGotLose">
                                <Form.Label>Each coin haven't got lose (For Coin)</Form.Label>
                                <Form.Control type="number" placeholder="Number > 0" />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select">
                                    <option>Select</option>
                                    <option>APPROVED</option>
                                    <option>REJECTED</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formRejectedReason">
                                <Form.Label>Rejected Reason</Form.Label>
                                <br />
                                <Form.Control as="textarea" rows="3" />
                            </Form.Group>
                            <Button type="submit" variant="info">Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}

export default AuditForm;