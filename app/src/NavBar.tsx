import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { history } from "./store";
import { Navbar, Nav } from "react-bootstrap";
import { logout } from "./auth/thunks";


const NavBar: React.FC<{}> = () => {
    const path = history.location.pathname;
    const dispatch = useDispatch();
    return <Navbar bg="dark" expand="md" className="py-0">
        <Navbar.Brand className="text-white">
            Leet<span className="text-info">Block</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link
                    to="/"
                    className={`btn btn-dark rounded-0 text-white ${path === "/" && "shadow"}`}
                    style={{backgroundColor: path === "/" ? "rgb(25, 25, 30)" : ""}}>
                    Home
                </Link>
                <Link
                    to="/profile"
                    className={`btn btn-dark rounded-0 text-white ${path === "/profile" && "shadow"}`}
                    style={{backgroundColor: path === "/profile" ? "rgb(25, 25, 30)" : ""}}>
                    Profile
                </Link>
                <Link
                    to="/leaderBoard"
                    className={`btn btn-dark rounded-0 text-white ${path === "/leaderBoard" && "shadow"}`}
                    style={{backgroundColor: path === "/leaderBoard" ? "rgb(25, 25, 30)" : ""}}>
                    Leader Board
                </Link>
            </Nav>
            <button className="btn btn-dark rounded-0 text-white" onClick={() => dispatch(logout())}>logout</button>
        </Navbar.Collapse>
    </Navbar>
};
export default NavBar;
