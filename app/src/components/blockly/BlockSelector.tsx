import React from "react";
import { connect } from "react-redux";
import { blocklyBlocks, BlockList } from "./toolbox";
import { Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import "./BlockSelector.css";
import { IRootState, ReduxThunkDispatch } from "../../store";
import { toggleCategory, toggleBlock, toggleUseCategory, changed, toggleUseVariables, toggleUseFunctions } from "../../actions/problemActions";


interface IBlockSelectorProps {
    height: number;
    avalibleBlocks: BlockList;
    avalibleCategories: string[];
    useCategory: boolean;
    useVariables: boolean;
    useFunctions: boolean;
    toggleCategory: (category: string) => void;
    toggleBlock: (category: string, block: string) => void;
    toggleUseCategory: () => void;
    toggleUseVariables: () => void;
    toggleUseFunctions: () => void;
}


class BlockSelector extends React.Component<IBlockSelectorProps> {

    render() {
        return <div className="p-3 border-left" style={{ overflow: "auto", height: this.props.height }}>
            <h3>Block Selector</h3>
            {
                [
                    { name: "Category", checked: this.props.useCategory, change: this.props.toggleUseCategory },
                    { name: "Varaiables", checked: this.props.useVariables, change: this.props.toggleUseVariables },
                    { name: "Functions", checked: this.props.useFunctions, change: this.props.toggleUseFunctions }
                ].map((e, i) => <div key={i} className="checkbox">
                    <label className="m-0 w-100 p-2">
                        <input type="checkbox" checked={e.checked} onChange={e.change} />
                        <span className="cr"><FontAwesomeIcon className="cr-icon text-info" icon={faCheck} /></span>
                        <h6 className="pl-3 d-inline">Use {e.name}</h6>
                    </label>
                </div>)
            }
            {
                ((this.props.useVariables || this.props.useFunctions) && !this.props.useCategory) && <div
                    className="text-danger" >
                    Category must be enabled to use Variables or Functions.
                </div>
            }
            <hr />
            <p>Select any block you want the player to be able to use.</p>
            {Object.keys(blocklyBlocks).map((cat, i) => {
                const useThisCat = !!this.props.avalibleCategories && this.props.avalibleCategories.includes(cat);
                const hasCat = !!this.props.avalibleBlocks && !!this.props.avalibleBlocks[cat];
                return <div key={i} className="checkbox">
                    <label className="m-0 w-100 p-2">
                        <input
                            type="checkbox"
                            checked={useThisCat}
                            onChange={this.props.toggleCategory.bind(this, cat)}
                            aria-controls={"collapse-content" + i} />
                        <span className="cr">
                            <FontAwesomeIcon className="cr-icon text-info" icon={faCheck} />
                        </span>
                        <h6 className="pl-3 d-inline">{cat}</h6>
                    </label>
                    <Collapse in={useThisCat}>
                        <div id={"collapse-content" + i}>
                            {hasCat && blocklyBlocks[cat].map((block, ii) => {
                                const useThisBlock = hasCat && this.props.avalibleBlocks[cat].includes(block);
                                return <div key={ii} className="checkbox">
                                    <label className="m-0 ml-3 w-100 p-2">
                                        <input
                                            type="checkbox"
                                            checked={useThisBlock}
                                            onChange={this.props.toggleBlock.bind(this, cat, block)} />
                                        <span className="cr">
                                            <FontAwesomeIcon className="cr-icon text-info" icon={faCheck} />
                                        </span>
                                        <h6 className="pl-3 d-inline">{block}</h6>
                                    </label>
                                </div>
                            })}
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
    useCategory: state.problem.useCategory,
    useVariables: state.problem.useVariables,
    useFunctions: state.problem.useFunctions
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
    },
    toggleUseVariables: () => {
        dispatch(toggleUseVariables());
        dispatch(changed());
    },
    toggleUseFunctions: () => {
        dispatch(toggleUseFunctions());
        dispatch(changed());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockSelector);