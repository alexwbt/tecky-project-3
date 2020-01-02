import React from 'react';

const Blockly = require('blockly/core');
const locale = require('blockly/msg/en');

Blockly.setLocale(locale);

interface IBlocklyProps {
    className: string;
    initialXml: string;
}

export default class BlocklyComponent extends React.Component<IBlocklyProps> {

    private primaryWorkspace: any;
    private blocklyDiv: HTMLDivElement | null = null;
    private toolbox: HTMLDivElement | null = null;

    componentDidMount() {
        const { initialXml, children, ...rest } = this.props;
        this.primaryWorkspace = Blockly.inject(this.blocklyDiv, {
            toolbox: this.toolbox,
            ...rest
        });
        if (initialXml) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXml), this.primaryWorkspace);
        }
    }

    get workspace() {
        return this.primaryWorkspace;
    }

    setXml(xml: string) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.primaryWorkspace);
    }

    render() {
        const { children, className } = this.props;

        return <React.Fragment>
            <div ref={e => this.blocklyDiv = e} className={className} />
            <div
                is="blockly"
                style={{ display: 'none' }}
                ref={e => this.toolbox = e}>
                {children}
            </div>
        </React.Fragment>;
    }
}

export const Block = (p: any) => {
    const { children, ...props } = p;
    props.is = "blockly";
    return React.createElement("block", props, children);
};

export const Category = (p: any) => {
    const { children, ...props } = p;
    props.is = "blockly";
    return React.createElement("category", props, children);
};

export const Value = (p: any) => {
    const { children, ...props } = p;
    props.is = "blockly";
    return React.createElement("value", props, children);
};

export const Field = (p: any) => {
    const { children, ...props } = p;
    props.is = "blockly";
    return React.createElement("field", props, children);
};

export const Shadow = (p: any) => {
    const { children, ...props } = p;
    props.is = "blockly";
    return React.createElement("shadow", props, children);
};
