import React from "react";
import { blocklyCategories } from "./toolbox";
import { Button, Collapse } from "react-bootstrap";


interface IBlockSelectorState {
    collapse: boolean[];
}

export default class BlockSelector extends React.Component<{}, IBlockSelectorState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            collapse: []
        };
    }

    private toggleCollapse(index: number) {
        const collapse = this.state.collapse.slice();
        collapse[index] = !collapse[index];
        this.setState({ collapse });
    }

    render() {
        return <div className="p-3 border-left">
            <h3>Block Selector</h3>
            <p>Select any block you want the player to be able to use.</p>
            {blocklyCategories.map((cat, i) => <div key={i}>
                <Button
                    variant="link"
                    onClick={this.toggleCollapse.bind(this, i)}
                    aria-controls="example-collapse-text"
                    aria-expanded={this.state.collapse[i]}>
                    {cat}
                </Button>
                <Collapse in={this.state.collapse[i]}>
                    <div id="example-collapse-text">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
                        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
                        labore wes anderson cred nesciunt sapiente ea proident.
                    </div>
                </Collapse>
            </div>)}
        </div>
    }

}
