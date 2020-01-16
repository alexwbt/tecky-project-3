import React from 'react';
import { connect } from "react-redux";
import BlocklyComponent, { Category } from "./BlocklyComponent"
import 'blockly/blocks';
import "./customBlocks.ts";
import { getBlock, BlockList, blocklyBlocks } from './toolbox';
import { IRootState, ReduxThunkDispatch } from '../../store';
import { setCode, changed } from '../../actions/problemActions';


interface IBlocklyAreaProps {
    className: string;
    height: number;
    avalibleBlocks?: BlockList;
    avalibleCategories?: string[];
    useVariables: boolean;
    useFunctions: boolean;
    useCategory: boolean;
    code: string;
    saved: boolean;
    setCode: (code: string, count: number) => void;
    changed: () => void;
}

class BlocklyArea extends React.Component<IBlocklyAreaProps> {

    private component: React.RefObject<BlocklyComponent>;

    constructor(props: IBlocklyAreaProps) {
        super(props);
        this.component = React.createRef();
    }

    getCodeXml() {
        return this.component.current ? this.component.current.getXml() : "";
    }

    componentDidMount() {
        this.component.current?.workspace.addChangeListener(() => {
            this.props.changed();
            this.props.setCode(this.getCodeXml(),
                this.component.current?.workspace.getAllBlocks().filter((block: any) => !block.isShadow_).length);
        });
    }

    render() {
        return <BlocklyComponent
            changed={!this.props.saved}
            ref={this.component}
            initialXml={this.props.code}
            className={this.props.className}>
            {
                (this.props.avalibleCategories ? this.props.avalibleCategories : Object.keys(blocklyBlocks)).map((cat, i) => {
                    if (this.props.useCategory) {
                        return <Category name={cat} categorystyle={`${cat.toLowerCase()}_category`} key={i}>
                            {(this.props.avalibleBlocks ? this.props.avalibleBlocks : blocklyBlocks)[cat]
                                .map((block: string, i: number) => <React.Fragment key={i}>
                                    {getBlock(block)}
                                </React.Fragment>)}
                        </Category>
                    } else {
                        return (this.props.avalibleBlocks ? this.props.avalibleBlocks : blocklyBlocks)[cat]
                            .map((block: string, i: number) => <React.Fragment key={i}>
                                {getBlock(block)}
                            </React.Fragment>)
                    }
                })
            }
            {
                this.props.useVariables &&
                <Category name="Variables" categorystyle="variable_category" custom="VARIABLE"></Category>
            }
            {
                this.props.useFunctions &&
                <Category name="Functions" categorystyle="procedure_category" custom="PROCEDURE"></Category>
            }
        </BlocklyComponent>
    }
}

const mapStateToProps = (state: IRootState) => ({
    code: state.problem.code,
    saved: state.problem.saved
});

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    setCode: (code: string, count: number) => dispatch(setCode(code, count)),
    changed: () => dispatch(changed())
});

export default connect(mapStateToProps, mapDispatchToProps)(BlocklyArea);

