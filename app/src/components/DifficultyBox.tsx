import React from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store";


interface IDifficultyBoxProps {
    difficultyID: number;
}

const bg = ["bg-success", "bg-info", "bg-warning", "bg-danger"]

const DifficultyBox: React.FC<IDifficultyBoxProps> = (props: IDifficultyBoxProps) => {
    const list = useSelector((state: IRootState) => state.difficulty.list);
    const diff = list.find(dif => dif.id === props.difficultyID);
    
    return <div className={"d-inline-block px-2 rounded-pill mt-2 h6 text-center text-monospace " + (diff ? bg[diff.id - 1] : "")}>
        {diff?.name}
    </div>
};
export default DifficultyBox;