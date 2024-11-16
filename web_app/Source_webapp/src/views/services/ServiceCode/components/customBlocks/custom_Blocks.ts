import * as Blockly from 'blockly/core'
import 'blockly/javascript'
import { javascriptGenerator } from 'blockly/javascript'

export const blocklyToolBox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Control',
            colour: '120', // 0 < Color < 360
            contents: [
                {
                    kind: 'block',
                    type: 'controls_if',
                },
                {
                    kind: 'block',
                    type: 'run_function_with_payload',
                },
                {
                    kind: 'block',
                    type: 'controls_ifelse',
                },
                {
                    kind: 'block',
                    type: 'controls_whileUntil',
                },
                {
                    kind: 'block',
                    type: 'controls_repeat_ext',
                    inputs: {
                        TIMES: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: 10,
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'controls_for',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Logic',
            colour: '210',
            contents: [
                {
                    kind: 'block',
                    type: 'check_device_payload',
                },
                {
                    kind: 'block',
                    type: 'logic_compare',
                },
                {
                    kind: 'block',
                    type: 'logic_operation',
                },
                {
                    kind: 'block',
                    type: 'logic_boolean',
                },
                {
                    kind: 'block',
                    type: 'logic_negate',
                },
                {
                    kind: 'block',
                    type: 'logic_null',
                },
                {
                    kind: 'block',
                    type: 'logic_ternary',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Variables',
            colour: '10',
            custom: 'VARIABLE',
        },
        {
            kind: 'category',
            name: 'Text',
            colour: '40',
            contents: [
                {
                    kind: 'block',
                    type: 'custom_text',
                },
                {
                    kind: 'block',
                    type: 'text_print',
                },
                {
                    kind: 'block',
                    type: 'to_string',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Math',
            colour: '300',
            contents: [
                {
                    kind: 'block',
                    type: 'math_number',
                    fields: {
                        NUM: 123,
                    },
                },
                {
                    kind: 'block',
                    type: 'math_arithmetic',
                },
                {
                    kind: 'block',
                    type: 'math_single',
                },
                {
                    kind: 'block',
                    type: 'to_number',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Devices',
            colour: '180',
            contents: [
                {
                    kind: 'block',
                    type: 'customized_air_quality_sensor',
                },
                {
                    kind: 'block',
                    type: 'customized_noise_sensor',
                },
                {
                    kind: 'block',
                    type: 'customized_concrete_sensor_temperature_strength',
                },
                {
                    kind: 'block',
                    type: 'customized_gas_sensor',
                },
                {
                    kind: 'block',
                    type: 'customized_car_sensor',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Messages',
            colour: '250',
            contents: [
                {
                    kind: 'block',
                    type: 'customized_send_email',
                },
                {
                    kind: 'block',
                    type: 'customized_send_notification',
                },
            ],
        },
        {
            kind: 'category',
            name: 'Wait',
            colour: '450',
            contents: [
                //{ kind: 'block', type: 'listen_for_device_payload' },
                {
                    kind: 'block',
                    type: 'wait_sec',
                },
                {
                    kind: 'block',
                    type: 'wait_min',
                },
                {
                    kind: 'block',
                    type: 'wait_hour',
                },
                {
                    kind: 'block',
                    type: 'wait_day',
                },
            ],
        },
    ],
}

Blockly.Blocks['customized_multi_sensor_door'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_multi_sensor_door',
            message0: '%1 Multi Sensor %2 detects %3 is %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['multi sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['door', 'DOOR'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Multi Sensor's Door status.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_multi_sensor_motion'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_multi_sensor_motion',
            message0: '%1 Multi Sensor %2 detects %3 is %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['multi sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['motion', 'MOVEMENT'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Multi Sensor's Motion.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_multi_sensor_button'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_multi_sensor_button',
            message0: '%1 Multi Sensor %2 detects %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['multi sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['button', 'BUTTON'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Multi Sensor's Button.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_smart_button'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_smart_button',
            message0: '%1 Smart Button %2 detects button is %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['smart button 1', 'SMART_BUTTON_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['pressed', 'PRESSED'],

                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Smart Button's status.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_door_sensor'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_door_sensor',
            message0: '%1 Door Sensor %2 detects door is %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['door sensor 1', 'DOOR_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['opened', 'OPENED'],
                        ['closed', 'CLOSED'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Door Sensor's status.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_motion_detector'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_motion_detector',
            message0: '%1 Motion Detector %2 detects motion is %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['motion detector 1', 'MOTION_DETECTOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['detected', 'DETECTED'],
                        ['undetected', 'UNDETECTED'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Motion Detector's status.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_thermometer_hygrometer'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_thermometer_hygrometer',
            message0: '%1 Thermometer Hygrometer %2 detects %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        [
                            'thermometer hygrometer 1',
                            'THERMOMETER_HYGROMETER_1',
                        ],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['temperature', 'TEMPERATURE'],
                        ['humidity', 'HUMIDITY'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Thermometer Hygrometer's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

// Define custom blocks for Devices category
Blockly.Blocks['customized_device_info'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_device_info',
            message0: '%1 Multi Sensor %2 device %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['multi sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['name', 'NAME'],
                        ['mac', 'MAC'],
                        ['type', 'TYPE'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Multi Sensor's Device Datas.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_multi_sensor_temperature_humidity'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_multi_sensor_temperature_humidity',
            message0: '%1 Multi Sensor %2 last %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['multi sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['temperature', 'TEMPERATURE'],
                        ['humidity', 'HUMIDITY'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Multi Sensor's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_concrete_sensor_temperature_strength'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_concrete_sensor_temperature_strength',
            message0: '%1 Concrete Sensor %2 last %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['concrete sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['temperature', 'TEMPERATURE'],
                        ['strength', 'STRENGTH'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Concrete Sensor's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_air_quality_sensor'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_air_quality_sensor',
            message0: '%1 Air Quality Sensor %2 last %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['air quality sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [['aqi', 'AQI']],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Concrete Sensor's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_noise_sensor'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_noise_sensor',
            message0: '%1 Noise Sensor %2 last %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['Noise Sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [['noise meter', 'NOISE_METER']],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Concrete Sensor's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_gas_sensor'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_gas_sensor',
            message0: '%1 Gas Sensor %2 last %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['gas sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['ppm', 'PPM'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Concrete Sensor's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_car_sensor'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_gas_sensor',
            message0: '%1 Car Sensor %2 last %3 %4',
            args0: [
                {
                    type: 'field_image',
                    src: '/img/blockly/devices.jpg',
                    width: 15,
                    height: 15,
                    alt: '*',
                    flipRtl: false,
                },
                {
                    type: 'field_dropdown',
                    name: 'device',
                    options: [
                        ['car sensor 1', 'MULTI_SENSOR_1'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'field_dropdown',
                    name: 'sensor',
                    options: [
                        ['speed', 'SPEED'],
                        ['distance', 'DISTANCE'],
                        ['temperature', 'TEMPERATURE'],
                        ['remaining fuel', 'REMAINING_FUEL'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'inputs',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 300,
            tooltip: "Checks Concrete Sensor's Temperature or Humidity.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

// Define custom blocks for Messages category
Blockly.Blocks['customized_send_email'] = {
    init: function () {
        this.jsonInit({
            message0: '%3 Send email by subject: %1 and body: %2',
            args0: [
                {
                    type: 'input_value',
                    name: 'subject',
                },
                {
                    type: 'input_value',
                    name: 'body',
                },
                {
                    type: 'field_image',
                    src: '/img/blockly/email.jpg',
                    width: 20,
                    height: 20,
                    alt: 'Email',
                },
            ],
            inputsInline: true,
            colour: '#64a0d4',
            previousStatement: 'Action',
            nextStatement: 'Action',
            tooltip: 'Sends email.',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['customized_send_notification'] = {
    init: function () {
        this.jsonInit({
            message0: '%3 Send notification by title: %1 and message: %2',
            args0: [
                {
                    type: 'input_value',
                    name: 'title',
                },
                {
                    type: 'input_value',
                    name: 'message',
                },
                {
                    type: 'field_image',
                    src: '/img/blockly/notif.jpg',
                    width: 20,
                    height: 20,
                    alt: 'Notification',
                },
            ],
            inputsInline: true,
            colour: '#64a0d4',
            previousStatement: 'Action',
            nextStatement: 'Action',
            tooltip: 'Sends notification.',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

// Define custom blocks for Wait category
Blockly.Blocks['wait_sec'] = {
    init: function () {
        this.jsonInit({
            message0: 'Wait %1 seconds',
            args0: [
                {
                    type: 'field_number',
                    name: 'seconds',
                    value: 1,
                    min: 0,
                    precision: 1,
                },
            ],
            inputsInline: true,
            previousStatement: 'Action',
            nextStatement: 'Action',
            colour: 450,
            tooltip: 'Wait for a specified number of seconds.',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['wait_min'] = {
    init: function () {
        this.jsonInit({
            message0: 'Wait %1 minutes',
            args0: [
                {
                    type: 'field_number',
                    name: 'minutes',
                    value: 1,
                    min: 0,
                    precision: 1,
                },
            ],
            inputsInline: true,
            previousStatement: 'Action',
            nextStatement: 'Action',
            colour: 450,
            tooltip: 'Wait for a specified number of minutes.',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['wait_hour'] = {
    init: function () {
        this.jsonInit({
            message0: 'Wait %1 hours',
            args0: [
                {
                    type: 'field_number',
                    name: 'hours',
                    value: 1,
                    min: 0,
                    precision: 1,
                },
            ],
            inputsInline: true,
            previousStatement: 'Action',
            nextStatement: 'Action',
            colour: 450,
            tooltip: 'Wait for a specified number of hours.',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

Blockly.Blocks['wait_day'] = {
    init: function () {
        this.jsonInit({
            message0: 'Wait %1 days',
            args0: [
                {
                    type: 'field_number',
                    name: 'days',
                    value: 1,
                    min: 0,
                    precision: 1,
                },
            ],
            inputsInline: true,
            previousStatement: 'Action',
            nextStatement: 'Action',
            colour: 450,
            tooltip: 'Wait for a specified number of days.',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

const deviceBlocks = [
    'customized_multi_sensor_door',
    'customized_multi_sensor_motion',
    'customized_multi_sensor_button',
    'customized_smart_button',
    'customized_door_sensor',
    'customized_motion_detector',
    'customized_thermometer_hygrometer',
    'customized_device_info',
    'customized_multi_sensor_temperature_humidity',
    'customized_concrete_sensor_temperature_strength',
    'customized_air_quality_sensor',
    'customized_noise_sensor',
    'customized_gas_sensor',
    'customized_car_sensor',
]

deviceBlocks.forEach((blockName) => {
    javascriptGenerator.forBlock[blockName] = function (
        block: any,
        generator: any
    ) {
        const dropdownDevice = block.getFieldValue('device')
        const dropdownSensor = block.getFieldValue('sensor')
        var inputBlock = javascriptGenerator.valueToCode(
            block,
            'inputs',
            javascriptGenerator.ORDER_NONE
        )
        const code = `${dropdownDevice}.${dropdownSensor}${
            (inputBlock && ` + ${inputBlock}`) || ''
        }`
        return [code, generator.ORDER_NONE]
    }
})

// Generator for customized_send_notification
javascriptGenerator.forBlock['customized_send_notification'] = function (
    block: any,
    generator: any
) {
    var input_title =
        javascriptGenerator.valueToCode(
            block,
            'title',
            javascriptGenerator.ORDER_NONE
        ) || `""`
    var input_message =
        javascriptGenerator.valueToCode(
            block,
            'message',
            javascriptGenerator.ORDER_NONE
        ) || `""`
    return `customizedMessage.sendNotification({ title: ${input_title}, message: ${input_message} });\n`
}

javascriptGenerator['customized_send_email'] = function (block: any) {
    var input_subject =
        javascriptGenerator.valueToCode(
            block,
            'subject',
            javascriptGenerator.ORDER_NONE
        ) || `""`
    var input_body =
        javascriptGenerator.valueToCode(
            block,
            'body',
            javascriptGenerator.ORDER_NONE
        ) || `""`
    var code = `customizedMessage.sendMail({ subject: ${input_subject}, body: ${input_body} });\n`
    return code
}

// Text Block Definition
Blockly.Blocks['custom_text'] = {
    init: function () {
        this.appendValueInput('TEXT')
            .setCheck('String')
            .appendField(new Blockly.FieldTextInput('default'), 'TEXT')
        this.setOutput(true, 'String')
        this.setColour(160)
        this.setTooltip('')
        this.setHelpUrl('')
    },
}

javascriptGenerator['custom_text'] = function (block: any) {
    var code = "'" + block.getFieldValue('TEXT') + "'"
    var additionalText = javascriptGenerator.valueToCode(
        block,
        'TEXT',
        javascriptGenerator.ORDER_NONE
    )
    if (additionalText) {
        code += ' + ' + additionalText
    }
    return [code, javascriptGenerator.ORDER_NONE]
}

javascriptGenerator.forBlock['wait_sec'] = function (
    block: any,
    generator: any
) {
    var seconds = block.getFieldValue('seconds')
    return `await waitTill(${seconds * 1000}); // ${seconds} seconds \n`
}

javascriptGenerator.forBlock['wait_min'] = function (
    block: any,
    generator: any
) {
    var min = block.getFieldValue('minutes')
    return `await waitTill(${min * 60 * 1000}); // ${min} minutes \n`
}

javascriptGenerator.forBlock['wait_hour'] = function (
    block: any,
    generator: any
) {
    var hour = block.getFieldValue('hours')
    return `await waitTill(${hour * 60 * 60 * 1000}); // ${hour} hours \n`
}

javascriptGenerator.forBlock['wait_day'] = function (
    block: any,
    generator: any
) {
    var day = block.getFieldValue('days')
    return `await waitTill(${day * 24 * 60 * 60 * 1000}); // ${day} days \n`
}

Blockly.Blocks['to_string'] = {
    init: function () {
        this.appendValueInput('VALUE').setCheck(null).appendField('to string')
        this.setOutput(true, 'String')
        this.setColour(160)
        this.setTooltip('Converts the input value to a string.')
        this.setHelpUrl('')
    },
}

javascriptGenerator.forBlock['to_string'] = function (block: any) {
    var value =
        javascriptGenerator.valueToCode(
            block,
            'VALUE',
            javascriptGenerator.ORDER_NONE
        ) || '""'
    var code = 'String(' + value + ')'
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
}

Blockly.Blocks['to_number'] = {
    init: function () {
        this.appendValueInput('VALUE').setCheck(null).appendField('to number')
        this.setOutput(true, 'Number')
        this.setColour(230)
        this.setTooltip('Converts the input value to a number.')
        this.setHelpUrl('')
    },
}

javascriptGenerator.forBlock['to_number'] = function (block: any) {
    var value =
        javascriptGenerator.valueToCode(
            block,
            'VALUE',
            javascriptGenerator.ORDER_NONE
        ) || '0'
    var code = 'Number(' + value + ')'
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
}

Blockly.Blocks['door_options'] = {
    init: function () {
        this.jsonInit({
            type: 'door_options',
            message0: 'door %1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DROPDOWN',
                    options: [
                        ['open', 'open'],
                        ['close', 'close'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 350,
            tooltip: "Checks Multi Sensor's Door.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

javascriptGenerator.forBlock['door_options'] = function (block: any) {
    var dropdown_value = block.getFieldValue('DROPDOWN')
    var value =
        javascriptGenerator.valueToCode(
            block,
            'VALUE',
            javascriptGenerator.ORDER_NONE
        ) || ''
    var code = '"' + dropdown_value + '"' + (value ? ` + ${value}` : '')
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
}

Blockly.Blocks['movement_options'] = {
    init: function () {
        this.jsonInit({
            type: 'movement_options',
            message0: 'motion %1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DROPDOWN',
                    options: [
                        ['detected', 'detected'],
                        ['Scanning', 'scanning...'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 350,
            tooltip: "Checks Multi Sensor's Motion.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

javascriptGenerator.forBlock['movement_options'] = function (block: any) {
    var dropdown_value = block.getFieldValue('DROPDOWN')
    var value =
        javascriptGenerator.valueToCode(
            block,
            'VALUE',
            javascriptGenerator.ORDER_NONE
        ) || ''
    var code = '"' + dropdown_value + '"' + (value ? ` + ${value}` : '')
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
}

Blockly.Blocks['button_options'] = {
    init: function () {
        this.jsonInit({
            type: 'button_options',
            message0: 'button %1 %2',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'DROPDOWN',
                    options: [
                        ['pressed', 'pressed'],
                        ['not pressed', 'not pressed'],
                        // Add more options as needed
                    ],
                },
                {
                    type: 'input_value',
                    name: 'VALUE',
                },
            ],
            inputsInline: false,
            output: null,
            colour: 350,
            tooltip: "Checks Multi Sensor's Motion.",
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

javascriptGenerator.forBlock['button_options'] = function (block: any) {
    var dropdown_value = block.getFieldValue('DROPDOWN')
    var value =
        javascriptGenerator.valueToCode(
            block,
            'VALUE',
            javascriptGenerator.ORDER_NONE
        ) || ''
    var code = '"' + dropdown_value + '"' + (value ? ` + ${value}` : '')
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
}

Blockly.Blocks['run_function_with_payload'] = {
    init: function () {
        this.jsonInit({
            type: 'run_function_with_payload',
            message0: 'Run Function With Payload %1 %2',
            args0: [
                {
                    type: 'input_value',
                    name: 'DEVICE_PAYLOAD',
                    check: 'DevicePayload', // Ensures it only accepts 'DevicePayload' type blocks
                },
                {
                    type: 'input_statement',
                    name: 'FUNCTION_CONTENT', // Allows passing other blocks inside
                },
            ],
            inputsInline: false,
            colour: 290,
            tooltip: 'Runs a function with DevicePayload input',
            helpUrl: 'https://example.com', // Replace with your help URL
        })
    },
}

javascriptGenerator.forBlock['run_function_with_payload'] = function (
    block: any
) {
    // Fetch 'DEVICE_PAYLOAD' input, defaulting to empty string if not connected
    let devicePayload =
        javascriptGenerator.valueToCode(
            block,
            'DEVICE_PAYLOAD',
            javascriptGenerator.ORDER_ATOMIC
        ) || ''

    let editedDevicePayload = devicePayload.replace(/^\((.*)\)$/, '$1')

    editedDevicePayload =
        editedDevicePayload.charAt(0).toUpperCase() +
        editedDevicePayload.slice(1)

    // Fetch statements from 'FUNCTION_CONTENT', defaulting to empty string if not connected
    var statements =
        javascriptGenerator.statementToCode(block, 'FUNCTION_CONTENT') || ''

    // Generate JavaScript code for the block

    var code = `\nfunctions["runFunctionWithPayload${editedDevicePayload}"] = () => {// This function will run each time a payload is received from ${devicePayload} \n${statements}\n}`
    return code
}

Blockly.Blocks['check_device_payload'] = {
    init: function () {
        this.jsonInit({
            type: 'check_device_payload',
            message0: 'Check Device %1 Payload is Available',
            args0: [
                {
                    type: 'input_value',
                    name: 'DEVICE_PAYLOAD',
                    check: 'DevicePayload', // Restrict input to 'DevicePayload' type
                },
            ],
            output: 'Boolean', // Logic blocks return a Boolean output
            colour: 210, // Logical block color
            tooltip: 'Checks if the DevicePayload has any keys',
            helpUrl: '', // Add help URL if needed
        })
    },
}

javascriptGenerator.forBlock['check_device_payload'] = function (block: any) {
    const devicePayload =
        javascriptGenerator.valueToCode(
            block,
            'DEVICE_PAYLOAD',
            javascriptGenerator.ORDER_ATOMIC
        ) || '' // Default to empty object if input is missing

    const code = `Object.keys(lastData['${String(devicePayload)
        .replace('(', '')
        .replace(')', '')}'] || {}).length > 0`
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
}
