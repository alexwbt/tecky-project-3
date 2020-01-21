import React from 'react';
import { ReduxThunkDispatch, IRootState } from "../store";
import { connect } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { hideMessageBox } from '../actions/messageBoxActions';

interface IMessageBoxProps {
    show: boolean;
    title: string;
    body: string;
    hideMessageBox: () => void;
}

class MessageBox extends React.Component<IMessageBoxProps, {}>{
    private handleClose = () => {
        this.props.hideMessageBox();
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{this.props.body}</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state: IRootState) => ({
    show: state.message.show,
    title: state.message.title,
    body: state.message.body,
})

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    hideMessageBox: () => dispatch(hideMessageBox()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)