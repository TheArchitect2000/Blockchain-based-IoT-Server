import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import {
    apiCheckEmailExist,
    apiForgotPassword,
    apiRequestResetPassword,
} from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'

interface ForgotPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    email: string
    newPassword: string
    newPasswordConfirm: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email'),
    newPassword: Yup.string()
        .required('Enter your new password')
        .matches(/^[A-Za-z0-9_-]*$/, 'Only Letters & Numbers Allowed'),
    newPasswordConfirm: Yup.string()
        .required('Enter your confirm password')
        .oneOf([Yup.ref('newPassword'), ''], 'Password not match'),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [emailSent, setEmailSent] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const existRes = (await apiCheckEmailExist(values.email)) as any
            setSubmitting(false)
            if (existRes.data?.data) {
                const resetRes = await apiRequestResetPassword(
                    values.email,
                    values.newPassword
                )
                setEmailSent(true)
            }
        } catch (errors) {
            setMessage('Email not found')
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1">Check your email</h3>
                        <p>
                            We have sent a password recovery instruction to your
                            email
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Forgot Password</h3>
                        <p>
                            Please enter your email address to receive a
                            verification code
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                enableReinitialize
                initialValues={{
                    email: '',
                    newPassword: '',
                    newPasswordConfirm: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!emailSent) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setEmailSent(false)
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        disabled={isSubmitting}
                                        placeholder="email@example.com"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    invalid={
                                        errors.newPassword &&
                                        touched.newPassword
                                    }
                                    errorMessage={errors.newPassword}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        disabled={isSubmitting}
                                        placeholder="New password"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    invalid={
                                        errors.newPasswordConfirm &&
                                        touched.newPasswordConfirm
                                    }
                                    errorMessage={errors.newPasswordConfirm}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPasswordConfirm"
                                        disabled={isSubmitting}
                                        placeholder="Re-Enter new password"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent ? 'Resend Email' : 'Send Email'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
