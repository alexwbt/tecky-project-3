import React from "react";
import NavBar from "../components/NavBar";
import { Form, Dropdown, Table } from "react-bootstrap";
import { toast } from "react-toastify";


interface IAuditListState {
    auditList: {
        title: string;
        username: string;
        diffName: string;
        cateName: string;
        statusName: string;
        created_at: string;
    }[];
}

class AuditList extends React.Component<{}, IAuditListState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            auditList: []
        };
    }

    componentDidMount() {
        this.getAuditList();
    }

    private getAuditList = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/audit`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await res.json();

            if (res.status === 200 && result.success) {
                this.setState({ auditList: result.list });
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    render() {
        return <>
            <div>
                <NavBar />
                <div className="container" style={{ height: "100vh" }}>
                    <div style={{ marginTop: "30px" }}>
                        <Form inline>
                            {/* Search Bar */}
                            <input
                                className="rounded-pill border p-2 pl-4 w-50 mx-3"
                                placeholder="search"
                            // value={this.state.search}
                            // onChange={this.searchOnChange}
                            />

                            {/* Difficulty dropdown list */}
                            <Dropdown>
                                <Dropdown.Toggle id="difficulty" variant="info" style={{ width: "130px", marginRight: "10px" }}>Difficulty</Dropdown.Toggle>
                                <Dropdown.Menu >
                                    <Dropdown.Item eventKey="1">Easy</Dropdown.Item>
                                    <Dropdown.Item eventKey="2">Medium</Dropdown.Item>
                                    <Dropdown.Item eventKey="3">Hard</Dropdown.Item>
                                    <Dropdown.Item eventKey="1">Very Hard</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Category dropdown list */}
                            <Dropdown>
                                <Dropdown.Toggle id="category" variant="info" style={{ width: "130px", justifyContent: "flex-end" }}>Category</Dropdown.Toggle>
                                <Dropdown.Menu >
                                    <Dropdown.Item eventKey="1">Maze</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form>
                    </div>

                    {/* audit list table */}
                    <div className="row text-center" style={{ marginTop: "25px" }}>
                        <Table bordered hover style={{ backgroundColor: "white", borderRadius: "10px", width: "100%", marginLeft: "15px", marginRight: "15px" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Challenge</th>
                                    <th>Create user</th>
                                    <th>Difficulty</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Submit Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.auditList.map((audit, i) => <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{audit.title}</td>
                                        <td>{audit.username}</td>
                                        <td>{audit.diffName}</td>
                                        <td>{audit.cateName}</td>
                                        <td>{audit.statusName}</td>
                                        <td>{audit.created_at.substr(0, 10)}</td>
                                    </tr>)
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    }
}
export default AuditList;