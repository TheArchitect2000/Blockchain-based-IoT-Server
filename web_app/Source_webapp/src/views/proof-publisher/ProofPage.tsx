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
import { useEffect, useState } from 'react'
import FormRow from '../account/Settings/components/FormRow'
import { apiGetNodeDevices } from '@/services/DeviceApi'
import { apiZKPPublishProof } from '@/services/ContractServices'
import { useRoleStore } from '@/store/user/userRoleStore'
import { useContractStore } from '@/provider/contract-provider'
import { useAppKitAccount } from '@reown/appkit-core/react'
import { useConfig } from '@/components/ui/ConfigProvider'
import { useNavigate } from 'react-router-dom'

export default function ProofPage() {
    const [loading, setLoading] = useState<boolean>(true)
    const [devicesData, setDevicesData] = useState<any[]>([])
    const [selectedDevice, setSelectedDevice] = useState<any>(null)
    const {
        fetchUserRoles,
        loading: roleLoading,
        checkUserHasRole,
    } = useRoleStore()
    const contractStore = useContractStore()
    const { storeZKP } = contractStore((state) => state)
    const { isConnected } = useAppKitAccount()
    const { themeColor, primaryColorLevel } = useConfig()
    const navigateTo = useNavigate()

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
        async function fetchDevices() {
            const res = (await apiGetNodeDevices()) as any
            setDevicesData(res?.data?.data || [])
            setLoading(false)
        }
        fetchUserRoles()
        fetchDevices()
    }, [])

    const handleDeviceChange = (deviceType: any, setFieldValue: any) => {
        const device = devicesData.find((d) => d.type === deviceType.value)
        setSelectedDevice(device)
        setFieldValue('parameters', '')
        device?.parameters?.forEach((param: any) => {
            setFieldValue(`parameters.${param.label}`, '') // Reset each parameter value
        })
    }

    if (loading || roleLoading) {
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

            const res = (await apiZKPPublishProof(
                values.deviceType.value,
                values.proof,
                filteredItems,
                isConnected
            )) as any
            const resultData = res.data.data
            
            if (isConnected) {
                const tx = await storeZKP(
                    resultData.nodeId,
                    resultData.objectId,
                    values.deviceType.value,
                    filteredItems.HV,
                    filteredItems.FV,
                    JSON.stringify(filteredItems),
                    JSON.stringify(values.proof)
                )

                if (tx == false) {
                    setLoading(false)
                    return toast.push(
                        <Notification type="danger">
                            {'Error while publishing proof'}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            }

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
            console.log('error:', error)

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
                                <h3>ZKP Proof Publisher</h3>
                                {!checkUserHasRole('company_developer') && (
                                    <p className="mt-4 text-md text-red-400">
                                        *You do not have a developer role
                                        assigned. Please contact your node
                                        administrator for further assistance.
                                    </p>
                                )}
                                <FormRow
                                    name="deviceType"
                                    label="IoT Device Type"
                                    {...validatorProps}
                                >
                                    <Field
                                        isDisabled={
                                            !checkUserHasRole(
                                                'company_developer'
                                            )
                                        }
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

                                {!isConnected ? (
                                    <p className={`mt-4 text-[#EAF4FF]`}>
                                        *This transaction will be processed
                                        using the{' '}
                                        <strong className="text-green-400">
                                            Node Admin Wallet
                                        </strong>
                                        . If you'd prefer to pay with your own
                                        wallet, please{' '}
                                        <strong
                                            onClick={() =>
                                                navigateTo(
                                                    '/account/settings/wallet'
                                                )
                                            }
                                            className="underline cursor-pointer text-[#0056b3]"
                                        >
                                            click here
                                        </strong>{' '}
                                        to connect your wallet.
                                    </p>
                                ) : (
                                    <p className={`mt-4 text-[#EAF4FF]`}>
                                        *This transaction will be processed
                                        using{' '}
                                        <strong className="text-red-400">
                                            your connected wallet
                                        </strong>
                                        . If you'd like to pay with the Node
                                        Admin Wallet instead, please{' '}
                                        <strong
                                            onClick={() =>
                                                navigateTo(
                                                    '/account/settings/wallet'
                                                )
                                            }
                                            className="underline cursor-pointer text-[#0056b3]"
                                        >
                                            click here
                                        </strong>{' '}
                                        and disconnect your wallet.
                                    </p>
                                )}

                                <div className="flex items-center justify-center mt-4">
                                    <Button
                                        disabled={
                                            !checkUserHasRole(
                                                'company_developer'
                                            )
                                        }
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Publishing'
                                            : 'Publish'}
                                    </Button>
                                    <Button
                                        disabled={
                                            !checkUserHasRole(
                                                'company_developer'
                                            )
                                        }
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
