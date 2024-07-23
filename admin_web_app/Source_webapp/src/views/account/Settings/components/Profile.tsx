import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import { components } from 'react-select'
import {
    HiOutlineUserCircle,
    HiOutlineMail,
    HiOutlineBriefcase,
    HiOutlineUser,
    HiCheck,
    HiOutlineGlobeAlt,
    HiCurrencyDollar,
    HiPhone,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { OptionProps, ControlProps } from 'react-select'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import { useGetCurUserProfile } from '@/utils/hooks/useGetCurUserProfile'
import {
    setAvatar,
    setFirstName,
    useAppDispatch,
    useAppSelector,
} from '@/store'
import { apiEditUserProfile, apiGetCurUserProfile } from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { apiUploadMedia } from '@/services/MediaAPI'
import { Loading } from '@/components/shared'

export type ProfileFormModel = {
    firstName: string
    lastName: string
    email: string
    mobile: string
    walletAddress: string
    title: string
    avatar: string
    //timeZone: string
    lang: string
    syncData: boolean
}

type ProfileProps = {
    data?: ProfileFormModel
    apiData?: any
}

type LanguageOption = {
    value: string
    label: string
    imgPath: string
}

const { Control } = components

const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(0, 'Too Short!').max(20, 'Too Long!'),
    lastName: Yup.string().min(0, 'Too Short!').max(20, 'Too Long!'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    mobile: Yup.string(),
    walletAddress: Yup.string(),
    avatar: Yup.string(),
    //title: Yup.string(),
    //lang: Yup.string(),
    //timeZone: Yup.string(),
    //syncData: Yup.bool(),
})

const langOptions: LanguageOption[] = [
    { value: 'en', label: 'English (US)', imgPath: '/img/countries/us.png' },
    { value: 'ch', label: '中文', imgPath: '/img/countries/cn.png' },
    { value: 'jp', label: '日本语', imgPath: '/img/countries/jp.png' },
    { value: 'fr', label: 'French', imgPath: '/img/countries/fr.png' },
]

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<LanguageOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Avatar shape="circle" size={20} src={data.imgPath} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({
    children,
    ...props
}: ControlProps<LanguageOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={18}
                    src={selected.imgPath}
                />
            )}
            {children}
        </Control>
    )
}

const Profile = ({}: ProfileProps) => {
    const [apiData, setApiData] = useState<any>({})
    const [imageSrc, setImageSrc] = useState('')
    const [imageFile, setImageFile] = useState('')
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch()

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetCurUserProfile()) as any
            setApiData(resData.data.data)
            setImageSrc(resData.data.data.avatar)
            setLoading(false)
        }
        fetchData()
    }, [])

    const { _id: userId } = useAppSelector((state) => state.auth.user)

    const onFormSubmit = async (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        console.log('values', values)

        const uploadData = new FormData()
        uploadData.append('file', imageFile as any)

        const result = imageFile
            ? ((await apiUploadMedia('profile', uploadData)) as any)
            : ''

        dispatch(setAvatar(result?.data?.data?.url || apiData.avatar))
        dispatch(setFirstName(values.firstName))
        apiEditUserProfile(userId?.toString() || '', {
            ...values,
            avatar: result?.data?.data?.url || apiData.avatar,
        })
        toast.push(<Notification title={'Profile updated'} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0]
        if (
            file &&
            (file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg')
        ) {
            const MAX_SIZE = 5 * 100 * 1024 // 500KB in bytes
            if (file.size > MAX_SIZE) {
                alert('Please upload a file smaller than 500KB.')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    const imageSrc = e.target.result as string

                    // Create an image to get its dimensions
                    const img = new Image()

                    img.src = imageSrc

                    img.onload = () => {
                        const width = img.width
                        const height = img.height

                        if (width <= 200 && height <= 200) {
                            setImageFile(file)
                            setImageSrc(imageSrc)
                        } else {
                            alert(
                                'Please upload a valid image file with dimensions 200 x 200 pixels.'
                            )
                        }
                    }
                }
            }
            reader.readAsDataURL(file)
        } else {
            alert('Please upload a valid ( PNG, JPEG, JPG ) file.')
        }
    }

    return (
        <Formik
            enableReinitialize
            initialValues={apiData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
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
                                <FormRow
                                    name="email"
                                    label="Email"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Email"
                                        component={Input}
                                        prefix={
                                            <HiOutlineMail className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="mobile"
                                    label="Mobile"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="mobile"
                                        placeholder="mobile"
                                        component={Input}
                                        prefix={<HiPhone className="text-xl" />}
                                    />
                                </FormRow>
                                <FormRow
                                    name="walletAddress"
                                    label="Wallet Address"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="walletAddress"
                                        placeholder="wallet address"
                                        component={Input}
                                        prefix={
                                            <HiCurrencyDollar className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="avatar"
                                    label="Avatar"
                                    {...validatorProps}
                                >
                                    <div
                                        className={`flex w-full items-center ${
                                            (imageSrc && 'justify-around') ||
                                            'gap-10'
                                        }`}
                                    >
                                        <Field name="serviceImage">
                                            {({ field, form }: FieldProps) => {
                                                const avatarProps = field.value
                                                    ? {
                                                          src: field.value,
                                                      }
                                                    : {}
                                                return (
                                                    <Upload
                                                        className="cursor-pointer"
                                                        showList={false}
                                                        uploadLimit={1}
                                                        accept=".png, .jpg, .jpeg"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                    >
                                                        {(!imageSrc && (
                                                            <Avatar
                                                                className="border-2 border-white dark:border-gray-800 shadow-lg"
                                                                size={60}
                                                                shape="circle"
                                                                icon={
                                                                    <HiOutlineUser />
                                                                }
                                                                {...avatarProps}
                                                            />
                                                        )) || (
                                                            <Avatar
                                                                className="!w-[100px] !h-[100px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg"
                                                                size={60}
                                                                shape="circle"
                                                                icon={
                                                                    <img
                                                                        src={
                                                                            imageSrc
                                                                        } // Assuming imageFile is replaced by imageSrc for handling images
                                                                        alt="Uploaded Service Image"
                                                                        style={{
                                                                            objectFit:
                                                                                'cover',
                                                                            width: '100px !important',
                                                                            height: '100px !important',
                                                                        }}
                                                                    />
                                                                }
                                                                {...avatarProps}
                                                            />
                                                        )}
                                                    </Upload>
                                                )
                                            }}
                                        </Field>
                                        <p>
                                            <strong>
                                                Image Upload Requirements:
                                            </strong>
                                            <br />
                                            <strong>Format:</strong> PNG, JPEG,
                                            JPG <br />
                                            <strong>Size:</strong> 200x200
                                            pixels Maximum
                                            <br />
                                            <strong>File size:</strong> 500 KB
                                        </p>
                                    </div>
                                </FormRow>
                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => resetForm()}
                                    >
                                        Reset
                                    </Button>
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
