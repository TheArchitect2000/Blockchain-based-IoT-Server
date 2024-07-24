import * as Blockly from 'blockly/core'
import 'blockly/javascript'
import { javascriptGenerator } from 'blockly/javascript'

Blockly.Blocks['customized_multi_sensor_door'] = {
    init: function () {
        this.jsonInit({
            type: 'customized_multi_sensor_door',
            message0: '%1 Multi Sensor %2 detects door is %3',
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
                        ['opened', 'OPENED'],
                        ['closed', 'CLOSED'],
                        // Add more options as needed
                    ],
                },
            ],
            inputsInline: true,
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
            message0: '%1 Multi Sensor %2 detects motion is %3',
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
                        ['detected', 'DETECTED'],
                        ['undetected', 'UNDETECTED'],
                        // Add more options as needed
                    ],
                },
            ],
            inputsInline: true,
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
            message0: '%1 Multi Sensor %2 detects button is %3',
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
                        ['pressed', 'pressed'],
                        ['not_pressed', 'not pressed'],
                        // Add more options as needed
                    ],
                },
            ],
            inputsInline: true,
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
            message0: '%1 Smart Button %2 detects button is %3',
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
            ],
            inputsInline: true,
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
            message0: '%1 Door Sensor %2 detects door is %3',
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
            ],
            inputsInline: true,
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
            message0: '%1 Motion Detector %2 detects motion is %3',
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
            ],
            inputsInline: true,
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
            message0: '%1 Thermometer Hygrometer %2 detects %3',
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
            ],
            inputsInline: true,
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
            message0: '%1 Multi Sensor %2 device %3',
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
            ],
            inputsInline: true,
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
            message0: '%1 Multi Sensor %2 last %3',
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
            ],
            inputsInline: true,
            output: null,
            colour: 300,
            tooltip: "Checks Multi Sensor's Temperature or Humidity.",
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
                    type: 'field_input',
                    name: 'subject',
                },
                {
                    type: 'field_input',
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
                    type: 'field_input',
                    name: 'title',
                },
                {
                    type: 'field_input',
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

javascriptGenerator.forBlock['customized_multi_sensor_temperature_humidity'] =
    function (block, generator) {
        var dropdownDevice = block.getFieldValue('device')
        var dropdownSensor = block.getFieldValue('sensor')

        const code = `${dropdownDevice}.${dropdownSensor}`
        return [code, generator.ORDER_NONE]
    }

javascriptGenerator.forBlock['customized_multi_sensor_door'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

// Generator for customized_multi_sensor_motion
javascriptGenerator.forBlock['customized_multi_sensor_motion'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

// Generator for customized_multi_sensor_button
javascriptGenerator.forBlock['customized_multi_sensor_button'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.BUTTON == '${dropdownSensor}'`
    return [code, generator.ORDER_NONE]
}

// Generator for customized_thermometer_hygrometer
javascriptGenerator.forBlock['customized_thermometer_hygrometer'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

javascriptGenerator.forBlock['customized_device_info'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

javascriptGenerator.forBlock['customized_door_sensor'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

// Generator for customized_motion_detector
javascriptGenerator.forBlock['customized_motion_detector'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

// Generator for customized_smart_button
javascriptGenerator.forBlock['customized_smart_button'] = function (
    block,
    generator
) {
    const dropdownDevice = block.getFieldValue('device')
    const dropdownSensor = block.getFieldValue('sensor')

    const code = `${dropdownDevice}.${dropdownSensor}`
    return [code, generator.ORDER_NONE]
}

javascriptGenerator.forBlock['customized_send_email'] = function (
    block,
    generator
) {
    var input_subject = block.getFieldValue('subject')
    var input_body = block.getFieldValue('body')
    var emailJson = { subject: input_subject, body: input_body }
    var email = JSON.stringify(emailJson)
    return 'customizedMessage.sendMail(' + email + ');\n'
}

// Generator for customized_send_notification
javascriptGenerator.forBlock['customized_send_notification'] = function (
    block,
    generator
) {
    var input_title = block.getFieldValue('title')
    var input_message = block.getFieldValue('message')
    var notificationJson = { title: input_title, message: input_message }
    var notification = JSON.stringify(notificationJson)
    return 'customizedMessage.sendNotification(' + notification + ');'
}

javascriptGenerator.forBlock['wait_sec'] = function (block, generator) {
    var seconds = block.getFieldValue('seconds')
    return `await wait(${seconds * 1000});`
}

javascriptGenerator.forBlock['wait_min'] = function (block, generator) {
    var min = block.getFieldValue('minutes')
    return `await wait(${min * 60 * 1000});`
}

javascriptGenerator.forBlock['wait_hour'] = function (block, generator) {
    var hour = block.getFieldValue('hours')
    return `await wait(${hour * 60 * 60 * 1000});`
}

javascriptGenerator.forBlock['wait_day'] = function (block, generator) {
    var day = block.getFieldValue('days')
    return `await wait(${day * 24 * 60 * 60 * 1000});`
}

Blockly.Blocks['custom_while'] = {
    init: function () {
        this.appendValueInput('TIME')
            .setCheck('Number')
            .appendField('loop every')
        this.appendDummyInput('UNIT')
            .appendField(new Blockly.FieldDropdown([
                ['seconds', 'SECONDS'],
                ['minutes', 'MINUTES'],
                ['hours', 'HOURS'],
                ['days', 'DAYS']
            ]), 'TIME_UNIT')
        this.appendStatementInput('DO')
            .setCheck(null)
            .appendField('do')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(230)
        this.setTooltip('')
        this.setHelpUrl('')
    },
}


javascriptGenerator.forBlock['custom_while'] = function (block) {
    var value_time = javascriptGenerator.valueToCode(block, 'TIME', javascriptGenerator.ORDER_ATOMIC)
    var dropdown_time_unit = block.getFieldValue('TIME_UNIT')
    var statements_do = javascriptGenerator.statementToCode(block, 'DO')
    
    // Convert time to milliseconds based on selected unit
    var timeInMs;
    switch(dropdown_time_unit) {
        case 'SECONDS':
            timeInMs = value_time * 1000;
            break;
        case 'MINUTES':
            timeInMs = value_time * 1000 * 60;
            break;
        case 'HOURS':
            timeInMs = value_time * 1000 * 60 * 60;
            break;
        case 'DAYS':
            timeInMs = value_time * 1000 * 60 * 60 * 24;
            break;
        default:
            timeInMs = value_time * 1000; // default to seconds if no valid option is found
    }

    var code = 'theInterval = setInterval(() => {\n' + statements_do + '}, ' + timeInMs + ');\n'
    return code
}


