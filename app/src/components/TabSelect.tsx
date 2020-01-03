import React, { memo } from "react";
import { Navbar, Nav } from "react-bootstrap";


interface ITabSelectProps {
    tabs: {
        name: string;
        active: boolean;
        callback: () => void;
    }[];
}

const TabSelect: React.FC<ITabSelectProps> = (props: ITabSelectProps) => {
    return <Navbar bg="info" expand="md" className="py-0">
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                {props.tabs.map((tab, i) => <button
                    key={i}
                    className={`btn rounded-0 ${tab.active ? "shadow btn-light" : "btn-info"}`}
                    onClick={tab.callback}>
                    {tab.name}
                </button>)}
            </Nav>
        </Navbar.Collapse>
    </Navbar>
};
export default memo(TabSelect);
