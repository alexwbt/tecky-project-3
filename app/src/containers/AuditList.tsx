import React from "react";
// import React, { ChangeEvent } from "react";
import NavBar from "../components/NavBar";
import { Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Dispatch } from 'redux';

interface IAuditListProps {
    open: (path: string) => void
}
interface IAuditListState {
    auditList: {
        problemID: number;
        title: string;
        username: string;
        diffName: string;
        cateName: string;
        statusName: string;
        created_at: string;
    }[];
    search: string;
}

class AuditList extends React.Component<IAuditListProps, IAuditListState> {

    constructor(props: IAuditListProps) {
        super(props);
        this.state = {
            auditList: [],
            search: ""
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

    private openEditor = (id: number) => {
        this.props.open(`/challenge/audit/${id}`)
    }

    render() {
        return <div className="d-flex flex-column vh-100">
            <NavBar />

            <div className="container-xl flex-grow-1" style={{ overflowY: "auto", overflowX: "hidden" }}>
                {/* Search Bar */}
                <input
                    className="rounded-pill border p-2 pl-4 w-100 mt-4"
                    placeholder="Search username..."
                    value={this.state.search}
                    onChange={(event) => this.setState({ search: event.target.value })}
                />
                {/* audit list table */}
                <div className="text-center">
                    <Table hover className="bg-light rounded-lg my-4">
                        <thead>
                            <tr>
                                <th className="border-0">Challenge</th>
                                <th className="border-0">Create user</th>
                                <th className="border-0">Difficulty</th>
                                <th className="border-0">Category</th>
                                <th className="border-0">Status</th>
                                <th className="border-0">Submit Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Array(100).fill(0).map(() => this.state.auditList && this.state.auditList.map(audit => {
                                    if (!this.state.search) {
                                        return { ...audit, score: 1 };
                                    }
                                    const title = audit.username.toLowerCase();
                                    const search = this.state.search.toLowerCase();
                                    let score = 0;
                                    for (let i = 0; i < title.length; i++) {
                                        if (search.includes(title[i])) {
                                            score++;
                                        }
                                    }
                                    return { ...audit, score };
                                }).sort((a, b) => b.score - a.score).filter(p => p.score > 0).map((audit, i) => <tr key={i} onClick={() => this.openEditor(audit.problemID)}>
                                    <td>{audit.title}</td>
                                    <td>{audit.username}</td>
                                    <td>{audit.diffName}</td>
                                    <td>{audit.cateName}</td>
                                    <td>{audit.statusName}</td>
                                    <td>{audit.created_at.substr(0, 10)}</td>
                                </tr>))
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    open: (path: string) => dispatch(push(path)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuditList);