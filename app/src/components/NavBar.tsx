import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { history, IRootState } from "../store";
import { Navbar, Nav } from "react-bootstrap";
import { logout } from "../thunks/authThunks";
import { createProblem } from "../thunks/problemThunk";
import { push } from "connected-react-router";


interface INavbarProps {
    children?: React.ReactNode;
    content?: React.ReactNode;
}

const NavBar: React.FC<INavbarProps> = (props) => {
    const path = history.location.pathname;
    const dispatch = useDispatch();
    const username = localStorage.getItem("username");
<<<<<<< HEAD
    return <div id="navigation-bar">
=======
    const authenticated = useSelector((state: IRootState) => state.auth.authenticated);
    return <div id="navagation-bar">
>>>>>>> ee1d3c7ac36321785e6fce5e1f60f97a065c0519
        <Navbar bg="dark" expand="md" className="py-0">
            <Navbar.Brand className="text-white">
                Block<span className="text-info">Dojo</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link
                        to="/"
                        className={`btn btn-dark rounded-0 text-white ${path === "/" && "shadow"}`}
                        style={{ backgroundColor: path === "/" ? "rgb(25, 25, 30)" : "" }}>
                        Home
                    </Link>
                    <Link
                        to={`/profile/${username}`}
                        className={`btn btn-dark rounded-0 text-white ${path === `/profile/${username}` && "shadow"}`}
                        style={{ backgroundColor: path === `/profile/${username}` ? "rgb(25, 25, 30)" : "" }}>
                        Profile
                    </Link>
                    <Link
                        to="/leaderBoard"
                        className={`btn btn-dark rounded-0 text-white ${path === "/leaderBoard" && "shadow"}`}
                        style={{ backgroundColor: path === "/leaderBoard" ? "rgb(25, 25, 30)" : "" }}>
                        Leader Board
                    </Link>
                    <Link
                        to="/AuditForm"
                        className={`btn btn-dark rounded-0 text-white ${path === "/AuditForm" && "shadow"}`}
                        style={{ backgroundColor: path === "/AuditForm" ? "rgb(25, 25, 30)" : "" }}>
                        Audit Form
                    </Link>
                    <button
                        onClick={() => dispatch(createProblem())}
                        className={`btn btn-dark rounded-0 text-white`}>
                        Create Challenge
                    </button>
                </Nav>
                {props.content}
                <button
                    className="btn btn-dark rounded-0 text-white"
                    onClick={() => dispatch(authenticated ? logout() : push("/login"))}>
                    {authenticated ? "Logout" : "Login"}
                </button>
            </Navbar.Collapse>
        </Navbar>
        {props.children}
    </div>
};
export default memo(NavBar);
