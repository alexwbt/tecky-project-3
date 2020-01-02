import React from "react";
import { ReduxThunkDispatch, IRootState } from "../store";
import { connect } from "react-redux";
import { login } from "../thunks/authThunks";

interface ILoginProps {
    login: (username: string, password: string) => void;
    message: string;
}

interface ILoginStates {
    register: boolean;
    height: number;
    username: string;
    password: string;
    cpassword: string;
}

class Login extends React.Component<ILoginProps, ILoginStates> {

    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            register: false,
            height: window.innerHeight,
            username: "",
            password: "",
            cpassword: ""
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

    inputChange(field: "username" | "password" | "cpassword", event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ ...this.state, [field]: event.target.value });
    }

    submitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.state.username && this.state.password) {
            this.props.login(this.state.username, this.state.password);
        }
    }

    toggleRegister() {
        this.setState({ ...this.state, register: !this.state.register });
    }

    renderLoginForm() {
        return <>
            <label htmlFor="usernameInput" className="input-group-prepend">
                <span className="">Username:</span>
            </label>
            <input
                id="usernameInput"
                className="form-control"
                name="username"
                placeholder="username"
                value={this.state.username}
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
                value={this.state.password}
                onChange={this.inputChange.bind(this, "password")}
                required />
            <div className="text-danger pt-1">{this.props.message && this.props.message}</div>
            <input type="submit" className="btn btn-info py-1 mt-3" value="Login" />
            <button className="btn btn-link text-info mt-3" onClick={this.toggleRegister.bind(this)}>Register</button>
        </>
    }

    renderRegisterForm() {
        return <>
            <label htmlFor="usernameInput" className="input-group-prepend">
                <span className="">Username:</span>
            </label>
            <input
                id="usernameInput"
                className="form-control"
                name="username"
                placeholder="username"
                value={this.state.username}
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
                value={this.state.password}
                onChange={this.inputChange.bind(this, "password")}
                required />
            <label htmlFor="cpasswordInput" className="input-group-prepend mt-1">
                <span className="">Confirm Password:</span>
            </label>
            <input
                type="password"
                id="cpasswordInput"
                className="form-control"
                name="cpassword"
                placeholder="confirm password"
                value={this.state.cpassword}
                onChange={this.inputChange.bind(this, "cpassword")}
                required />
            <div className="text-danger pt-1">{this.props.message && this.props.message}</div>
            <input type="submit" className="btn btn-info py-1 mt-3" value="Register" />
            <button className="btn btn-link text-info mt-3" onClick={this.toggleRegister.bind(this)}>Login</button>
        </>
    }

    render() {
        return <div className="container-fluid" style={{
            background: "linear-gradient(125deg, rgb(52, 58, 64), rgb(23, 162, 184))"
        }}>
            <div className="row align-items-center" style={{ height: this.state.height }}>
                <div className="col-12">
                    <div className="col-12 col-md-6 p-3 mx-auto" style={{ maxWidth: 500}}>
                        <form className="px-3 py-4 rounded shadow bg-light" onSubmit={this.submitForm.bind(this)}>
                            <h3 className="d-inline">{this.state.register ? "Register" : "Login"}</h3>
                            <span className="float-right">Block<span className="text-info">Dojo</span></span>
                            <hr className="mt-1" />
                            {this.state.register ? this.renderRegisterForm() : this.renderLoginForm()}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    message: state.auth.message
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    login: (username: string, password: string) => dispatch(login(username, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
