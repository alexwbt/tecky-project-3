import "blockly/javascript";
const Blockly = require("blockly/core");


// Blockly.Blocks['console_log'] = {
//     init: function () {
//         this.appendValueInput('VALUE').appendField('console.log');
//         this.setOutput(false);
//         this.setColour(160);
//         this.setNextStatement(true);
//         this.setPreviousStatement(true);
//     }
// };

// Blockly.JavaScript['console_log'] = function (block: any) {
//     const arg = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE);
//     return `console.log(${arg});\n`;
// };


// Blockly.Blocks['getPlayer'] = {
//     init: function () {
//         this.appendValueInput('VALUE')
//             .setCheck('Number')
//             .appendField("getPlayer");
//         this.setInputsInline(true);
//         this.setOutput(true, 'Player');
//         this.setColour(160);
//     }
// };

// Blockly.JavaScript['getPlayer'] = function (block: any) {
//     const arg = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
//     return [`this.getPlayer(${arg})`, Blockly.JavaScript.ORDER_MEMBER];
// };


Blockly.Blocks['movePlayer'] = {
    init: function () {
        this.appendValueInput('VALUE')
            .setCheck('Number')
            .appendField("Player");
        this.appendDummyInput()
            .appendField('Move')
            .appendField(new Blockly.FieldDropdown([
                ['up', 'UP'],
                ['down', 'DOWN'],
                ['left', 'LEFT'],
                ['right', 'RIGHT']
            ]), 'DIR');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
    }
};

Blockly.JavaScript['movePlayer'] = function (block: any) {
    const player = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
    const dir = block.getFieldValue('DIR');
    let dirNum = -1;
    switch (dir) {
        case "UP": dirNum = 2; break;
        case "DOWN": dirNum = 3; break;
        case "LEFT": dirNum = 0; break;
        case "RIGHT": dirNum = 1; break;
    }
    return `this.getPlayer(${player}).move(${dirNum});\n`;
};

Blockly.Blocks['isRoad'] = {
    init: function () {
        this.appendValueInput('VALUE')
            .setCheck('Number')
            .appendField("Player");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['up', 'UP'],
                ['down', 'DOWN'],
                ['left', 'LEFT'],
                ['right', 'RIGHT']
            ]), 'DIR')
            .appendField('is road');
        this.setOutput(true, 'Boolean');
        this.setColour(160);
    }
};

Blockly.JavaScript['isRoad'] = function (block: any) {
    const player = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_MEMBER);
    const dir = block.getFieldValue('DIR');
    let dirNum = -1;
    switch (dir) {
        case "UP": dirNum = 2; break;
        case "DOWN": dirNum = 3; break;
        case "LEFT": dirNum = 0; break;
        case "RIGHT": dirNum = 1; break;
    }
    return [`this.getContent().isRoad(this.getPlayer(${player}), ${dirNum})`, Blockly.JavaScript.ORDER_MEMBER];
};