import React from "react";
import { ReduxThunkDispatch, IRootState } from "./store";
import { connect } from "react-redux";
import { login } from "./auth/thunks";

interface ILoginProps {
    login: (username: string, password: string) => void;
    message: string;
}

interface ILoginStates {
    height: number;
    username: string;
    password: string;
}

class Login extends React.Component<ILoginProps, ILoginStates> {

    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            height: window.innerHeight,
            username: "",
            password: ""
        };
    }

    updateHeight() {
        this.setState({ ...this.state, height: window.innerHeight });
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight.bind(this));
    }

    inputChange(field: "username" | "password", event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ ...this.state, [field]: event.target.value });
    }

    submitLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.state.username && this.state.password) {
            this.props.login(this.state.username, this.state.password);
        }
    }

    render() {
        return (
            <div className="container-fluid bg-info">
                <div className="row align-items-center" style={{ height: this.state.height }}>
                    <div className="d-sm-block d-none col-6">
                        <div className="col-6 mx-auto">
                            <h1 className="text-white">TodoList</h1>
                        </div>
                    </div>
                    <div className="col-sm-6 col-12">
                        <div className="col-md-12 col-lg-8 p-3 mx-auto">
                            <form className="px-3 py-4 rounded shadow bg-light" onSubmit={this.submitLogin.bind(this)}>
                                <h3 className="pb-1 border-bottom">Login</h3>
                                <label htmlFor="usernameInput" className="input-group-prepend">
                                    <span className="">Username:</span>
                                </label>
                                <input
                                    id="usernameInput"
                                    className="form-control"
                                    name="username"
                                    placeholder="username"
                                    onChange={this.inputChange.bind(this, "username")}
                                    required />
                                <label htmlFor="passwordInput" className="input-group-prepend mt-1">
                                    <span className="">Password:</span>
                                </label>
                                <input
                                    type="password"
                                    id="passwordInput"
                                    className="form-control"
                                    name="password"
                                    placeholder="password"
                                    onChange={this.inputChange.bind(this, "password")}
                                    required />
                                <div className="text-danger pt-1">{this.props.message && this.props.message}</div>
                                <input type="submit" className="btn btn-primary py-1 mt-3" value="Login" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state: IRootState) => {
    return {
        message: state.auth.message
    };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        login: (username: string, password: string) => dispatch(login(username, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
