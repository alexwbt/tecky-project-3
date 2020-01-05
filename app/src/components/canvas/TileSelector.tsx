import React from "react";


interface ITileSelectorProps {
    select: (tile: number) => void
}

const TileSelector: React.FC<ITileSelectorProps> = (props: ITileSelectorProps) => {
    return <>
        {["Grass", "Road", "Water"].map((tile, i) => <button
            onClick={props.select.bind(null, i)}
            className="btn btn-light">
            {tile}
        </button>)}
    </>
};
export default TileSelector;
