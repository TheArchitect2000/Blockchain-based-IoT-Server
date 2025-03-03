import { PasswordInput } from '@/components/shared'
import { Button, FormContainer, Input } from '@/components/ui'
import './style.scss'
import StorXLogo from './sotrxLogo'
import { Field, Form, Formik } from 'formik'
import FormRow from '../FormRow'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    username: Yup.string() /* .required('username Required') */,
    password: Yup.string() /* .required('Password Required') */,
})

export default function StorX() {
    return (
        <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {}}
        >
            {({ touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <div className="flex items-center gap-4">
                                <h4>StorX Authentication</h4>
                                <StorXLogo />
                            </div>
                            <FormRow
                                name="username"
                                label="Username"
                                {...validatorProps}
                            >
                                <Field
                                    autoComplete="off"
                                    name="username"
                                    placeholder="username..."
                                    component={Input}
                                    disabled={true}
                                />
                            </FormRow>
                            <FormRow
                                name="password"
                                label="Password"
                                {...validatorProps}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="password..."
                                    component={PasswordInput}
                                    disabled={true}
                                />
                            </FormRow>
                            <div className="mt-4 ltr:text-right">
                                <Button
                                    variant="solid"
                                    size="sm"
                                    className="w-fit ms-auto"
                                >
                                    Login to StorX
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}
