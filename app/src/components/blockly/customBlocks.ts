import "blockly/javascript";
const Blockly = require("blockly/core");


Blockly.Blocks['console_log'] = {
    init: function () {
        this.appendValueInput('VALUE').appendField('console.log');
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


Blockly.Blocks['getPlayer'] = {
    init: function () {
        this.appendValueInput('VALUE')
            .setCheck('Number')
            .appendField("getPlayer");
        this.setOutput(true, 'Player');
        this.setColour(160);
    }
};

Blockly.JavaScript['getPlayer'] = function (block: any) {
    const arg = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
    return [`this.getPlayer(${arg})`, Blockly.JavaScript.ORDER_MEMBER];
};


Blockly.Blocks['movePlayer'] = {
    init: function () {
        this.appendValueInput('VALUE')
            .setCheck('Player')
            .appendField("movePlayer");
        this.appendValueInput('DIR')
            .setCheck('Number')
            .appendField("toDir");
        this.setOutput(false);
        this.setColour(160);
    }
};

Blockly.JavaScript['movePlayer'] = function (block: any) {
    const player = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
    const dir = Blockly.JavaScript.valueToCode(block, 'DIR', Blockly.JavaScript.ORDER_MEMBER);
    return `${player}.move(${dir})`;
};