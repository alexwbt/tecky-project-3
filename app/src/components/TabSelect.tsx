import React, { memo } from "react";
import { Navbar, Nav } from "react-bootstrap";


interface ITabSelectProps {
    tabs: {
        name: string;
        active: boolean;
        callback: () => void;
    }[];
    buttons: {
        name: string;
        callback: () => void;
    }[];
    color: string;
    color2: string;
}

const TabSelect: React.FC<ITabSelectProps> = (props) => {
    return <Navbar bg={props.color} expand="md" className="py-0">
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-100">
                {props.tabs.map((tab, i) => <button
                    key={i}
                    className={`btn rounded-0 ${tab.active ? `btn-${props.color2}` : `btn-${props.color}`}`}
                    onClick={tab.callback}>
                    {tab.name}
                </button>)}
                {props.children}
                <div className="ml-auto">
                    {props.buttons.map((btn, i) => <button
                        key={i}
                        className={`btn btn-${props.color} rounded-0`}
                        onClick={btn.callback}>
                        {btn.name}
                    </button>)}
                </div>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
};
export default memo(TabSelect);
