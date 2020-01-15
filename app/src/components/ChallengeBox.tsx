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
    rating: {
        rating: number;
        rated: number;
    };
    created_at: string;
    updated_at: string;
}

const ChallengeBox: React.FC<IChallengeBoxProps> = (props: IChallengeBoxProps) => {
    const dispatch = useDispatch();
    const rating = props.rating.rated > 0 ? props.rating.rating / props.rating.rated : 0;
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
            <h4>
                {
                    [0, 1, 2, 3, 4].map(i => <FontAwesomeIcon
                        key={i}
                        className={(i < rating ? "text-warning" : "text-white") + " pr-1"}
                        icon={faStar} />)
                }
                ({props.rating.rated})
            </h4>
            <DifficultyBox difficultyID={props.difficultyID} />
            <div className="d-inline-block text-right" style={{position: "absolute", bottom: 5, right: 10}}>
                <div>created: {props.created_at.substr(0, 10)}</div>
                <div>last edit: {props.updated_at.substr(0, 10)}</div>
            </div>
        </div>
    </button>
};
export default ChallengeBox;