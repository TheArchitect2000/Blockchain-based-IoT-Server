import { AdaptableCard, Loading } from '@/components/shared'
import {
    Button,
    Card,
    FormContainer,
    Input,
    Notification,
    Select,
    toast,
    Upload,
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
    const [txHash, setTxHash] = useState('')
    const [transactionLoading, setTransactionLoading] = useState<boolean>(false)
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

    function handleViewTransaction() {
        window.open(`https://explorer.fidesinnova.io/tx/${txHash}`, '_blank')
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

        let txHash = ''

        try {
            setTransactionLoading(true)

            const res = (await apiZKPPublishProof(
                values.deviceType.value,
                values.proof,
                filteredItems,
                isConnected
            )) as any

            const resultData = res.data.data

            if (isConnected) {
                const tx: any = await storeZKP(
                    resultData.nodeId,
                    resultData.objectId,
                    values.deviceType.value,
                    filteredItems.HV,
                    filteredItems.FV,
                    JSON.stringify(filteredItems),
                    JSON.stringify(values.proof)
                )

                txHash = tx.hash

                if (tx == false) {
                    setTransactionLoading(false)
                    return toast.push(
                        <Notification type="danger">
                            {'Error while submitting proof'}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            } else {
                txHash = resultData
            }

            setTimeout(() => {
                setTransactionLoading(false)
                setTxHash(String(txHash))
                setSelectedDevice(null)
                toast.push(
                    <Notification type="success">
                        {'Proof submitted successfully'}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }, 5000)
        } catch (error: any) {
            console.log('error:', error)

            setTransactionLoading(false)
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

    const handleProofFileChange = (event: any, setFieldValue: any) => {
        const file = event.target.files[0]
        if (!file || file.type !== 'application/json') {
            toast.push(
                <Notification type="danger">
                    Please upload a valid JSON proof file.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            if (!e.target?.result) {
                toast.push(
                    <Notification type="danger">File read error.</Notification>,
                    { placement: 'top-center' }
                )
                return
            }

            try {
                const jsonText = e.target.result as string
                const parsedJson = JSON.parse(jsonText)

                if (!parsedJson.commitment_id) {
                    toast.push(
                        <Notification type="danger">
                            This file has no commitment_id.
                        </Notification>,
                        { placement: 'top-center' }
                    )
                    return
                }

                // Store the entire parsed JSON proof if desired
                setFieldValue('proof', parsedJson)

                toast.push(
                    <Notification type="success">
                        Proof file loaded successfully.
                    </Notification>,
                    { placement: 'top-center' }
                )
            } catch (err) {
                toast.push(
                    <Notification type="danger">
                        Invalid JSON file.
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        }
        reader.readAsText(file)
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
                                <h3>ZKP Proof Submiter</h3>
                                {!checkUserHasRole('company_developer') && (
                                    <p className="mt-4 text-md text-red-400">
                                        * You do not have a developer role
                                        assigned. Please reach out to your node
                                        administrator to request this
                                        permission.
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
                                            ) || transactionLoading
                                        }
                                        disabled={transactionLoading}
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
                                                            isDisabled={
                                                                transactionLoading
                                                            }
                                                            disabled={
                                                                transactionLoading
                                                            }
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
                                                            disabled={
                                                                transactionLoading
                                                            }
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
                                            <div className="flex flex-col w-full gap-4">
                                                <Upload
                                                    disabled={
                                                        !checkUserHasRole(
                                                            'company_developer'
                                                        ) || transactionLoading
                                                    }
                                                    showList={false}
                                                    uploadLimit={1}
                                                    accept=".json"
                                                    onChange={(event: any) =>
                                                        handleProofFileChange(
                                                            event,
                                                            setFieldValue
                                                        )
                                                    }
                                                >
                                                    <Button
                                                        className="w-fit"
                                                        disabled={
                                                            !checkUserHasRole(
                                                                'company_developer'
                                                            ) ||
                                                            transactionLoading
                                                        }
                                                        variant={
                                                            values.proof
                                                                ? 'solid'
                                                                : 'twoTone'
                                                        }
                                                        type="button"
                                                    >
                                                        Upload Proof
                                                    </Button>
                                                </Upload>
                                                {values.proof && (
                                                    <Card>
                                                        Commitment Id:{' '}
                                                        <span className="font-bold break-all">
                                                            {
                                                                values.proof
                                                                    .commitment_id
                                                            }
                                                        </span>
                                                    </Card>
                                                )}
                                            </div>
                                        </FormRow>
                                    </>
                                )}

                                {!isConnected ? (
                                    <p className={`mt-4 text-[#EAF4FF]`}>
                                        * This transaction will be processed
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
                                        * This transaction will be processed
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

                                <AdaptableCard className="mt-4">
                                    {txHash.length > 0 && (
                                        <div
                                            className={`p-4 mb-4 border border-green-400 rounded-lg space-y-0.5`}
                                        >
                                            <h5>Transaction Submitted!</h5>
                                            <p>
                                                You can track the status of your
                                                transaction using the following
                                                Transaction ID:
                                            </p>
                                            <p
                                                onClick={handleViewTransaction}
                                                className={`underline text-${themeColor}-${primaryColorLevel} hover:text-${themeColor}-300 cursor-pointer`}
                                            >
                                                {txHash}
                                            </p>
                                            <p>
                                                Click the link above to view the
                                                details on the Explorer.
                                            </p>
                                        </div>
                                    )}
                                </AdaptableCard>

                                <div className="flex items-center justify-center mt-4">
                                    {txHash.length == 0 ? (
                                        <>
                                            <Button
                                                disabled={
                                                    !checkUserHasRole(
                                                        'company_developer'
                                                    )
                                                }
                                                variant="solid"
                                                loading={
                                                    isSubmitting ||
                                                    transactionLoading
                                                }
                                                type="submit"
                                            >
                                                {isSubmitting
                                                    ? 'Submitting'
                                                    : 'Submit'}
                                            </Button>
                                            <Button
                                                disabled={
                                                    !checkUserHasRole(
                                                        'company_developer'
                                                    ) || transactionLoading
                                                }
                                                variant="default"
                                                className="ml-2"
                                                onClick={() => {
                                                    resetForm()
                                                    setSelectedDevice(null)
                                                    setTxHash('')
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                resetForm()
                                                setSelectedDevice(null)
                                                setTxHash('')
                                            }}
                                            type="button"
                                        >
                                            OK
                                        </Button>
                                    )}
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </main>
    )
}
