import React from "react";
import "../css/ChallengeBox.css";
import DifficultyBox from "./DifficultyBox";
import { push } from "connected-react-router";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { IProblemBox } from "../containers/Home";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface IChallengeBoxProps extends IProblemBox { }

const ChallengeBox: React.FC<IChallengeBoxProps> = (props: IChallengeBoxProps) => {
    const dispatch = useDispatch();
    const rating = props.rating.rated > 0 ? props.rating.rating / props.rating.rated : 0;
    return <button
        title={props.title}
        className="w-100 h-100 shadow p-0 text-left"
        onClick={() => dispatch(push("/challenge/solve/" + props.id))}
        style={{ border: "5px solid black" }}>
        <img
            className="w-100 challenge-box"
            src={`${process.env.REACT_APP_CHALLENGE_IMAGE_LINK}/${props.id}.png`}
            onError={(event) => {
                event.currentTarget.src = "https://centralcoastdentalimplants.com/wp-content/uploads/2016/10/orionthemes-placeholder-image-750x750.jpg";
            }}
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
            <DifficultyBox difficultyID={props.difficulty_id} />
            <div className="d-inline-block text-right" style={{ position: "absolute", bottom: 5, right: 10 }}>
                <div>created by: {props.user}</div>
                <div>created: {props.created_at.substr(0, 10)}</div>
                <div>last edit: {props.updated_at.substr(0, 10)}</div>
            </div>
        </div>
    </button>
};
export default ChallengeBox;