import {
    Button,
    FormContainer,
    Input,
    Notification,
    toast,
    Upload,
} from '@/components/ui'
import { Form, Field, Formik } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'
import FormRow from '../account/Settings/components/FormRow'
import { HiUpload } from 'react-icons/hi'
import {
    apiGetMyCommitments,
    apiStoreCommitment,
} from '@/services/ContractServices'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { apiValidateZkpCommitment } from '@/services/UserApi'
import { AdaptableCard, Loading } from '@/components/shared'
import CommitmentTable from './CommitmentTable'

export type CommitmentFormModel = {
    userId?: string
    manufacturerName: string
    deviceType: string
    hardwareVersion: string
    firmwareVersion: string
    lines: string
    commitmentData: any
}

export default function CommitmentPage() {
    const [loading, setLoading] = useState(true)
    const [commitmentLoading, setCommitmentLoading] = useState(true)
    const [resetUpload, setResetUpload] = useState(0)
    const [refreshCommitments, setRefreshCommitments] = useState(0)
    const [commitments, setCommitments] = useState<CommitmentFormModel[]>([])
    const location = useLocation()
    const navigateTo = useNavigate()
    const params = new URLSearchParams(location.search)
    const userValue = params.get('user') || ''
    const passwordValue = params.get('pass') || ''

    async function getCommitmentsData() {
        setCommitmentLoading(true)
        const commitmentRes = (await apiGetMyCommitments()) as any
        setCommitments(commitmentRes.data.data)
        setCommitmentLoading(false)
    }

    async function validateData(user: string, pass: string) {
        const res = (await apiValidateZkpCommitment(user, pass)) as any
        if (res.data.data) {
            setLoading(false)
        } else {
            navigateTo('/')
        }
    }

    useEffect(() => {
        getCommitmentsData()
    }, [refreshCommitments])

    useEffect(() => {
        validateData(userValue, passwordValue)
    }, [location.search])

    const validationSchema = Yup.object().shape({
        manufacturerName: Yup.string().required('Manufacturer is required'),
        deviceType: Yup.string().required('Device Name is required'),
        hardwareVersion: Yup.string().required('Hardware Version is required'),
        firmwareVersion: Yup.string().required('Firmware Version is required'),
        lines: Yup.string().required('Lines is required'),
        commitmentData: Yup.mixed().required('Commitment File is required'),
    })

    const handleJsonFileChange = (event: any) => {
        const file = event.target.files[0]

        if (file && file.type === 'application/json') {
            const reader = new FileReader()
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const jsonText = e.target.result as string

                    try {
                        const parsedJson = JSON.parse(jsonText)
                        toast.push(
                            <Notification type="success">
                                {'Commitment file uploaded successfully.'}
                            </Notification>,
                            {
                                placement: 'top-center',
                            }
                        )
                    } catch (error) {
                        setResetUpload(resetUpload + 1)
                        return toast.push(
                            <Notification type="danger">
                                {'Please upload a valid JSON file.'}
                            </Notification>,
                            {
                                placement: 'top-center',
                            }
                        )
                    }
                } else {
                    setResetUpload(resetUpload + 1)
                    toast.push(
                        <Notification type="danger">
                            {'Please upload a valid JSON file.'}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            }

            reader.readAsText(file)
        } else {
            toast.push(
                <Notification type="danger">
                    {'Please upload a valid JSON file.'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const onFormSubmit = async (
        values: CommitmentFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
            if (e.target?.result) {
                const jsonText = e.target.result as string

                try {
                    const parsedJson = JSON.parse(jsonText)
                } catch (error) {
                    return toast.push(
                        <Notification type="danger">
                            {'Please upload a valid JSON file.'}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }

                const storeResult = await apiStoreCommitment(
                    values.manufacturerName,
                    values.deviceType,
                    values.hardwareVersion,
                    values.firmwareVersion,
                    values.lines,
                    jsonText
                )

                setLoading(true)

                setTimeout(() => {
                    setRefreshCommitments(refreshCommitments + 1)
                }, 2000)

                console.log('Store log is:', storeResult)

                setSubmitting(false)

                toast.push(
                    <Notification type="success">
                        {'Commitment published successfully.'}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                toast.push(
                    <Notification type="danger">
                        {'Error while publishing your commitment.'}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        }
        reader.readAsText(values.commitmentData)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen">
                <Loading loading={true} />
            </div>
        )
    }

    return (
        <main className="flex flex-col w-full gap-16">
            <Formik
                enableReinitialize
                initialValues={{
                    manufacturerName: '',
                    deviceType: '',
                    hardwareVersion: '',
                    firmwareVersion: '',
                    lines: '',
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
                    resetForm,
                    setFieldValue,
                    values,
                }) => {
                    const validatorProps = { touched, errors }

                    return (
                        <Form>
                            <FormContainer>
                                <h3>Commitment publisher</h3>
                                <FormRow
                                    name="manufacturerName"
                                    label="IoT Manufacturer Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="manufacturerName"
                                        placeholder="e.g. DJI"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="deviceType"
                                    label="IoT Device Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="deviceType"
                                        placeholder="e.g. Drone"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="hardwareVersion"
                                    label="Hardware Version"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="hardwareVersion"
                                        placeholder="e.g. 1"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="firmwareVersion"
                                    label="Firmware Version"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="firmwareVersion"
                                        placeholder="e.g. 1"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="lines"
                                    label="Lines"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="lines"
                                        placeholder="e.g. 200,350,4000-4010"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="commitmentData"
                                    label="Commitment File"
                                    {...validatorProps}
                                >
                                    <Upload
                                        changeForReset={resetUpload}
                                        className="flex items-center justify-around w-full"
                                        showList={false}
                                        uploadLimit={1}
                                        accept=".json"
                                        onChange={(event: any) => {
                                            handleJsonFileChange(event)
                                            setFieldValue(
                                                'commitmentData',
                                                event?.target?.files[0]
                                            )
                                        }}
                                    >
                                        <p className="text-lg">
                                            Status:
                                            <span
                                                className={`ml-1 ${
                                                    values.commitmentData
                                                        ? 'text-green-500'
                                                        : 'text-red-500'
                                                }`}
                                            >
                                                {values.commitmentData
                                                    ? 'File Selected'
                                                    : 'No File Selected'}
                                            </span>
                                        </p>
                                        <Button
                                            type="button"
                                            className="flex items-center gap-2"
                                        >
                                            Upload{' '}
                                            <HiUpload className="text-[1.2rem]" />
                                        </Button>
                                    </Upload>
                                </FormRow>

                                <div className="flex items-center justify-center mt-4 ltr:text-right">
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Publishing'
                                            : 'Publish'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>

            <AdaptableCard className="h-full p-6" bodyClass="h-full">
                <h3 className="mb-6">Commitment List</h3>

                {(commitmentLoading == false && (
                    <CommitmentTable data={commitments} />
                )) || (
                    <div className="flex w-full h-[30dvh] items-center justify-center">
                        <Loading loading={true} />
                    </div>
                )}
            </AdaptableCard>
        </main>
    )
}
