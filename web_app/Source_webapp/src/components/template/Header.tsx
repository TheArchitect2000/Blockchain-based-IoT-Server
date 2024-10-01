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
import { HiHashtag } from 'react-icons/hi'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
}

type AddressFormModel = {
    line_1: string
    line_2?: string
    country: string
    city: string
    state: string
    zipCode: string
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
        name: Yup.string().required('Home name is required'),
        line_1: Yup.string().required('Line 1 is required'),
        line_2: Yup.string(),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zipCode: Yup.string().required('Zip Code is required'),
    })

    const onFormSubmit = async (
        values: AddressFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        const dbDatas = {
            ...apiData,
            address: { ...values, country: selectedCountry.label },
        }
        const res = await apiEditUserProfile(userId?.toString() || '', dbDatas)
        toast.push(<Notification title={'Address updated'} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
        console.log('values', dbDatas)
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
                    initialValues={{}}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        onFormSubmit(values, setSubmitting)
                    }}
                >
                    {({ touched, errors, isSubmitting, resetForm }) => {
                        const validatorProps = { touched, errors }
                        return (
                            <Form>
                                {
                                    <FormContainer>
                                        <FormDesription
                                            className=""
                                            title="Commitment publisher"
                                            desc=""
                                        />
                                        <FormRow
                                            name="name"
                                            label="Manufacturer Name"
                                            {...validatorProps}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder=""
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="name"
                                            label="Device Type"
                                            {...validatorProps}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder=""
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="name"
                                            label="Hardware Version"
                                            {...validatorProps}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder=""
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="name"
                                            label="Firmware Version"
                                            {...validatorProps}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder=""
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="name"
                                            label="Lines"
                                            {...validatorProps}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder=""
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="name"
                                            label="Commitment Data"
                                            {...validatorProps}
                                        >
                                            <Field
                                                textArea={true}
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder=""
                                                component={Input}
                                            />
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
                                }
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
