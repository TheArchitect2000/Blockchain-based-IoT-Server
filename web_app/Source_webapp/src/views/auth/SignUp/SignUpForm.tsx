import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import { useState, useRef, useEffect } from 'react'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    password: string
    email: string
    captcha: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Please enter your email.'),
    password: Yup.string().required('Please enter your password.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Your passwords do not match')
        .required('Please confirm your password.'),
    captcha: Yup.string(),
})

const generateCaptcha = () => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const length = 8
    let captcha = ''
    for (let i = 0; i < length; i++) {
        captcha += characters.charAt(
            Math.floor(Math.random() * characters.length)
        )
    }
    return captcha
}

const drawLineThroughText = (canvas: HTMLCanvasElement, text: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x = 5
    const y = 25

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.font = '25px Arial'
    ctx.fillText(text, x, y)

    const width = ctx.measureText(text).width
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(x, y - 8)
    ctx.lineTo(x + width, y - 7) // Draw line through text
    ctx.stroke()
}

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()
    const [captcha, setCaptcha] = useState(generateCaptcha()) // Generate initial CAPTCHA
    const [captchaInput, setCaptchaInput] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current && captcha) {
            drawLineThroughText(canvasRef.current, captcha)
        }
    }, [captcha])

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { password, email } = values
        setSubmitting(true)
        const result = await signUp({ email, password })

        if (result?.status === 'failed') {
            setMessage('Error: User with this email exist !')
        }

        setSubmitting(false)
    }

    const regenerateCaptcha = () => {
        setCaptcha(generateCaptcha())
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: '',
                    email: '',
                    captcha: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit && captchaInput === captcha) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                        setMessage('Please enter the correct CAPTCHA')
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Confirm Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className="flex justify-between w-full">
                                <canvas
                                    ref={canvasRef}
                                    width="200"
                                    height="40"
                                ></canvas>
                                <Button
                                    variant="default"
                                    type="button"
                                    onClick={regenerateCaptcha}
                                >
                                    Regenerate CAPTCHA
                                </Button>
                            </div>
                            <FormItem
                                label="Enter CAPTCHA"
                                invalid={errors.captcha && touched.captcha}
                                errorMessage={errors.captcha}
                            >
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    name="captcha"
                                    placeholder="Enter CAPTCHA"
                                    value={captchaInput}
                                    onChange={(e) =>
                                        setCaptchaInput(e.target.value)
                                    }
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
