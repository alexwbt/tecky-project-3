import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { rateProblem } from "../thunks/problemThunk";


interface IProblemRaterProps {
    problemID: number;
}

const ProblemRater: React.FC<IProblemRaterProps> = (props: IProblemRaterProps) => {
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();

    return <div className="p-2">
        Rate This Challenge:
        <h4>
            {
                [0, 1, 2, 3, 4].map(i => <button
                    key={i}
                    className={(i < rating ? "text-warning" : "text-muted") + " btn p-1"}
                    onClick={(event) => {
                        dispatch(rateProblem(props.problemID, i + 1));
                        setRating(i + 1);
                    }}>
                    <FontAwesomeIcon icon={faStar} />
                </button>)
            }
        </h4>
    </div>
};
export default ProblemRater;