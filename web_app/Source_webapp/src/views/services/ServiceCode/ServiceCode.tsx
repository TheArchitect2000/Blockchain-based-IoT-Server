import { useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import BlocklyEditor from './components/BlocklyEditor'

const toolboxCategories = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Logic',
            colour: '#5C81A6',
            contents: [
                {
                    kind: 'block',
                    type: 'controls_if',
                },
                {
                    kind: 'block',
                    type: 'logic_compare',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Math',
            colour: '#5CA65C',
            contents: [
                {
                    kind: 'block',
                    type: 'math_round',
                },
                {
                    kind: 'block',
                    type: 'math_number',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Custom',
            colour: '#5CA699',
            contents: [
                {
                    kind: 'block',
                    type: 'new_boundary_function',
                },
                {
                    kind: 'block',
                    type: 'return',
                },
            ],
        },
    ],
}

function ServiceCode() {
    return <BlocklyEditor />
}

export default ServiceCode
