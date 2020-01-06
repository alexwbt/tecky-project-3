import React from "react";
import { Block, Value, Shadow, Field } from "./BlocklyComponent";

export const blocklyBlocks = [
    // "console_log",
    // "testing",
    "Logic:controls_if",
    "Logic:logic_compare",
    "Logic:logic_operation",
    "Logic:logic_negate",
    "Logic:logic_boolean",
    "Logic:logic_null",
    "Logic:logic_ternary",
    "Loops:controls_repeat_ext",
    "Loops:controls_repeat",
    "Loops:controls_whileUntil",
    "Loops:controls_for",
    "Loops:controls_forEach",
    "Loops:controls_flow_statements",
    "Math:math_number",
    "Math:math_arithmetic",
    "Math:math_single",
    "Math:math_trig",
    "Math:math_constant",
    "Math:math_number_property",
    "Math:math_round",
    "Math:math_on_list",
    "Math:math_modulo",
    "Math:math_constrain",
    "Math:math_random_int",
    "Math:math_random_float",
    "Math:math_atan2",
    "Text:text",
    "Text:text_multiline",
    "Text:text_join",
    "Text:text_append",
    "Text:text_length",
    "Text:text_isEmpty",
    "Text:text_indexOf",
    "Text:text_charAt",
    "Text:text_getSubstring",
    "Text:text_changeCase",
    "Text:text_trim",
    "Text:text_count",
    "Text:text_replace",
    "Text:text_reverse",
    "Text:text_print",
    "Text:text_prompt_ext",
    "Lists:lists_create_with",
    "Lists:lists_create_with",
    "Lists:lists_repeat",
    "Lists:lists_length",
    "Lists:lists_isEmpty",
    "Lists:lists_indexOf",
    "Lists:lists_getIndex",
    "Lists:lists_setIndex",
    "Lists:lists_getSublist",
    "Lists:lists_split",
    "Lists:lists_sort",
    "Lists:lists_reverse",
    "Colour:colour_picker",
    "Colour:colour_random",
    "Colour:colour_rgb",
    "Colour:colour_blend"
];

export const blocklyCategories = [
    // "Custom",
    "Logic",
    "Loops",
    "Math",
    "Text",
    "Lists",
    "Colour",
    "Variables",
    "Functions"
];


export const getToolBox = (blocks?: number[]) => {
    let toolBox = new Map<string, string[]>();
    let blockList: string[] = [];

    for (let i = 0; i < (blocks ? blocks.length : blocklyBlocks.length); i++) {
        const block = blocks ? blocklyBlocks[blocks[i]] : blocklyBlocks[i];
        let data = block.split(":");
        if (!toolBox.has(data[0])) {
            toolBox.set(data[0], []);
        }
        toolBox.get(data[0])?.push(data[1]);
        blockList.push(data[1]);
    }

    return { toolBox, blockList };
};


export const getBlock = (block: string) => {
    switch (block) {
        case "controls_repeat_ext":
            return <Block type="controls_repeat_ext">
                <Value name="TIMES">
                    <Shadow type="math_number">
                        <Field name="NUM">10</Field>
                    </Shadow>
                </Value>
            </Block>;
        case "controls_for":
            return <Block type="controls_for">
                <Value name="FROM">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
                <Value name="TO">
                    <Shadow type="math_number">
                        <Field name="NUM">10</Field>
                    </Shadow>
                </Value>
                <Value name="BY">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_number":
            return <Block type="math_number" gap="32">
                <Field name="NUM">123</Field>
            </Block>
        case "math_arithmetic":
            return <Block type="math_arithmetic">
                <Value name="A">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
                <Value name="B">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_single":
            return <Block type="math_single">
                <Value name="NUM">
                    <Shadow type="math_number">
                        <Field name="NUM">9</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_trig":
            return <Block type="math_trig">
                <Value name="NUM">
                    <Shadow type="math_number">
                        <Field name="NUM">45</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_number_property":
            return <Block type="math_number_property">
                <Value name="NUMBER_TO_CHECK">
                    <Shadow type="math_number">
                        <Field name="NUM">0</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_round":
            return <Block type="math_round">
                <Value name="NUM">
                    <Shadow type="math_number">
                        <Field name="NUM">3.1</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_modulo":
            return <Block type="math_modulo">
                <Value name="DIVIDEND">
                    <Shadow type="math_number">
                        <Field name="NUM">64</Field>
                    </Shadow>
                </Value>
                <Value name="DIVISOR">
                    <Shadow type="math_number">
                        <Field name="NUM">10</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_constrain":
            return <Block type="math_constrain">
                <Value name="VALUE">
                    <Shadow type="math_number">
                        <Field name="NUM">50</Field>
                    </Shadow>
                </Value>
                <Value name="LOW">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
                <Value name="HIGH">
                    <Shadow type="math_number">
                        <Field name="NUM">100</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_random_int":
            return <Block type="math_random_int">
                <Value name="FROM">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
                <Value name="TO">
                    <Shadow type="math_number">
                        <Field name="NUM">100</Field>
                    </Shadow>
                </Value>
            </Block>
        case "math_atan2":
            return <Block type="math_atan2">
                <Value name="X">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
                <Value name="Y">
                    <Shadow type="math_number">
                        <Field name="NUM">1</Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_append":
            return <Block type="text_append">
                <Value name="TEXT">
                    <Shadow type="text"></Shadow>
                </Value>
            </Block>
        case "text_length":
            return <Block type="text_length">
                <Value name="VALUE">
                    <Shadow type="text">
                        <Field name="TEXT">abc</Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_isEmpty":
            return <Block type="text_isEmpty">
                <Value name="VALUE">
                    <Shadow type="text">
                        <Field name="TEXT"></Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_indexOf":
            return <Block type="text_indexOf">
                <Value name="VALUE">
                    <Block type="variables_get">
                        <Field name="VAR">text</Field>
                    </Block>
                </Value>
                <Value name="FIND">
                    <Shadow type="text">
                        <Field name="TEXT">abc</Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_charAt":
            return <Block type="text_charAt">
                <Value name="VALUE">
                    <Block type="variables_get">
                        <Field name="VAR">text</Field>
                    </Block>
                </Value>
            </Block>
        case "text_getSubstring":
            return <Block type="text_getSubstring">
                <Value name="STRING">
                    <Block type="variables_get">
                        <Field name="VAR">text</Field>
                    </Block>
                </Value>
            </Block>
        case "text_changeCase":
            return <Block type="text_changeCase">
                <Value name="TEXT">
                    <Shadow type="text">
                        <Field name="TEXT">abc</Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_trim":
            return <Block type="text_trim">
                <Value name="TEXT">
                    <Shadow type="text">
                        <Field name="TEXT">abc</Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_count":
            return <Block type="text_count">
                <Value name="SUB">
                    <Shadow type="text"></Shadow>
                </Value>
                <Value name="TEXT">
                    <Shadow type="text"></Shadow>
                </Value>
            </Block>
        case "text_replace":
            return <Block type="text_replace">
                <Value name="FROM">
                    <Shadow type="text"></Shadow>
                </Value>
                <Value name="TO">
                    <Shadow type="text"></Shadow>
                </Value>
                <Value name="TEXT">
                    <Shadow type="text"></Shadow>
                </Value>
            </Block>
        case "text_reverse":
            return <Block type="text_reverse">
                <Value name="TEXT">
                    <Shadow type="text"></Shadow>
                </Value>
            </Block>
        case "text_print":
            return <Block type="text_print">
                <Value name="TEXT">
                    <Shadow type="text">
                        <Field name="TEXT">abc</Field>
                    </Shadow>
                </Value>
            </Block>
        case "text_prompt_ext":
            return <Block type="text_prompt_ext">
                <Value name="TEXT">
                    <Shadow type="text">
                        <Field name="TEXT">abc</Field>
                    </Shadow>
                </Value>
            </Block>
        case "lists_repeat":
            return <Block type="lists_repeat">
                <Value name="NUM">
                    <Shadow type="math_number">
                        <Field name="NUM">5</Field>
                    </Shadow>
                </Value>
            </Block>
        case "lists_indexOf":
            return <Block type="lists_indexOf">
                <Value name="VALUE">
                    <Block type="variables_get">
                        <Field name="VAR">list</Field>
                    </Block>
                </Value>
            </Block>
        case "lists_getIndex":
            return <Block type="lists_getIndex">
                <Value name="VALUE">
                    <Block type="variables_get">
                        <Field name="VAR">list</Field>
                    </Block>
                </Value>
            </Block>
        case "lists_setIndex":
            return <Block type="lists_setIndex">
                <Value name="LIST">
                    <Block type="variables_get">
                        <Field name="VAR">list</Field>
                    </Block>
                </Value>
            </Block>
        case "lists_getSublist":
            return <Block type="lists_getSublist">
                <Value name="LIST">
                    <Block type="variables_get">
                        <Field name="VAR">list</Field>
                    </Block>
                </Value>
            </Block>
        case "lists_split":
            return <Block type="lists_split">
                <Value name="DELIM">
                    <Shadow type="text">
                        <Field name="TEXT">,</Field>
                    </Shadow>
                </Value>
            </Block>
        case "colour_rgb":
            return <Block type="colour_rgb">
                <Value name="RED">
                    <Shadow type="math_number">
                        <Field name="NUM">100</Field>
                    </Shadow>
                </Value>
                <Value name="GREEN">
                    <Shadow type="math_number">
                        <Field name="NUM">50</Field>
                    </Shadow>
                </Value>
                <Value name="BLUE">
                    <Shadow type="math_number">
                        <Field name="NUM">0</Field>
                    </Shadow>
                </Value>
            </Block>
        case "colour_blend":
            return <Block type="colour_blend">
                <Value name="COLOUR1">
                    <Shadow type="colour_picker">
                        <Field name="COLOUR">#ff0000</Field>
                    </Shadow>
                </Value>
                <Value name="COLOUR2">
                    <Shadow type="colour_picker">
                        <Field name="COLOUR">#3333ff</Field>
                    </Shadow>
                </Value>
                <Value name="RATIO">
                    <Shadow type="math_number">
                        <Field name="NUM">0.5</Field>
                    </Shadow>
                </Value>
            </Block>
        default:
            return <Block type={block}></Block>
    }
};