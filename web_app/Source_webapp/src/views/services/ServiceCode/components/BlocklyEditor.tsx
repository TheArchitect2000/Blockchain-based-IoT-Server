import { useEffect, useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import { javascriptGenerator } from 'blockly/javascript'
import { Xml } from 'blockly/core'
import Blockly from 'blockly'
import './style.scss'
import './customBlocks/custom_Blocks'
import { Button, Checkbox, Notification, toast } from '@/components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { apiEditService, apiGetServiceByServiceId } from '@/services/ServiceAPI'
import { useAppSelector } from '@/store'
import { Loading, SyntaxHighlighter } from '@/components/shared'
import { apiGetNodeDevices } from '@/services/DeviceApi'
import { ToolboxDefinition } from 'blockly/core/utils/toolbox'
// @ts-ignore
import { blocklyToolBox } from './customBlocks/custom_Blocks'

const validateBlocklyXml = (xmlString: string): boolean => {
    try {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

        // Check if there are parsing errors
        const parseError = xmlDoc.getElementsByTagName('parsererror')
        if (parseError.length > 0) {
            console.error('Error parsing XML:', parseError[0].textContent)
            return false
        }

        return true // XML is valid
    } catch (e) {
        console.error('Invalid Blockly XML:', e)
        return false
    }
}

type NodeDevices = {
    fileName: string
    title: string
    type: string
    url: string
    parameters: Array<string>
}

export default function BlocklyEditor() {
    const [showCode, setShowCode] = useState(false)
    const [xml, setXml] = useState<string>()
    const [code, setCode] = useState()
    const { serviceId } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [deviceTypes, setDeviceTypes] = useState<{}>({})
    const [devices, setDevices] = useState<Array<NodeDevices>>([])
    const [theToolBox, setTheToolBox] = useState<ToolboxDefinition>()
    const navigate = useNavigate()

    const { _id: userId } = useAppSelector((state) => state.auth.user)

    async function saveEditService() {
        setIsSaving(true)
        const res = (await apiEditService({
            ...data,
            blocklyJson: xml,
            code: code,
        })) as any
        setIsSaving(false)
        if (res?.data?.data?.success === false) {
            toast.push(
                <Notification
                    title={'Error while saving service'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            toast.push(
                <Notification title={'Service Saved'} type="success" />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const fetchData = async () => {
        try {
            const datas = (await apiGetServiceByServiceId(
                serviceId || ''
            )) as any

            const response = (await apiGetNodeDevices()) as any

            setDevices(response.data.data)

            fetchAndDefineBlocks(response.data.data)

            const result = datas?.data?.data

            if (result.userId != userId) {
                return navigate('/services')
            }

            if (result) {
                setData({
                    serviceId: serviceId,
                    serviceName: result.serviceName,
                    serviceType: result.serviceType,
                    description: result.description,
                    devices: 'MULTI_SENSOR_1',
                    serviceImage: result.serviceImage,
                    status: result.status,
                })

                if (result.blocklyJson) {
                    setXml(result.blocklyJson.toString().replace(/^"|"$/g, "'"))
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [serviceId])

    useEffect(() => {
        setTimeout(() => {
            const allFlyoutElements =
                document.querySelectorAll('.blocklyFlyout')
            const firstElement = allFlyoutElements[1] as any
            const allScrolloutElements = document.querySelectorAll(
                '.blocklyScrollbarVertical'
            )
            const secondElement = allScrolloutElements[2]

            function updateVisibility() {
                if (firstElement && secondElement) {
                    if (firstElement.style.display === 'none') {
                        secondElement.classList.add('hidden')
                    } else {
                        secondElement.classList.remove('hidden')
                    }
                }
            }

            // Initial check on component mount
            updateVisibility()

            const observer = new MutationObserver(updateVisibility)

            if (firstElement) {
                observer.observe(firstElement, {
                    attributes: true,
                    attributeFilter: ['style', 'class'],
                })
            }

            return () => {
                observer.disconnect()
            }
        }, 100)
    }, [loading])

    function workspaceDidChange(workspace: any) {
        const code = javascriptGenerator.workspaceToCode(workspace)
        setCode(code)
    }

    const handlePaste = async () => {
        try {
            const pastedXml = await navigator.clipboard.readText() // Get the clipboard content as text
            if (validateBlocklyXml(pastedXml)) {
                const parser = new DOMParser()
                const xmlDoc = parser.parseFromString(pastedXml, 'text/xml')
                const workspace = Blockly.getMainWorkspace() // Get the current workspace

                workspace.clear() // Clear the current workspace
                Xml.domToWorkspace(xmlDoc.documentElement, workspace) // Set the new XML to the workspace

                console.log('Valid XML, workspace updated')
            } else {
                console.log('Invalid XML')
            }
        } catch (err) {
            console.error('Failed to read clipboard contents:', err)
        }
    }

    async function fetchAndDefineBlocks(stateDevices: Array<NodeDevices>) {
        let localDeviceTypes: any = {}
        try {
            /* stateDevices.forEach((device: any) => {
                const blockType = `device_${device.type}`
                if (!device.title || !device.url) {
                    console.warn(
                        `Ignoring device with missing title or url:`,
                        device
                    )
                    return // Skip this device if title or url is missing
                }

                if (!Blockly.Blocks[blockType]) {
                    Blockly.Blocks[blockType] = {
                        init: function () {
                            this.appendDummyInput()
                                .appendField(
                                    new Blockly.FieldImage(
                                        device.url,
                                        30,
                                        30,
                                        '*'
                                    )
                                )
                                .appendField(
                                    new Blockly.FieldLabel(device.title),
                                    'DEVICE_TITLE'
                                )
                            this.setOutput(true, 'Device')
                            this.setColour(180)
                            this.setTooltip('')
                            this.setHelpUrl('')
                        },
                    }

                    javascriptGenerator.forBlock[blockType] = function (block) {
                        const deviceTitle = `"${device.title}"`
                        return [deviceTitle, javascriptGenerator.ORDER_ATOMIC]
                    }
                }
            }) */

            if (!Blockly.Blocks['listen_for_device_payload']) {
                Blockly.Blocks['listen_for_device_payload'] = {
                    init: function () {
                        // Create a dummy input to hold the fixed part of the text
                        this.appendDummyInput().appendField('Wait for device ') // Fixed text before input

                        // Add the value input for the device payload
                        this.appendValueInput('DEVICE_PAYLOAD').setCheck(
                            'DevicePayload'
                        ) // Accepts only 'DevicePayload' type

                        // Append the rest of the fixed text
                        this.appendDummyInput().appendField(' payload') // Fixed text after input

                        this.setColour(180)
                        this.setTooltip('Wait for a device payload')
                        this.setHelpUrl('')
                    },
                }

                javascriptGenerator.forBlock['listen_for_device_payload'] =
                    function (block: any) {
                        // Get the target block connected to the 'DEVICE_PAYLOAD' input
                        const devicePayloadBlock =
                            block.getInputTargetBlock('DEVICE_PAYLOAD')

                        // Initialize the selected parameter
                        let selectedParameter = ''

                        // Check if the target block is valid and get the desired field value
                        if (devicePayloadBlock) {
                            selectedParameter =
                                devicePayloadBlock.getFieldValue(
                                    'DEVICE_VAR'
                                ) || ''
                        }

                        // Generate the code using the retrieved parameter
                        const code = `waitForDevicePayload(${
                            selectedParameter ? `${selectedParameter}` : 'null'
                        })`

                        // Return the generated code as a string, ensuring it is a valid statement
                        return code // Changed this line to return a string instead of an array
                    }
            }

            /* const deviceBlocks = stateDevices
                .filter((device) => device.title && device.url)
                .map((device: NodeDevices) => ({
                    kind: 'block',
                    type: `device_${device.type}`,
                    fields: {
                        title: device.title,
                        url: device.url,
                    },
                })) */

            Blockly.Blocks['manage_device_variable'] = {
                init: function () {
                    this.appendDummyInput()
                        .appendField('Create Device')
                        .appendField(
                            new Blockly.FieldDropdown(
                                this.getDeviceOptions.bind(this),
                                this.handleDeviceSelection.bind(this)
                            ),
                            'DEVICE_VAR'
                        )
                        .appendField('With Type')
                        .appendField(
                            new Blockly.FieldDropdown(
                                stateDevices.map((device) => [
                                    device.type,
                                    device.type,
                                ])
                            ),
                            'DEVICE_TYPE'
                        )
                    this.setColour(180)
                    this.setTooltip(
                        'Manage devices: Create or select an existing device.'
                    )
                    this.setHelpUrl('')
                },

                getDeviceOptions: function () {
                    const workspace = this.workspace
                    const deviceOptions = workspace
                        .getVariablesOfType('Device')
                        .map((deviceVar: any) => [
                            deviceVar.name,
                            deviceVar.name,
                        ])
                    deviceOptions.push(['Create Device...', 'CREATE_NEW'])
                    return deviceOptions
                },

                handleDeviceSelection: function (newValue: any) {
                    if (newValue === 'CREATE_NEW') {
                        const deviceName = prompt('Enter new device name:')
                        if (deviceName) {
                            const rightName = deviceName
                                .replace(/[^a-zA-Z0-9_]/g, '')
                                .replace(/^[0-9]+/, '')
                            // Add the new device name as a variable of type 'Device'
                            this.workspace.createVariable(
                                `device_${rightName}`,
                                'Device'
                            )
                            // Refresh the dropdown to show the newly added device
                            this.getField('DEVICE_VAR').setValue(
                                `device_${rightName}`
                            )
                        }
                    }
                },
            }

            javascriptGenerator.forBlock['manage_device_variable'] = function (
                block: any
            ) {
                const deviceType = block.getFieldValue('DEVICE_TYPE')
                const variableName = block.getFieldValue('DEVICE_VAR') || ''
                if (variableName) {
                    setTimeout(
                        // Delay the update to avoid immediate re-render loop
                        () => {
                            setDeviceTypes((prevDeviceTypes) => ({
                                ...prevDeviceTypes,
                                [variableName]: deviceType,
                            }))
                            localDeviceTypes[variableName] = deviceType
                        },

                        0
                    )

                    return `let ${variableName}; // Type Is: ${deviceType}\n`
                } else {
                    console.warn('Device variable name is missing.')
                    return ''
                }
            }

            Blockly.Blocks['manage_device_data'] = {
                init: function () {
                    this.appendValueInput('DEVICE_INPUT')
                        .appendField('Get')
                        .appendField(
                            new Blockly.FieldDropdown(
                                this.getDeviceOptions.bind(this)
                            ),
                            'DEVICE_VAR'
                        )
                        .appendField('Data')
                        .appendField(
                            new Blockly.FieldDropdown(
                                this.getDropdownOptions.bind(this)
                            ),
                            'DEVICE_DATA'
                        )
                    this.setOutput(true)
                    this.setColour(180)
                    this.setTooltip(
                        'Manage devices: Create or select an existing device.'
                    )
                    this.setHelpUrl('')
                },

                getDeviceOptions: function () {
                    const workspace = this.workspace
                    const deviceOptions = workspace
                        .getVariablesOfType('Device')
                        .map((deviceVar: any) => [
                            deviceVar.name,
                            deviceVar.name,
                        ])
                    deviceOptions.push(['Device Not Selected', ''])
                    return deviceOptions
                },

                getDropdownOptions: function () {
                    const deviceInput = this.getFieldValue('DEVICE_VAR')
                    if (deviceInput === '') {
                        // If "Device Not Selected" is chosen, return "Device Not Selected" for the data dropdown as well.
                        return [['Device Not Selected', '']]
                    }

                    const device = stateDevices.find(
                        (dev) => dev.type === localDeviceTypes[deviceInput]
                    )

                    return device && device.parameters
                        ? device.parameters.map((param) => [param, param])
                        : [['No Parameters', '']]
                },
            }

            javascriptGenerator.forBlock['manage_device_data'] = function (
                block: any
            ) {
                const deviceName = block.getFieldValue('DEVICE_VAR')
                const deviceParam = block.getFieldValue('DEVICE_DATA') || ''
                let code = ''
                if (deviceParam && deviceName) {
                    code = `${deviceName}.${String(deviceParam).toUpperCase()}`
                } else {
                    console.warn('Device variable name is missing.')
                    code = ''
                }
                return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
            }

            Blockly.Blocks['device_payload'] = {
                init: function () {
                    this.appendValueInput('DEVICE_INPUT').appendField(
                        new Blockly.FieldDropdown(
                            this.getDeviceOptions.bind(this)
                        ),
                        'DEVICE_VAR'
                    )

                    this.setOutput(true, 'DevicePayload')
                    this.setColour(180)
                    this.setTooltip(
                        'Manage devices: Create or select an existing device.'
                    )
                    this.setHelpUrl('')
                },

                getDeviceOptions: function () {
                    const workspace = this.workspace
                    const deviceOptions = workspace
                        .getVariablesOfType('Device')
                        .map((deviceVar: any) => [
                            deviceVar.name,
                            deviceVar.name,
                        ])
                    deviceOptions.push(['Device Not Selected', ''])
                    return deviceOptions
                },
            }

            javascriptGenerator.forBlock['device_payload'] = function (
                block: any
            ) {
                const deviceName = block.getFieldValue('DEVICE_VAR')

                let code = ''
                if (deviceName) {
                    code = `${deviceName}`
                } else {
                    console.warn('Device variable name is missing.')
                    code = ''
                }
                return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
            }

            const dynamicToolbox = {
                kind: blocklyToolBox.kind,
                contents: [
                    ...blocklyToolBox.contents,
                    {
                        kind: 'category',
                        name: 'Server Devices',
                        colour: '180',
                        contents: [
                            //...deviceBlocks,
                            { kind: 'block', type: 'manage_device_variable' },
                            { kind: 'block', type: 'manage_device_data' },
                            { kind: 'block', type: 'device_payload' },
                        ],
                    },
                ],
            }

            setTheToolBox(dynamicToolbox)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching devices:', error)
        }
    }

    return (
        <>
            <h3>{JSON.stringify(deviceTypes)}</h3>
            {loading == true && (
                <div className="w-full !h-[78vh] flex items-center justify-center">
                    {' '}
                    <Loading loading={true} />
                </div>
            )}
            {!loading && (
                <div className="grid grid-cols-3">
                    {devices.length > 0 && (
                        <BlocklyWorkspace
                            className={`h-[78vh] ${
                                (showCode == true && 'col-span-2') ||
                                'col-span-3'
                            }`}
                            toolboxConfiguration={theToolBox} // this must be a JSON toolbox definition
                            initialXml={xml}
                            onXmlChange={setXml as any}
                            workspaceConfiguration={{
                                grid: {
                                    spacing: 20,
                                    length: 3,
                                    colour: '#ccc',
                                    snap: true,
                                },
                                trashcan: true,
                                media: `${import.meta.env.VITE_URL}uploads/`,
                            }}
                            onWorkspaceChange={workspaceDidChange}
                        />
                    )}
                    {showCode && (
                        <SyntaxHighlighter
                            className="!h-full !max-h-[78vh] !h-[78vh] !m-0"
                            language="javascript"
                        >
                            {code || ''}
                        </SyntaxHighlighter>
                    )}
                    <div className="flex mt-5 gap-x-5 col-span-full items-center justify-center">
                        <div className="flex items-center">
                            <Checkbox
                                id={'show-code'}
                                onChange={(value) => setShowCode(value)}
                                name={'show-code'}
                                checked={showCode}
                            />
                            <label htmlFor="show-code">Show Code</label>
                        </div>
                        <Button
                            onClick={handlePaste}
                            loading={isSaving}
                            variant="default"
                        >
                            Paste XML from Clipboard
                        </Button>
                        <Button
                            onClick={saveEditService}
                            loading={isSaving}
                            style={{ backgroundColor: '#5200aa' }}
                        >
                            {isSaving ? 'Saving' : 'Save'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
