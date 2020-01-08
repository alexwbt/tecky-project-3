import React from 'react';
import BlocklyComponent, { Category } from "./BlocklyComponent"
import 'blockly/blocks';
import "./customBlocks.ts";
import { getBlock, BlockList, blocklyBlocks } from './toolbox';


interface IBlocklyAreaProps {
    className: string;
    height: number;
    avalibleBlocks?: BlockList;
    avalibleCategories?: string[];
    useVariables: boolean;
    useFunctions: boolean;
    useCategory: boolean;
}

export default class BlocklyArea extends React.Component<IBlocklyAreaProps> {

    private simpleWorkspace: BlocklyComponent | null = null;

    get workspace() {
        return this.simpleWorkspace ? this.simpleWorkspace.workspace : null;
    }

    render() {
        return <BlocklyComponent
            ref={e => this.simpleWorkspace = e}
            initialXml={``}
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


