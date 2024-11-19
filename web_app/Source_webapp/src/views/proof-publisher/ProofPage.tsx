import { Loading } from '@/components/shared'
import {
    Button,
    FormContainer,
    Input,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FormRow from '../account/Settings/components/FormRow'
import * as Yup from 'yup'
import { apiValidateZkpCommitment } from '@/services/UserApi'
import { apiGetNodeDevices } from '@/services/DeviceApi'
import { apiZKPPublishProof } from '@/services/ContractServices'

export default function ProofPage() {
    const [loading, setLoading] = useState<boolean>(true)
    const [devicesData, setDevicesData] = useState<any[]>([])
    const [selectedDevice, setSelectedDevice] = useState<any>(null)

    const location = useLocation()
    const navigateTo = useNavigate()
    const params = new URLSearchParams(location.search)
    const userValue = params.get('user') || ''
    const passwordValue = params.get('pass') || ''

    function checkObjectItems(object: { [key: string]: any }): boolean {
        const device = devicesData.find(
            (d) => d.type === object.deviceType.value
        )
        const values = Object.values(object.parameters)

        if (
            values.length !== device.parameters.length ||
            object.proof.length == 0
        ) {
            return false
        }

        for (const item of values) {
            if (typeof item === 'string' && item.length === 0) {
                return false
            }
        }

        return true
    }

    useEffect(() => {
        async function validateData() {
            const res = (await apiValidateZkpCommitment(
                userValue,
                passwordValue
            )) as any
            if (!res?.data?.data) navigateTo('/')
        }
        async function fetchDevices() {
            const res = (await apiGetNodeDevices()) as any
            setDevicesData(res?.data?.data || [])
            setLoading(false)
        }
        validateData()
        fetchDevices()
    }, [location.search])

    const handleDeviceChange = (deviceType: any, setFieldValue: any) => {
        const device = devicesData.find((d) => d.type === deviceType.value)
        setSelectedDevice(device)
        setFieldValue('parameters', '')
        device?.parameters?.forEach((param: any) => {
            setFieldValue(`parameters.${param.label}`, '') // Reset each parameter value
        })
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen">
                <Loading loading={true} />
            </div>
        )
    }

    type ParameterValues = {
        [key: string]: string // or string | undefined if values can be optional
    }

    async function onFormSubmit(values: any) {
        if (checkObjectItems(values) == false) {
            return toast.push(
                <Notification type="danger">
                    {'Please enter all fields'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
        let filteredItems: any = {
            Root: false,
            HV: String(Math.floor(Math.random() * 3) + 1),
            FV: String(Math.floor(Math.random() * 6) + 1),
        }

        Object.keys(values.parameters).map((data: any) => {
            const item = values.parameters[data]
            if (typeof item == 'object') {
                filteredItems[data] = item.value
            } else {
                filteredItems[data] = item
            }
        })

        try {
            setLoading(true)
            const res = await apiZKPPublishProof(
                values.deviceType.value,
                values.proof,
                filteredItems
            )
            toast.push(
                <Notification type="success">
                    {'Proof published successfully'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            toast.push(
                <Notification type="danger">
                    {error.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }

        console.log('filteredItems:', filteredItems)
        console.log('deviceType:', values.deviceType.value)
        console.log('Proof:', values.proof)
    }

    return (
        <main className="flex flex-col w-full">
            <Formik
                enableReinitialize
                initialValues={{
                    deviceType: '',
                    proof: '',
                    parameters: {} as ParameterValues,
                }}
                onSubmit={(values, { setSubmitting }) => {
                    onFormSubmit(values)
                    setSubmitting(false)
                }}
            >
                {({
                    touched,
                    errors,
                    isSubmitting,
                    resetForm,
                    setFieldValue,
                    values,
                }) => {
                    const validatorProps = { touched, errors }

                    return (
                        <Form>
                            <FormContainer>
                                <h3>ZKP Commitment Publisher</h3>
                                {/* Device Type Dropdown */}
                                <FormRow
                                    name="deviceType"
                                    label="IoT Device Type"
                                    {...validatorProps}
                                >
                                    <Field
                                        component={Select}
                                        name="deviceType"
                                        value={values.deviceType} // Bind value to form state
                                        options={devicesData.map((device) => ({
                                            label: device.type,
                                            value: device.type,
                                        }))}
                                        onChange={(deviceType: any) => {
                                            setFieldValue(
                                                'deviceType',
                                                deviceType
                                            ) // Update form value
                                            handleDeviceChange(
                                                deviceType,
                                                setFieldValue
                                            ) // Update parameters dynamically
                                        }}
                                    />
                                </FormRow>

                                {/* Parameters Section */}
                                {selectedDevice?.parameters && (
                                    <>
                                        {selectedDevice?.parameters?.map(
                                            (param: any) => (
                                                <FormRow
                                                    key={param.label}
                                                    name={`parameters.${param.label}`}
                                                    label={param.label}
                                                    {...validatorProps}
                                                >
                                                    {param.value.length > 0 ? (
                                                        <Field
                                                            component={Select}
                                                            name={`parameters.${param.label}`}
                                                            value={
                                                                values
                                                                    .parameters?.[
                                                                    param.label
                                                                ] || ''
                                                            } // Bind value to form state
                                                            options={param.value.map(
                                                                (
                                                                    option: string
                                                                ) => ({
                                                                    label: option,
                                                                    value: option,
                                                                })
                                                            )}
                                                            onChange={(
                                                                deviceType: string
                                                            ) => {
                                                                setFieldValue(
                                                                    `parameters.${param.label}`,
                                                                    deviceType
                                                                ) // Update form value
                                                            }}
                                                        />
                                                    ) : (
                                                        <Field
                                                            component={Input}
                                                            name={`parameters.${param.label}`}
                                                            placeholder={`Enter ${param.label}`}
                                                        />
                                                    )}
                                                </FormRow>
                                            )
                                        )}
                                        <FormRow
                                            key={'proof'}
                                            name={`proof`}
                                            label={'Proof'}
                                            {...validatorProps}
                                        >
                                            <Field
                                                component={Input}
                                                textArea={true}
                                                style={{ resize: 'none' }}
                                                name={`proof`}
                                                placeholder={`Paste the proof here`}
                                            />
                                        </FormRow>
                                    </>
                                )}

                                {/* Buttons */}
                                <div className="flex items-center justify-center mt-4">
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Publishing'
                                            : 'Publish'}
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="ml-2"
                                        onClick={() => {
                                            resetForm()
                                            setSelectedDevice(null)
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </main>
    )
}
