import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import {
    HiOutlineUserCircle,
} from 'react-icons/hi'
import * as Yup from 'yup'
import {
    setFirstName,
    useAppDispatch,
    useAppSelector,
} from '@/store'
import { apiEditUserProfile, apiGetCurUserProfile } from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'

export type ProfileFormModel = {
    firstName: string
    lastName: string
}

type ProfileProps = {
    data?: ProfileFormModel
    apiData?: any
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(0, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().min(0, 'Too Short!').max(20, 'Too Long!'),
})

const Profile = ({}: ProfileProps) => {
    const [apiData, setApiData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetCurUserProfile()) as any
            setApiData(resData.data.data)
            setLoading(false)
        }
        fetchData()
    }, [])

    const { _id: userId } = useAppSelector((state) => state.auth.user)

    const onFormSubmit = async (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        dispatch(setFirstName(values.firstName))
        apiEditUserProfile(userId?.toString() || '', {
            ...values,
        })
        toast.push(<Notification title={'Profile updated'} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                firstName: apiData.firstName,
                lastName: apiData.lastName,
            }}
            validationSchema={validationSchema}
            onSubmit={(values: ProfileFormModel, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ values, touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        {(loading === false && (
                            <FormContainer>
                                <FormDesription
                                    title="General"
                                    desc="Basic info, like your name and address that will displayed in public"
                                />
                                <FormRow
                                    name="firstName"
                                    label="First Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="firstName"
                                        placeholder="first name"
                                        component={Input}
                                        prefix={
                                            <HiOutlineUserCircle className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="lastName"
                                    label="Last Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="lastName"
                                        placeholder="last name"
                                        component={Input}
                                        prefix={
                                            <HiOutlineUserCircle className="text-xl" />
                                        }
                                    />
                                </FormRow>

                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting ? 'Updating' : 'Update'}
                                    </Button>
                                </div>
                            </FormContainer>
                        )) || (
                            <div className="w-full h-[60dvh]">
                                <Loading loading={true} />
                            </div>
                        )}
                        {/* <FormRow
                                name="title"
                                label="Title"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="title"
                                    placeholder="Title"
                                    component={Input}
                                    prefix={
                                        <HiOutlineBriefcase className="text-xl" />
                                    }
                                />
                            </FormRow> */}
                        {/* <FormDesription
                                className="mt-8"
                                title="Preferences"
                                desc="Your personalized preference displayed in your account"
                            />
                            <FormRow
                                name="lang"
                                label="Language"
                                {...validatorProps}
                            >
                                <Field name="lang">
                                    {({ field, form }: FieldProps) => (
                                        <Select<LanguageOption>
                                            field={field}
                                            form={form}
                                            options={langOptions}
                                            components={{
                                                Option: CustomSelectOption,
                                                Control: CustomControl,
                                            }}
                                            value={langOptions.filter(
                                                (option) =>
                                                    option.value ===
                                                    values?.lang
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    option?.value
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormRow> */}
                        {/* <FormRow
                                name="timeZone"
                                label="Time Zone"
                                {...validatorProps}
                            >
                                <Field
                                    readOnly
                                    type="text"
                                    autoComplete="off"
                                    name="timeZone"
                                    placeholder="Time Zone"
                                    component={Input}
                                    prefix={
                                        <HiOutlineGlobeAlt className="text-xl" />
                                    }
                                />
                            </FormRow> */}
                        {/* <FormRow
                                name="syncData"
                                label="Sync Data"
                                {...validatorProps}
                                border={false}
                            >
                                <Field name="syncData" component={Switcher} />
                            </FormRow> */}
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Profile
