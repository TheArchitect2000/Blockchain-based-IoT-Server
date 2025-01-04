import {
    Button,
    FormContainer,
    Notification,
    toast,
    Upload,
} from '@/components/ui'
import { Form, Formik } from 'formik'
import { HiUpload } from 'react-icons/hi'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import {
    apiGetMyCommitments,
    apiStoreCommitment,
} from '@/services/ContractServices'
import { useRoleStore } from '@/store/user/userRoleStore'
import { AdaptableCard, Loading } from '@/components/shared'
import CommitmentTable from './CommitmentTable'
import { useAppSelector } from '@/store'

type CommitmentFormModel = {
    commitmentData: File | null
}

export default function CommitmentPage() {
    const [txHash, setTxHash] = useState('')
    const [commitmentLoading, setCommitmentLoading] = useState(true)
    const [resetUpload, setResetUpload] = useState(0)
    const [refreshCommitments, setRefreshCommitments] = useState(0)
    const [commitments, setCommitments] = useState<any[]>([])

    // Fields extracted from JSON file
    const [commitmentID, setCommitmentID] = useState<string>('')
    const [iotManufacturerName, setIotManufacturerName] = useState<string>('')
    const [iotDeviceName, setIotDeviceName] = useState<string>('')
    const [deviceHardwareVersion, setDeviceHardwareVersion] =
        useState<string>('')
    const [firmwareVersion, setFirmwareVersion] = useState<string>('')

    // Roles
    const {
        fetchUserRoles,
        loading: roleLoading,
        checkUserHasRole,
    } = useRoleStore()

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel
    )

    async function getCommitmentsData() {
        setCommitmentLoading(true)
        const commitmentRes = (await apiGetMyCommitments()) as any
        setCommitments(commitmentRes.data.data)
        setCommitmentLoading(false)
    }

    useEffect(() => {
        fetchUserRoles()
    }, [])

    useEffect(() => {
        getCommitmentsData()
    }, [refreshCommitments])

    // We only validate the presence of the JSON file now
    const validationSchema = Yup.object().shape({
        commitmentData: Yup.mixed().required('Commitment File is required'),
    })

    function refreshCommitmentList() {
        setRefreshCommitments(refreshCommitments + 1)
    }

    const handleJsonFileChange = (event: any, setFieldValue: any) => {
        const file = event.target.files[0]

        if (!file || file.type !== 'application/json') {
            toast.push(
                <Notification type="danger">
                    Please upload a valid JSON file.
                </Notification>,
                { placement: 'top-center' }
            )
            setResetUpload((r) => r + 1)
            setFieldValue('commitmentData', null)
            return
        }

        // Set file in Formik
        setFieldValue('commitmentData', file)

        const reader = new FileReader()
        reader.onload = (e) => {
            if (!e.target?.result) {
                toast.push(
                    <Notification type="danger">
                        Please upload a valid JSON file.
                    </Notification>,
                    { placement: 'top-center' }
                )
                setResetUpload((r) => r + 1)
                setFieldValue('commitmentData', null)
                return
            }

            try {
                const jsonText = e.target.result as string
                const parsedJson = JSON.parse(jsonText)

                // If these fields are missing, handle accordingly
                setCommitmentID(parsedJson.commitmentID || '')
                setIotManufacturerName(parsedJson.iot_manufacturer_name || '')
                setIotDeviceName(parsedJson.iot_device_name || '')
                setDeviceHardwareVersion(
                    parsedJson.device_hardware_version || ''
                )
                setFirmwareVersion(parsedJson.firmware_version || '')

                toast.push(
                    <Notification type="success">
                        Commitment file uploaded successfully.
                    </Notification>,
                    { placement: 'top-center' }
                )
            } catch (error) {
                toast.push(
                    <Notification type="danger">
                        Please upload a valid JSON file.
                    </Notification>,
                    { placement: 'top-center' }
                )
                setResetUpload((r) => r + 1)
                setFieldValue('commitmentData', null)
            }
        }
        reader.readAsText(file)
    }

    const onFormSubmit = async (
        values: CommitmentFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        if (!values.commitmentData) {
            toast.push(
                <Notification type="danger">
                    Please upload a valid JSON file.
                </Notification>,
                { placement: 'top-center' }
            )
            setSubmitting(false)
            return
        }

        const reader = new FileReader()
        reader.onload = async (e) => {
            if (!e.target?.result) {
                toast.push(
                    <Notification type="danger">
                        CommitmentID already registered.
                    </Notification>,
                    { placement: 'top-center' }
                )
                setSubmitting(false)
                return
            }

            const jsonText = e.target.result as string

            let parsedJson
            try {
                parsedJson = JSON.parse(jsonText)
            } catch (error) {
                toast.push(
                    <Notification type="danger">
                        Please upload a valid JSON file.
                    </Notification>,
                    { placement: 'top-center' }
                )
                setSubmitting(false)
                return
            }

            try {
                // Call your store API
                const txHash = (await apiStoreCommitment(
                    commitmentID,
                    iotManufacturerName,
                    iotDeviceName,
                    deviceHardwareVersion,
                    firmwareVersion,
                    jsonText
                )) as any
                setTxHash(String(txHash.data.data))
                setCommitmentLoading(true)
                setTimeout(() => {
                    refreshCommitmentList()
                }, 2000)

                toast.push(
                    <Notification type="success">
                        Commitment published successfully.
                    </Notification>,
                    { placement: 'top-center' }
                )
            } catch (err) {
                toast.push(
                    <Notification type="danger">
                        CommitmentID already registered.
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
            setSubmitting(false)
        }
        reader.readAsText(values.commitmentData)
    }

    function handleViewTransaction() {
        window.open(`https://explorer.fidesinnova.io/tx/${txHash}`, '_blank')
    }

    return (
        <main className="flex flex-col w-full gap-16">
            {!roleLoading && (
                <Formik
                    enableReinitialize
                    initialValues={{
                        commitmentData: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        onFormSubmit(values, setSubmitting)
                    }}
                >
                    {({
                        touched,
                        errors,
                        isSubmitting,
                        setFieldValue,
                        resetForm,
                        values,
                    }) => {
                        return (
                            <Form>
                                <FormContainer>
                                    <h3 className="mb-4">
                                        ZKP Commitment Publisher
                                    </h3>
                                    <AdaptableCard>
                                        <div className="mb-4 py-4">
                                            <Upload
                                                disabled={txHash.length > 0}
                                                changeForReset={resetUpload}
                                                className="flex items-center justify-around w-full"
                                                showList={false}
                                                uploadLimit={1}
                                                accept=".json"
                                                onChange={(event: any) =>
                                                    handleJsonFileChange(
                                                        event,
                                                        setFieldValue
                                                    )
                                                }
                                            >
                                                <p className="text-lg">
                                                    Status:{' '}
                                                    <span
                                                        className={
                                                            values.commitmentData
                                                                ? 'text-green-500 ml-1'
                                                                : 'text-red-500 ml-1'
                                                        }
                                                    >
                                                        {values.commitmentData
                                                            ? 'File Selected'
                                                            : 'No File Selected'}
                                                    </span>
                                                </p>
                                                <Button
                                                    disabled={
                                                        !checkUserHasRole(
                                                            'company_developer'
                                                        ) || txHash.length > 0
                                                    }
                                                    variant="twoTone"
                                                    type="button"
                                                >
                                                    <p className="flex items-center gap-2">
                                                        Upload{' '}
                                                        <HiUpload className="text-[1.2rem]" />
                                                    </p>
                                                </Button>
                                            </Upload>
                                            {touched.commitmentData &&
                                                errors.commitmentData && (
                                                    <span className="text-red-500">
                                                        {errors.commitmentData}
                                                    </span>
                                                )}
                                        </div>
                                    </AdaptableCard>

                                    {/* Show JSON fields below once available */}
                                    <AdaptableCard>
                                        {values.commitmentData &&
                                            txHash.length == 0 && (
                                                <div className="p-4 mb-4 border border-green-400 rounded-lg space-y-2">
                                                    <div>
                                                        <strong>
                                                            Commitment ID:
                                                        </strong>{' '}
                                                        {commitmentID}
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            IoT Manufacturer
                                                            Name:
                                                        </strong>{' '}
                                                        {iotManufacturerName}
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            IoT Device Name:
                                                        </strong>{' '}
                                                        {iotDeviceName}
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            Hardware Version:
                                                        </strong>{' '}
                                                        {deviceHardwareVersion}
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            Firmware Version:
                                                        </strong>{' '}
                                                        {firmwareVersion}
                                                    </div>
                                                </div>
                                            )}
                                        {txHash.length > 0 && (
                                            <div className="p-4 mb-4 border border-green-400 rounded-lg space-y-0.5">
                                                <h5>Transaction Submitted!</h5>
                                                <p>
                                                    You can track the status of
                                                    your transaction using the
                                                    following Transaction ID:
                                                </p>
                                                <p
                                                    onClick={
                                                        handleViewTransaction
                                                    }
                                                    className={`underline text-${themeColor}-${primaryColorLevel} hover:text-${themeColor}-300 cursor-pointer`}
                                                >
                                                    {txHash}
                                                </p>
                                                <p>
                                                    Click the link above to view
                                                    the details on the Explorer.
                                                </p>
                                            </div>
                                        )}
                                    </AdaptableCard>

                                    <div className="flex items-center justify-center mt-4">
                                        {(txHash.length == 0 && (
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
                                        )) || (
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    resetForm()
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
            )}

            <AdaptableCard className="h-full p-6" bodyClass="h-full">
                <h3 className="mb-6">Commitment List</h3>
                {commitmentLoading ? (
                    <div className="flex w-full h-[30dvh] items-center justify-center">
                        <Loading loading={true} />
                    </div>
                ) : (
                    <CommitmentTable
                        refreshData={refreshCommitmentList}
                        data={commitments}
                    />
                )}
            </AdaptableCard>
        </main>
    )
}
