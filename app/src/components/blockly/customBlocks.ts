import "blockly/javascript";
const Blockly = require("blockly/core");


Blockly.Blocks['console_log'] = {
    init: function () {
        this.appendValueInput('VALUE')
            .appendField('console.log');
        this.setOutput(false);
        this.setColour(160);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
    }
};

Blockly.JavaScript['console_log'] = function (block: any) {
    const arg = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE);
    return `console.log(${arg});\n`;
};


Blockly.Blocks['testing'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("testing");
        this.setOutput(false);
        this.setColour(160);
        this.setNextStatement(true);
        this.setPreviousStatement(true);
    }
};

Blockly.JavaScript['testing'] = function (block: any) {
    return `this.testing();\n`;
};
