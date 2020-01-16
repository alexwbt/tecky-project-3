import React from 'react';

const Blockly = require('blockly/core');
const locale = require('blockly/msg/en');

Blockly.setLocale(locale);

interface IBlocklyProps {
    className: string;
    initialXml: string;
    changed: boolean;
}

export default class BlocklyComponent extends React.Component<IBlocklyProps> {

    private primaryWorkspace: any;
    private blocklyDiv: React.RefObject<HTMLDivElement>;
    private toolbox: React.RefObject<HTMLDivElement>;

    constructor(props: IBlocklyProps) {
        super(props);
        this.blocklyDiv = React.createRef();
        this.toolbox = React.createRef();
    }

    componentDidMount() {
        const { initialXml, children, ...rest } = this.props;
        this.primaryWorkspace = Blockly.inject(this.blocklyDiv.current, {
            toolbox: this.toolbox.current,
            ...rest
        });
        if (initialXml) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXml), this.primaryWorkspace);
        }
    }

    componentDidUpdate() {
        if (!this.props.changed) {
            this.primaryWorkspace.updateToolbox(this.toolbox.current);
            if (this.props.initialXml) {
                this.primaryWorkspace.clear();
                Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(this.props.initialXml), this.primaryWorkspace);
            }
        }
        Blockly.svgResize(this.primaryWorkspace);
    }

    get workspace() {
        return this.primaryWorkspace;
    }

    setXml(xml: string) {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.primaryWorkspace);
    }

    getXml() {
        return Blockly.Xml.workspaceToDom(this.primaryWorkspace).outerHTML as string;
    }

    render() {
        return <>
            <div ref={this.blocklyDiv} className={this.props.className} />
            <div
                is="blockly"
                style={{ display: 'none' }}
                ref={this.toolbox}>
                {this.props.children}
            </div>
        </>;
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
