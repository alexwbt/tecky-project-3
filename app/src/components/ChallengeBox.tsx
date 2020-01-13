import React from "react";

import "../css/ChallengeBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import DifficultyBox from "./DifficultyBox";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";


interface IChallengeBoxProps {
    problemID: number;
    title: string;
    difficultyID: number;
    rating: number;
}

const ChallengeBox: React.FC<IChallengeBoxProps> = (props: IChallengeBoxProps) => {
    const dispatch = useDispatch();
    return <button
        title={props.title}
        className="w-100 h-100 shadow p-0 text-left"
        onClick={() => dispatch(push("/challenge/solve/" + props.problemID))}
        style={{ border: "5px solid black" }}>
        <img
            className="w-100 challenge-box"
            src="https://cdn.shopify.com/s/files/1/0150/0643/3380/files/patrick.png?7948"
            alt="problem-icon" />
        <div className="challenge-box-des">
            <h5 style={{ overflow: "hidden" }}>{props.title}</h5>
            <div>
                {[0, 1, 2, 3, 4].map(i => <FontAwesomeIcon
                    key={i}
                    className={(i < props.rating ? "text-warning" : "text-white") + " pr-1 h4"}
                    icon={faStar} />)}
            </div>
            <DifficultyBox difficultyID={props.difficultyID}/>
        </div>
    </button>
};
export default ChallengeBox;