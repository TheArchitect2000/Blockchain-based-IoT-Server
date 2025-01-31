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
    apiZKPPublishProof,
} from '@/services/ContractServices'
import { useRoleStore } from '@/store/user/userRoleStore'
import { AdaptableCard, Loading } from '@/components/shared'
import CommitmentTable from './CommitmentTable'
import { useAppSelector } from '@/store'
import { apiGetCurUserProfile } from '@/services/UserApi'
import { useAppKitAccount } from '@reown/appkit-core/react'
import { useNavigate } from 'react-router-dom'
import { useContractStore } from '@/provider/contract-provider'

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
    const [companyName, setCompanyName] = useState<string>('')
    const [iotManufacturerName, setIotManufacturerName] = useState<string>('')
    const [iotDeviceName, setIotDeviceName] = useState<string>('')
    const [deviceHardwareVersion, setDeviceHardwareVersion] =
        useState<string>('')
    const [firmwareVersion, setFirmwareVersion] = useState<string>('')
    const { isConnected } = useAppKitAccount()
    const navigateTo = useNavigate()
    const contractStore = useContractStore()
    const { storeCommitment } = contractStore((state) => state)

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

    async function getUserData() {
        const res = (await apiGetCurUserProfile()) as any
        if (res.data?.data?.company?.name) {
            setCompanyName(res.data?.data?.company?.name)
        }
    }

    useEffect(() => {
        getUserData()
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
            console.log('Maghol 55')

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
                console.log('Maghol')

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

                if (
                    !parsedJson.commitment_id ||
                    !parsedJson.iot_developer_name ||
                    !parsedJson.iot_device_name ||
                    !parsedJson.device_hardware_version ||
                    !parsedJson.firmware_version ||
                    parsedJson.commitment_id.trim() === '' ||
                    parsedJson.iot_developer_name.trim() === '' ||
                    parsedJson.iot_device_name.trim() === '' ||
                    parsedJson.device_hardware_version.trim() === '' ||
                    parsedJson.firmware_version.trim() === ''
                ) {
                    toast.push(
                        <Notification type="danger">
                            The JSON file is missing required fields. Please
                            ensure all fields are filled.
                        </Notification>,
                        { placement: 'top-center' }
                    )
                    setResetUpload((r) => r + 1)
                    setFieldValue('commitmentData', null)
                    return false
                }

                // If these fields are missing, handle accordingly
                setCommitmentID(parsedJson.commitment_id || '')
                setIotManufacturerName(parsedJson.iot_developer_name || '')
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
                console.log('Maghol 22')

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
            console.log('Maghol 33')

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
                console.log('Maghol 44')

                toast.push(
                    <Notification type="danger">
                        Please upload a valid JSON file.
                    </Notification>,
                    { placement: 'top-center' }
                )
                setSubmitting(false)
                return
            }

            const res = (await apiZKPPublishProof('', '', {}, true)) as any
            const nodeId = res.data.data.nodeId

            try {
                let txHash = ''

                if (isConnected) {
                    const frontTx = (await storeCommitment(
                        commitmentID,
                        nodeId,
                        iotManufacturerName,
                        iotDeviceName,
                        deviceHardwareVersion,
                        firmwareVersion,
                        jsonText
                    )) as any
                    if (frontTx == false) {
                        setSubmitting(false)
                        return toast.push(
                            <Notification type="danger">
                                CommitmentID already registered.
                            </Notification>,
                            { placement: 'top-center' }
                        )
                    } else if (typeof frontTx == 'string') {
                        setSubmitting(false)
                        return toast.push(
                            <Notification type="danger">
                                {frontTx}
                            </Notification>,
                            { placement: 'top-center' }
                        )
                    }

                    txHash = String(frontTx.hash)

                    await apiStoreCommitment(
                        commitmentID,
                        iotManufacturerName,
                        iotDeviceName,
                        deviceHardwareVersion,
                        firmwareVersion,
                        jsonText,
                        txHash,
                        true
                    )
                } else {
                    const tx = (await apiStoreCommitment(
                        commitmentID,
                        iotManufacturerName,
                        iotDeviceName,
                        deviceHardwareVersion,
                        firmwareVersion,
                        jsonText,
                        null,
                        false
                    )) as any
                    txHash = String(tx.data.data)
                }

                setCommitmentLoading(true)
                setTimeout(() => {
                    refreshCommitmentList()
                    setTxHash(String(txHash))
                    toast.push(
                        <Notification type="success">
                            Commitment submitted successfully.
                        </Notification>,
                        { placement: 'top-center' }
                    )
                }, 5000)
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
                                        ZKP Commitment Submitter
                                    </h3>
                                    {!checkUserHasRole('company_developer') && (
                                        <p className="mb-4 text-md text-red-400">
                                            * You do not have a developer role
                                            assigned. Please reach out to your
                                            node administrator to request this
                                            permission.
                                        </p>
                                    )}
                                    <AdaptableCard>
                                        <div className="mb-4 py-4">
                                            <Upload
                                                disabled={
                                                    !checkUserHasRole(
                                                        'company_developer'
                                                    ) || txHash.length > 0
                                                }
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
                                                            : 'No Commitment File Selected'}
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
                                                <div
                                                    className={`p-4 mb-4 border border-${
                                                        companyName !=
                                                        iotManufacturerName
                                                            ? 'red'
                                                            : 'green'
                                                    }-400 rounded-lg space-y-2`}
                                                >
                                                    <div className="break-all">
                                                        <strong>
                                                            Commitment ID:
                                                        </strong>{' '}
                                                        {commitmentID}
                                                    </div>
                                                    <div className="flex max-sm:flex-wrap items-center gap-2">
                                                        <strong className="text-nowrap">
                                                            IoT Developer Name:
                                                        </strong>{' '}
                                                        <p className="text-nowrap">
                                                            {
                                                                iotManufacturerName
                                                            }
                                                        </p>
                                                        {companyName !=
                                                            iotManufacturerName && (
                                                            <p className="text-red-400 text-wrap">
                                                                ( The IoT
                                                                Developer Name
                                                                in your JSON
                                                                file, "
                                                                {
                                                                    iotManufacturerName
                                                                }
                                                                " , does not
                                                                match the IoT
                                                                Developer Name
                                                                in your profile,
                                                                "{companyName}".
                                                                Please update
                                                                the IoT
                                                                Developer Name
                                                                in your JSON
                                                                file to "
                                                                {companyName}"{' '}
                                                                and try again.)
                                                            </p>
                                                        )}
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
                                            <div
                                                className={`p-4 mb-4 border border-green-400 rounded-lg space-y-0.5`}
                                            >
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

                                    {!isConnected ? (
                                        <p className={`mt-4 text-[#EAF4FF]`}>
                                            * This transaction will be processed
                                            using the{' '}
                                            <strong className="text-green-400">
                                                Node Admin Wallet
                                            </strong>
                                            . If you prefer to process it with
                                            your own wallet, please{' '}
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
                                            . If you prefer to process it with
                                            Node Admin Wallet instead, please{' '}
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
                                        {(txHash.length == 0 && (
                                            <Button
                                                disabled={
                                                    !checkUserHasRole(
                                                        'company_developer'
                                                    ) ||
                                                    companyName !=
                                                        iotManufacturerName ||
                                                    commitmentLoading
                                                }
                                                variant="solid"
                                                loading={
                                                    isSubmitting ||
                                                    commitmentLoading
                                                }
                                                type="submit"
                                            >
                                                {isSubmitting
                                                    ? 'Submitting'
                                                    : 'Submit'}
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
