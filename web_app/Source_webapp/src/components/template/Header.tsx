import classNames from 'classnames'
import { HEADER_HEIGHT_CLASS } from '@/constants/theme.constant'
import { useState, type ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import * as Yup from 'yup'
import {
    Button,
    Dialog,
    Dropdown,
    FormContainer,
    Input,
    Notification,
    toast,
    Upload,
} from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useConfig } from '../ui/ConfigProvider'
import {
    apiValidateRemixIDE,
    apiValidateZkpCommitment,
} from '@/services/UserApi'
import { PasswordInput } from '../shared'
import './style.css'
import { Field, Form, Formik } from 'formik'
import FormDesription from '@/views/account/Settings/components/FormDesription'
import FormRow from '@/views/account/Settings/components/FormRow'
import { HiUpload } from 'react-icons/hi'
import { apiStoreCommitment } from '@/services/ContractServices'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
}

type CommitmentFormModel = {
    manufacturerName: string
    deviceType: string
    hardwareVersion: string
    firmwareVersion: string
    lines: string
    commitmentFile: any
}

const Header = (props: HeaderProps) => {
    const { headerStart, headerEnd, headerMiddle, className, container } = props
    const navigate = useNavigate()
    const [commitmentDialog, setCommitmentDialog] = useState(false)
    const [consoleDialog, setConsoleDialog] = useState(false)
    const [dialogState, setDialogState] = useState('')
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{
        username?: string
        password?: string
    }>({})

    const onCreateNewService = () => {
        navigate(`/services/new`)
    }

    const handleJsonFileChange = (event: any) => {
        const file = event.target.files[0]

        if (file && file.type === 'application/json') {
            toast.push(
                <Notification type="success">
                    {'Commitment file uploaded successfully.'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
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

    const { themeBackground } = useConfig()

    const validateForm = () => {
        let valid = true
        const newErrors: { username?: string; password?: string } = {}

        if (!username) {
            newErrors.username = 'Username is required'
            valid = false
        }

        if (!password) {
            newErrors.password = 'Password is required'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    async function validateSmartContractData(user: string, pass: string) {
        setLoading(true)
        let res = null
        if (dialogState == 'Smart Contract Console') {
            res = (await apiValidateRemixIDE(user, pass)) as any
        } else {
            res = (await apiValidateZkpCommitment(user, pass)) as any
        }

        setLoading(false)
        if (res.data.data == true) {
            setConsoleDialog(false)
            if (dialogState == 'Smart Contract Console') {
                navigate(`/remix?user=${username}&pass=${password}`)
            } else if (dialogState == 'zkp Commitment Generator') {
                window.open(
                    'https://fidesinnova-1.gitbook.io/fidesinnova-docs/zero-knowledge-proof-zkp-scheme/2-commitment-phase',
                    '_blank'
                )
            } else if (dialogState == 'zkp Commitment Publisher') {
                setCommitmentDialog(true)
            }
        } else {
            toast.push(
                <Notification type="danger">
                    {'Username or password is not valid'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const onValidate = () => {
        if (validateForm()) {
            validateSmartContractData(username, password)
        }
    }

    function dropDownSelectHandler(eventKey: string) {
        setDialogState(eventKey)
        setConsoleDialog(true)
    }

    const validationSchema = Yup.object().shape({
        manufacturerName: Yup.string().required('Manufacturer is required'),
        deviceType: Yup.string().required('Device Type is required'),
        hardwareVersion: Yup.string().required('Hardware Version is required'),
        firmwareVersion: Yup.string().required('Firmware Version is required'),
        lines: Yup.string().required('Lines is required'),
        commitmentFile: Yup.mixed().required('Commitment File is required'),
    })

    const onFormSubmit = async (
        values: CommitmentFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
            if (e.target?.result) {
                const jsonText = e.target.result as string

                const storeResult = await apiStoreCommitment(
                    values.manufacturerName,
                    values.deviceType,
                    values.hardwareVersion,
                    values.firmwareVersion,
                    values.lines,
                    jsonText
                )

                console.log('Store log is:', storeResult)

                setSubmitting(false)
                setCommitmentDialog(false)

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
        reader.readAsText(values.commitmentFile)
    }

    return (
        <header
            className={classNames(
                'header',
                `dark:bg-${themeBackground}`,
                className
            )}
        >
            <Dialog
                isOpen={commitmentDialog}
                onClose={() => setCommitmentDialog(false)}
            >
                <Formik
                    enableReinitialize
                    initialValues={{
                        manufacturerName: '',
                        deviceType: '',
                        hardwareVersion: '',
                        firmwareVersion: '',
                        lines: '',
                        commitmentFile: null,
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
                                    <FormDesription
                                        title="Commitment publisher"
                                        desc=""
                                    />
                                    <FormRow
                                        name="manufacturerName"
                                        label="Manufacturer Name"
                                        {...validatorProps}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="manufacturerName"
                                            placeholder=""
                                            component={Input}
                                        />
                                    </FormRow>
                                    <FormRow
                                        name="deviceType"
                                        label="Device Type"
                                        {...validatorProps}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="deviceType"
                                            placeholder=""
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
                                            placeholder=""
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
                                            placeholder=""
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
                                            placeholder=""
                                            component={Input}
                                        />
                                    </FormRow>
                                    <FormRow
                                        name="commitmentFile"
                                        label="Commitment File"
                                        {...validatorProps}
                                    >
                                        <Upload
                                            className="flex items-center justify-around w-full"
                                            showList={false}
                                            uploadLimit={1}
                                            accept=".json"
                                            onChange={(event: any) => {
                                                handleJsonFileChange(event)
                                                setFieldValue(
                                                    'commitmentFile',
                                                    event?.target?.files[0]
                                                )
                                            }}
                                        >
                                            <p className="text-lg">
                                                Status:
                                                <span
                                                    className={`ml-1 ${
                                                        values.commitmentFile
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                    }`}
                                                >
                                                    {values.commitmentFile
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
            </Dialog>

            <Dialog
                isOpen={consoleDialog}
                onClose={() => setConsoleDialog(false)}
            >
                <h3>{dialogState}</h3>
                <div className="flex p-6 justify-around gap-6">
                    <div className="w-full">
                        <Input
                            disabled={loading}
                            placeholder="Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={errors.username ? 'border-red-500' : ''}
                        />
                        {errors.username && (
                            <span className="text-red-500 text-sm">
                                {errors.username}
                            </span>
                        )}
                    </div>
                    <div className="w-full">
                        <PasswordInput
                            disabled={loading}
                            placeholder="Password..."
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button
                        loading={loading}
                        color="green"
                        variant="solid"
                        onClick={onValidate}
                    >
                        Login
                    </Button>
                </div>
            </Dialog>
            <div
                className={classNames(
                    'header-wrapper',
                    HEADER_HEIGHT_CLASS,
                    container && 'container mx-auto'
                )}
            >
                <div className="header-action header-action-start">
                    {headerStart}
                </div>

                {headerMiddle && (
                    <div className="header-action header-action-middle">
                        {headerMiddle}
                    </div>
                )}

                <div className="flex flex-row">
                    <div className="flex gap-4 mt-1 justify-end">
                        <Dropdown
                            onSelect={dropDownSelectHandler}
                            renderTitle={
                                <Button variant="solid">
                                    Advanced Console
                                </Button>
                            }
                            placement="bottom-center"
                            menuClass="w-full flex flex-col gap-2 mt-1"
                        >
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'Smart Contract Console'}
                            >
                                Smart Contract Console
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'zkp Commitment Generator'}
                            >
                                zkp Commitment Generator
                            </Dropdown.Item>
                            <Dropdown.Item
                                className="flex justify-center advanced-drop-down-items"
                                eventKey={'zkp Commitment Publisher'}
                            >
                                zkp Commitment Publisher
                            </Dropdown.Item>
                        </Dropdown>{' '}
                        <Button onClick={onCreateNewService} variant="solid">
                            Create New Service
                        </Button>{' '}
                    </div>
                    <div className="header-action header-action-end">
                        {headerEnd}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
