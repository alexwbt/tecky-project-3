import React from "react";
import NavBar from "../components/NavBar";
import DifficultyBox from "../components/DifficultyBox";
import { Form, Button, FormControl, Dropdown, Table } from "react-bootstrap";

interface IChallengeBoxProps {
    difficultyID: number;
}


class AuditList extends React.Component <IChallengeBoxProps> {



    render() {
        return <>
            <div>
                <NavBar />
                {/* SearchBar, Buttons*/}
                <div className="container" style={{height:"100vh"}}>
                    <div style={{marginTop:"30px"}}>
                        <Form inline>
                            <FormControl type="Search" placeholder="Search" className="mr-sm-2" style={{width:"510px"}}/>
                            <Button variant="info" style={{width:"130px",marginRight:"10px"}} >Search</Button>
                            <Dropdown>
                                <Dropdown.Toggle id="difficulty" variant="info" style={{width:"130px",marginRight:"10px"}}>Difficulty</Dropdown.Toggle>
                                <Dropdown.Menu >
                                    <Dropdown.Item eventKey="1">Easy</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">Medium</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">Hard</Dropdown.Item>
                                    <Dropdown.Item eventKey="1">Very Hard</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown>
                                <Dropdown.Toggle id="category" variant="info" style={{width:"130px",justifyContent:"flex-end"}}>Category</Dropdown.Toggle>
                                <Dropdown.Menu >
                                    <Dropdown.Item eventKey="1">Maze</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form>
                    </div>

                    {/* audit list table */}
                    <div className="row text-center" style={{marginTop:"25px"}}>
                        <Table bordered hover style={{backgroundColor:"white",borderRadius:"10px",width:"100%",marginLeft:"15px",marginRight:"15px"}}>
                            <thead>
                                <tr>
                                    <th>Challenge</th>
                                    <th>Difficulty</th>
                                    <th>Category</th>
                                    <th>Submit Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td><DifficultyBox difficultyID={this.props.difficultyID}/></td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    }
}

export default AuditList;