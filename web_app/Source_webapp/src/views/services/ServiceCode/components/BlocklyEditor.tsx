import { useEffect, useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import { javascriptGenerator } from 'blockly/javascript'
import './style.scss'
import './customBlocks/custom_Blocks'
import { Button, Checkbox, Notification, toast } from '@/components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { apiEditService, apiGetServiceByServiceId } from '@/services/ServiceAPI'
import { useAppSelector } from '@/store'
import { SyntaxHighlighter } from '@/components/shared'

const toolbox = {
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
                    type: 'procedures_defnoreturn',
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
                    disabled: 'true',
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
                    type: 'customized_device_info',
                },
                {
                    kind: 'block',
                    type: 'customized_multi_sensor_temperature_humidity',
                },
                {
                    kind: 'block',
                    type: 'customized_multi_sensor_door',
                },
                {
                    kind: 'block',
                    type: 'door_options',
                },
                {
                    kind: 'block',
                    type: 'customized_multi_sensor_motion',
                },
                {
                    kind: 'block',
                    type: 'movement_options',
                },
                {
                    kind: 'block',
                    type: 'customized_multi_sensor_button',
                },
                {
                    kind: 'block',
                    type: 'button_options',
                },
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
                {
                    kind: 'block',
                    type: 'customized_thermometer_hygrometer',
                },
                {
                    kind: 'block',
                    type: 'customized_door_sensor',
                },
                {
                    kind: 'block',
                    type: 'customized_motion_detector',
                },
                {
                    kind: 'block',
                    type: 'customized_smart_button',
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
export default function BlocklyEditor() {
    const [showCode, setShowCode] = useState(false)
    const [xml, setXml] = useState<string>()
    const [code, setCode] = useState()
    const { serviceId } = useParams()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const datas = (await apiGetServiceByServiceId(
                    serviceId || ''
                )) as any

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
                        setXml(
                            result.blocklyJson.toString().replace(/^"|"$/g, "'")
                        )
                    }

                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

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

    return (
        <>
            {!loading && (
                <div className="grid grid-cols-3">
                    <BlocklyWorkspace
                        className={`h-[30rem] ${
                            (showCode == true && 'col-span-2') || 'col-span-3'
                        }`} // you can use whatever classes are appropriate for your app's CSS
                        toolboxConfiguration={toolbox} // this must be a JSON toolbox definition
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
                    {showCode && (
                        <SyntaxHighlighter
                            className="!h-full !max-h-[57.5vh] !m-0"
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
