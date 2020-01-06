import React from "react";
import { getSpritePos, SIZE } from "./CanvasContent";


interface IObjSelectorProps {
    select: (tile: number) => void;
    sprite: HTMLImageElement | null;
    objs: { name: string, value: number, index: number, active: boolean }[];
}

class ObjSelector extends React.Component<IObjSelectorProps> {

    private canvasList: React.RefObject<HTMLCanvasElement>[] = [];

    constructor(props: IObjSelectorProps) {
        super(props);
        this.props.objs.forEach(() => this.canvasList.push(React.createRef()));
    }

    componentDidMount() {
        this.canvasList.forEach((ref, i) => {
            if (ref.current) {
                const ctx = ref.current.getContext("2d");
                const ip = getSpritePos(this.props.objs[i].index);
                if (ctx && this.props.sprite) {
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(this.props.sprite, ip.x, ip.y, SIZE, SIZE, 0, 0, ref.current.width, ref.current.height);
                }
            }
        });
    }

    render() {
        return <>
            {this.props.objs.map((obj, i) => <button
                key={i}
                onClick={this.props.select.bind(null, obj.value)}
                className={`btn btn-light ${obj.active ? "border" : ""}`}>
                <canvas ref={this.canvasList[i]} width={30} height={30}></canvas>
                <br></br>
                {obj.name}
            </button>)}
        </>
    }

}

export default ObjSelector;
