import React from "react";
import { getSpritePos, SIZE, GRASS, ROAD, WATER } from "./CanvasContent";


interface ITileSelectorProps {
    select: (tile: number) => void;
    tileSprite: HTMLImageElement | null;
}

class TileSelector extends React.Component<ITileSelectorProps> {

    private tiles = [
        { name: "Grass", tile: GRASS, i: 0 },
        { name: "Road", tile: ROAD, i: 1 },
        { name: "Water", tile: WATER, i: 13 }
    ];
    private canvasList: React.RefObject<HTMLCanvasElement>[] = [];

    constructor(props: ITileSelectorProps) {
        super(props);
        this.tiles.forEach(() => this.canvasList.push(React.createRef()));
    }

    componentDidMount() {
        this.canvasList.forEach((ref, i) => {
            if (ref.current) {
                const ctx = ref.current.getContext("2d");
                const ip = getSpritePos(this.tiles[i].i);
                if (ctx && this.props.tileSprite) {
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(this.props.tileSprite, ip.x, ip.y, SIZE, SIZE, 0, 0, ref.current.width, ref.current.height);
                }
            }
        });
    }

    render() {
        return <>
            {this.tiles.map((tile, i) => <button
                key={i}
                onClick={this.props.select.bind(null, tile.tile)}
                className="btn btn-light">
                <canvas ref={this.canvasList[i]} width={30} height={30}></canvas>
                <br></br>
                {tile.name}
            </button>)}
        </>
    }

}

export default TileSelector;
