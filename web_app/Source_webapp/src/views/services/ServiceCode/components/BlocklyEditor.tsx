import { useEffect, useRef, useState } from 'react'
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

export function defineBlocklyCustomBlocks(
    stateDevices: Array<NodeDevices>,
    setDeviceTypes?: Function,
    setTheToolBox?: Function,
    setLoading?: Function,
    setLocalDeviceTypes?: any
) {
    let localDeviceTypes: any = setLocalDeviceTypes || {}
    try {
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
                    this.setPreviousStatement(true)
                    this.setNextStatement(true)
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
                            devicePayloadBlock.getFieldValue('DEVICE_VAR') || ''
                    }

                    // Generate the code using the retrieved parameter
                    const code = `await waitForDevicePayload(${
                        selectedParameter ? `${selectedParameter}` : 'null'
                    });\n`

                    // Return the generated code as a string, ensuring it is a valid statement
                    return code // Changed this line to return a string instead of an array
                }
        }

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
                    'Manage devices: Create, select, or delete a device.'
                )
                this.setHelpUrl('')
            },

            deviceDeleteOptions: function () {
                return [['Delete Variable', 'DELETE_VAR']]
            },

            getDeviceOptions: function () {
                const workspace = this.workspace
                const deviceOptions = workspace
                    .getVariablesOfType('Device')
                    .map((deviceVar: any) => [deviceVar.name, deviceVar.name])
                deviceOptions.push(['Create Device...', 'CREATE_NEW'])
                return deviceOptions
            },

            handleDeviceSelection: function (newValue: any) {
                if (newValue === 'CREATE_NEW') {
                    const deviceName = prompt('Enter new device name:')
                    if (deviceName) {
                        const rightName = deviceName
                            .replace('-', '_')
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
                setTimeout(() => {
                    if (setDeviceTypes) {
                        setDeviceTypes((prevDeviceTypes: any) => ({
                            ...prevDeviceTypes,
                            [variableName]: deviceType,
                        }))
                    }
                    localDeviceTypes[variableName] = deviceType
                }, 0)

                return `let ${variableName} = lastData['${variableName}']; // Type Is: ${deviceType}`
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
                    .map((deviceVar: any) => [deviceVar.name, deviceVar.name])
                deviceOptions.push(['Device Not Selected', ''])
                return deviceOptions
            },

            getDropdownOptions: function () {
                const deviceInput = this.getFieldValue('DEVICE_VAR')
                if (deviceInput === '') {
                    return [['Device Not Selected', '']]
                }
                const device = stateDevices.find(
                    (dev) => dev.type === localDeviceTypes[deviceInput]
                )

                const options = [
                    ['Name', 'name'],
                    ['Mac', 'mac'],
                ]

                if (device && device.parameters) {
                    const parameterOptions = device.parameters.map(
                        (param: any) => [param.label, param.label]
                    )
                    return options.concat(parameterOptions)
                }

                return [['No Parameters', '']]
            },
        }

        javascriptGenerator.forBlock['manage_device_data'] = function (
            block: any
        ) {
            const deviceName = block.getFieldValue('DEVICE_VAR')
            const deviceParam = block.getFieldValue('DEVICE_DATA') || ''
            let code = ''
            if (deviceParam && deviceName) {
                code = `lastData['${deviceName}'].${String(
                    deviceParam
                ).toUpperCase()}`
            } else {
                console.warn('Device variable name is missing.')
                code = ''
            }

            var additionalText = javascriptGenerator.valueToCode(
                block,
                'DEVICE_INPUT',
                javascriptGenerator.ORDER_NONE
            )
            if (additionalText) {
                code += ' + ' + additionalText
            }
            //
            return [code, javascriptGenerator.ORDER_NONE]
        }

        Blockly.Blocks['device_payload'] = {
            init: function () {
                this.appendValueInput('DEVICE_INPUT').appendField(
                    new Blockly.FieldDropdown(this.getDeviceOptions.bind(this)),
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
                    .map((deviceVar: any) => [deviceVar.name, deviceVar.name])
                deviceOptions.push(['Device Not Selected', ''])
                return deviceOptions
            },
        }

        javascriptGenerator.forBlock['device_payload'] = function (block: any) {
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

        stateDevices.forEach((devices: any) => {
            devices.parameters.forEach((device: any) => {
                if (Array.isArray(device.value) && device.value?.length > 0) {
                    const blockName = `device_${device.label.replace(
                        /[^a-zA-Z0-9_]/g,
                        ''
                    )}`

                    // Define block if it doesn't already exist
                    if (!Blockly.Blocks[blockName]) {
                        Blockly.Blocks[blockName] = {
                            init: function () {
                                this.appendDummyInput()
                                    .appendField(device.label)
                                    .appendField(
                                        new Blockly.FieldDropdown(
                                            device.value.map((child: any) => [
                                                child,
                                                String(child).toLowerCase(),
                                            ])
                                        ),
                                        'DROPDOWN_OPTION'
                                    )
                                this.setOutput(true)
                                this.setColour(180)
                                this.setTooltip(`Block for ${device.label}`)
                            },
                        }

                        javascriptGenerator.forBlock[blockName] = function (
                            block: any
                        ) {
                            const selectedOption =
                                block.getFieldValue('DROPDOWN_OPTION')
                            let code = `"${selectedOption}"`
                            return [
                                code,
                                javascriptGenerator.ORDER_FUNCTION_CALL,
                            ]
                        }
                    }
                }
            })
        })

        let parameterBlockCreated: any = {}

        const dynamicToolbox = {
            kind: blocklyToolBox.kind,
            contents: [
                ...blocklyToolBox.contents,
                {
                    kind: 'category',
                    name: 'Server Devices',
                    colour: '180',
                    contents: [
                        { kind: 'block', type: 'manage_device_variable' },
                        { kind: 'block', type: 'manage_device_data' },
                        { kind: 'block', type: 'device_payload' },
                        ...stateDevices
                            .flatMap(
                                (device: any) =>
                                    Array.isArray(device.parameters) // Check if parameters is an array
                                        ? device.parameters
                                              .filter(
                                                  (param: any) =>
                                                      Array.isArray(
                                                          param.value
                                                      ) &&
                                                      param.value.length > 0
                                              )
                                              .map((param: any) => {
                                                  const deviceBlockName = `device_${param.label.replace(
                                                      /[^a-zA-Z0-9_]/g,
                                                      ''
                                                  )}`

                                                  // Check if block is already created
                                                  if (
                                                      !parameterBlockCreated[
                                                          deviceBlockName
                                                      ]
                                                  ) {
                                                      parameterBlockCreated[
                                                          deviceBlockName
                                                      ] = true
                                                      return {
                                                          kind: 'block',
                                                          type: deviceBlockName,
                                                      }
                                                  }
                                                  return null // Return null to filter out any undefined values
                                              })
                                        : [] // Return an empty array if parameters is not an array
                            )
                            .filter(Boolean), // Filter out any null values
                    ],
                },
            ],
        }

        if (setTheToolBox) {
            setTheToolBox(dynamicToolbox)
        }
        if (setLoading) {
            setLoading(false)
        }

        return dynamicToolbox
    } catch (error) {
        console.error('Error fetching devices:', error)
    }
}

export default function BlocklyEditor() {
    const [showCode, setShowCode] = useState(false)
    const [xml, setXml] = useState<string>()
    const [code, setCode] = useState()
    const { serviceId } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [deviceTypes, setDeviceTypes] = useState<any>({})
    const [devices, setDevices] = useState<Array<NodeDevices>>([])
    const [theToolBox, setTheToolBox] = useState<ToolboxDefinition>()
    const navigate = useNavigate()
    const workspaceRef = useRef<any>(null) // Reference to the Blockly workspace
    const { _id: userId } = useAppSelector((state) => state.auth.user)

    function getUsedDeviceTypesFromXml() {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(String(xml), 'application/xml')

        // Check for parsing errors
        const parserError = xmlDoc.getElementsByTagName('parsererror')
        if (parserError.length) {
            throw new Error('Error parsing XML: ' + parserError[0].textContent)
        }

        const manageDeviceVariableBlocks = xmlDoc.getElementsByTagName('block')
        const deviceVariables: Array<{}> = []

        for (let block of manageDeviceVariableBlocks) {
            if (block.getAttribute('type') === 'manage_device_variable') {
                const deviceVar =
                    block.getElementsByTagName('field')[0]?.textContent // DEVICE_VAR
                const deviceType =
                    block.getElementsByTagName('field')[1]?.textContent // DEVICE_TYPE

                if (deviceVar && deviceType) {
                    deviceVariables.push({ name: deviceVar, type: deviceType })
                }
            }
        }

        return deviceVariables
    }

    async function saveEditService() {
        setIsSaving(true)

        delete deviceTypes['CREATE_NEW']

        const maghol = Object.keys(deviceTypes).map((device: string) => ({
            name: device,
            type: deviceTypes[device],
        }))

        console.log('ghol:', maghol)

        console.log('ghol 2:', getUsedDeviceTypesFromXml())

        const res = (await apiEditService({
            ...data,
            blocklyJson: xml,
            code: code,
            devices: getUsedDeviceTypesFromXml(),
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

            // Define blocks for devices before loading XML
            defineBlocklyCustomBlocks(
                response.data.data,
                setDeviceTypes,
                setTheToolBox,
                setLoading
            )

            const result = datas?.data?.data

            if (result.userId !== userId) {
                return navigate('/services')
            }

            if (result) {
                setData({
                    serviceId,
                    serviceName: result.serviceName,
                    serviceType: result.serviceType,
                    description: result.description,
                    serviceImage: result.serviceImage,
                    status: result.status,
                })

                if (result.blocklyJson) {
                    const xmlText = result.blocklyJson
                        .toString()
                        .replace(/^"|"$/g, '')
                    setXml(xmlText)

                    try {
                        if (result.blocklyJson && workspaceRef.current) {
                            try {
                                const xml = Blockly.utils.xml.textToDom(xmlText)

                                workspaceRef.current.clear() // Clear the workspace

                                const parser = new DOMParser()
                                const xmlDoc = parser.parseFromString(
                                    xmlText,
                                    'application/xml'
                                )

                                // Check for parsing errors
                                const parserError =
                                    xmlDoc.getElementsByTagName('parsererror')
                                if (parserError.length) {
                                    throw new Error(
                                        'Error parsing XML: ' +
                                            parserError[0].textContent
                                    )
                                }

                                const manageDeviceVariableBlocks =
                                    xmlDoc.getElementsByTagName('block')
                                const deviceVariables: any = {}

                                for (let block of manageDeviceVariableBlocks) {
                                    if (
                                        block.getAttribute('type') ===
                                        'manage_device_variable'
                                    ) {
                                        const deviceVar =
                                            block.getElementsByTagName(
                                                'field'
                                            )[0]?.textContent // DEVICE_VAR
                                        const deviceType =
                                            block.getElementsByTagName(
                                                'field'
                                            )[1]?.textContent // DEVICE_TYPE

                                        if (deviceVar && deviceType) {
                                            deviceVariables[deviceVar] =
                                                deviceType
                                        }
                                    }
                                }

                                Object.keys(deviceVariables).forEach(
                                    (deviceName) => {
                                        let existingVar =
                                            workspaceRef.current.getVariable(
                                                deviceName
                                            )
                                        if (!existingVar) {
                                            workspaceRef.current.createVariable(
                                                deviceName,
                                                'Device',
                                                ''
                                            )
                                        }
                                    }
                                )

                                setDeviceTypes(deviceVariables)

                                setTimeout(() => {
                                    defineBlocklyCustomBlocks(
                                        response.data.data,
                                        setDeviceTypes,
                                        setTheToolBox,
                                        setLoading,
                                        deviceVariables
                                    )

                                    Blockly.Xml.domToWorkspace(
                                        xmlDoc.documentElement,
                                        workspaceRef.current
                                    )
                                }, 500)
                            } catch (xmlError) {
                                console.error('Invalid XML format:', xmlError)
                            }
                        }
                    } catch (xmlError) {
                        console.error('Invalid XML format:', xmlError)
                    }
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

    return (
        <>
            {/* <h3>{JSON.stringify(deviceTypes)}</h3> */}
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
                            toolboxConfiguration={theToolBox}
                            onXmlChange={setXml}
                            workspaceConfiguration={{
                                grid: {
                                    spacing: 20,
                                    length: 3,
                                    colour: '#ccc',
                                    snap: true,
                                },
                                disable: { isSaving },
                                trashcan: true,
                                media: `${import.meta.env.VITE_URL}uploads/`,
                            }}
                            onWorkspaceChange={(workspace) => {
                                workspaceRef.current = workspace // Set the workspace instance
                                workspaceDidChange(workspace) // Call your existing handler
                            }}
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
