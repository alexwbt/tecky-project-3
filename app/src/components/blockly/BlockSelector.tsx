import React from "react";
import { connect } from "react-redux";
import { blocklyBlocks, BlockList } from "./toolbox";
import { Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import "./BlockSelector.css";
import { IRootState, ReduxThunkDispatch } from "../../store";
import { toggleCategory, toggleBlock, toggleUseCategory, changed } from "../../actions/problemActions";


interface IBlockSelectorProps {
    height: number;
    avalibleBlocks: BlockList;
    avalibleCategories: string[];
    useCategory: boolean;
    toggleCategory: (category: string) => void;
    toggleBlock: (category: string, block: string) => void;
    toggleUseCategory: () => void;
}


class BlockSelector extends React.Component<IBlockSelectorProps> {

    render() {
        return <div className="p-3 border-left" style={{ overflow: "scroll", height: this.props.height }}>
            <h3>Block Selector</h3>
            <div className="checkbox">
                <label className="m-0 w-100 p-2">
                    <input
                        type="checkbox"
                        checked={this.props.useCategory}
                        onChange={this.props.toggleUseCategory}
                    />
                    <span className="cr">
                        <FontAwesomeIcon className="cr-icon text-info" icon={faCheck} />
                    </span>
                    <h6 className="pl-3 d-inline">Use Category</h6>
                </label>
            </div>
            <p>Select any block you want the player to be able to use.</p>
            {Object.keys(blocklyBlocks).map((cat, i) => {
                return <div key={i} className="checkbox">
                    <label className="m-0 w-100 p-2">
                        <input
                            type="checkbox"
                            checked={this.props.avalibleCategories.includes(cat)}
                            onChange={this.props.toggleCategory.bind(this, cat)}
                            aria-controls={"collapse-content" + i}
                        />
                        <span className="cr">
                            <FontAwesomeIcon className="cr-icon text-info" icon={faCheck} />
                        </span>
                        <h6 className="pl-3 d-inline">{cat}</h6>
                    </label>
                    <Collapse in={this.props.avalibleCategories.includes(cat)}>
                        <div id={"collapse-content" + i}>
                            {this.props.avalibleBlocks[cat] && blocklyBlocks[cat].map((block, ii) => <div key={ii} className="checkbox">
                                <label className="m-0 ml-3 w-100 p-2">
                                    <input
                                        type="checkbox"
                                        checked={this.props.avalibleBlocks[cat].includes(block)}
                                        onChange={this.props.toggleBlock.bind(this, cat, block)} />
                                    <span className="cr">
                                        <FontAwesomeIcon className="cr-icon text-info" icon={faCheck} />
                                    </span>
                                    <h6 className="pl-3 d-inline">{block}</h6>
                                </label>
                            </div>)}
                        </div>
                    </Collapse>
                </div>
            })}
        </div>
    }

}

const mapStateToProps = (state: IRootState) => ({
    avalibleBlocks: state.problem.avalibleBlocks,
    avalibleCategories: state.problem.avalibleCategories,
    useCategory: state.problem.useCategory
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    toggleCategory: (category: string) => {
        dispatch(toggleCategory(category));
        dispatch(changed());
    },
    toggleBlock: (category: string, block: string) => {
        dispatch(toggleBlock(category, block));
        dispatch(changed());
    },
    toggleUseCategory: () => {
        dispatch(toggleUseCategory());
        dispatch(changed());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockSelector);