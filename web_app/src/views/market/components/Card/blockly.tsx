import { apiGetNodeDevices } from '@/services/DeviceApi'
import { defineBlocklyCustomBlocks } from '@/views/services/ServiceCode/components/BlocklyEditor'
import { useEffect, useRef, useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import Blockly from 'blockly'

function transformDeviceArrayToObject(devices: Array<any>) {
    return devices.reduce((acc, device) => {
        acc[device.name] = device.type
        return acc
    }, {})
}

export default function CardBlockly({
    xmlText,
    devices,
}: {
    xmlText: string
    devices: any
}) {
    const [loading, setLoading] = useState<boolean>(true)
    const [xml, setXml] = useState<string>()
    const [dynamicToolbox, setDynamicToolbox] = useState<any>()
    const workspaceRef = useRef<any>(null)

    async function fetchData() {
        const response = (await apiGetNodeDevices()) as any
        setDynamicToolbox(defineBlocklyCustomBlocks(response.data.data))

        const formatedXml = xmlText.toString().replace(/^"|"$/g, '')

        setXml(formatedXml)

        if (workspaceRef.current) {
            console.log('Work Space Available')

            const domXml = Blockly.utils.xml.textToDom(xmlText)

            //workspaceRef.current.clear()

            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(
                formatedXml,
                'application/xml'
            )

            const parserError = xmlDoc.getElementsByTagName('parsererror')
            if (parserError.length) {
                throw new Error(
                    'Error parsing XML: ' + parserError[0].textContent
                )
            }

            const manageDeviceVariableBlocks =
                xmlDoc.getElementsByTagName('block')
            const deviceVariables: any = {}

            for (let block of manageDeviceVariableBlocks) {
                if (block.getAttribute('type') === 'manage_device_variable') {
                    const deviceVar =
                        block.getElementsByTagName('field')[0]?.textContent // DEVICE_VAR
                    const deviceType =
                        block.getElementsByTagName('field')[1]?.textContent // DEVICE_TYPE

                    if (deviceVar && deviceType) {
                        deviceVariables[deviceVar] = deviceType
                    }
                }
            }

            Object.keys(deviceVariables).forEach((deviceName) => {
                let existingVar = workspaceRef.current.getVariable(deviceName)
                if (!existingVar) {
                    workspaceRef.current.createVariable(
                        deviceName,
                        'Device',
                        ''
                    )
                }
            })

            setDynamicToolbox(
                defineBlocklyCustomBlocks(
                    response.data.data,
                    undefined,
                    undefined,
                    undefined,
                    deviceVariables
                )
            )

            Blockly.Xml.domToWorkspace(domXml, workspaceRef.current)

            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <BlocklyWorkspace
                className={`h-[30rem]`}
                toolboxConfiguration={dynamicToolbox}
                initialXml={xml}
                workspaceConfiguration={{
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: '#ccc',
                        snap: true,
                    },
                    trashcan: true,
                    media: `${import.meta.env.VITE_URL}uploads/`,
                    readOnly: true,
                    move: {
                        drag: true,
                        scrollbars: true,
                        wheel: true,
                    },
                }}
                onWorkspaceChange={(workspace) => {
                    workspaceRef.current = workspace
                }}
            />
        </>
    )
}
