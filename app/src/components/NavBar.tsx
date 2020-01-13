import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { history } from "../store";
import { Navbar, Nav } from "react-bootstrap";
import { logout } from "../thunks/authThunks";
import { createProblem } from "../thunks/problemThunk";


interface INavbarProps {
    children?: React.ReactNode;
    content?: React.ReactNode;
}

const NavBar: React.FC<INavbarProps> = (props) => {
    const path = history.location.pathname;
    const dispatch = useDispatch();
    const username = localStorage.getItem("username");
    return <div id="navagation-bar">
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
                    <button
                        onClick={() => dispatch(createProblem())}
                        className={`btn btn-dark rounded-0 text-white`}>
                        Create Callenge
                    </button>
                </Nav>
                {props.content}
                <button
                    className="btn btn-dark rounded-0 text-white"
                    onClick={() => dispatch(logout())}>
                    logout
                </button>
            </Navbar.Collapse>
        </Navbar>
        {props.children}
    </div>
};
export default memo(NavBar);
