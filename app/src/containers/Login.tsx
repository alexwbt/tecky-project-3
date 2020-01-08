import React from "react";
import { ReduxThunkDispatch, IRootState } from "../store";
import { connect } from "react-redux";
import { login, register } from "../thunks/authThunks";

interface ILoginProps {
    message: string;
    error: boolean;
    login: (username: string, password: string) => void;
    register: (email: string, username: string, password: string, cpassword: string) => void;
}

interface ILoginStates {
    register: boolean;
    height: number;
    email: string;
    username: string;
    password: string;
    cpassword: string;
}

type FormInput = "email" | "username" | "password" | "cpassword";

class Login extends React.Component<ILoginProps, ILoginStates> {

    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            register: false,
            height: window.innerHeight,
            email: "",
            username: "",
            password: "",
            cpassword: ""
        };
    }

    private updateHeight = () => {
        this.setState({ ...this.state, height: window.innerHeight });
    };

    private toggleRegister = () => {
        this.setState({ ...this.state, register: !this.state.register });
    };

    private submitLoginForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.state.username && this.state.password) {
            this.props.login(this.state.username, this.state.password);
        }
    };

    private submitRegisterForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.state.email
            && this.state.username
            && this.state.password
            && this.state.cpassword === this.state.password) {
            this.props.register(
                this.state.email,
                this.state.username,
                this.state.password,
                this.state.cpassword
            );
        }
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        document.title = "BlockDojo - Login";
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
    }

    private inputChange(field: FormInput, event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ ...this.state, [field]: event.target.value });
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
            <div className={`pt-1 ${this.props.error ? "text-danger" : "text-success"}`}>
                {this.props.message && this.props.message}
            </div>
            <input
                type="submit"
                className="btn btn-info py-1 mt-3"
                value="Login" />
            <button
                className="btn btn-link text-info mt-3"
                onClick={this.toggleRegister}>
                Register
            </button>
        </>
    }

    renderRegisterForm() {
        return <>
            <label htmlFor="emailInput" className="input-group-prepend">
                <span className="">Email:</span>
            </label>
            <input
                type="email"
                id="emailInput"
                className="form-control"
                name="email"
                placeholder="example@email.com"
                value={this.state.email}
                onChange={this.inputChange.bind(this, "email")}
                required />
            <label htmlFor="emailInput" className="input-group-prepend mt-1">
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
            <div className={`pt-1 ${this.props.error ? "text-danger" : "text-success"}`}>
                {this.props.message && this.props.message}
            </div>
            <input
                type="submit"
                className="btn btn-info py-1 mt-3"
                value="Register" />
            <button
                className="btn btn-link text-info mt-3"
                onClick={this.toggleRegister}>
                Login
            </button>
        </>
    }

    render() {
        return <div className="container-fluid" style={{
            background: "linear-gradient(125deg, rgb(52, 58, 64), rgb(23, 162, 184))"
        }}>
            <div className="row align-items-center" style={{ height: this.state.height }}>
                <div className="col-12">
                    <div className="col-12 col-md-6 p-3 mx-auto" style={{ maxWidth: 500 }}>
                        <form
                            className="px-3 py-4 rounded shadow bg-light"
                            onSubmit={this.state.register ? this.submitRegisterForm : this.submitLoginForm}>
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
    message: state.auth.message,
    error: state.auth.error
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    login: (username: string, password: string) =>
        dispatch(login(username, password)),
    register: (email: string, username: string, password: string, cpassword: string) =>
        dispatch(register(email, username, password, cpassword))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
