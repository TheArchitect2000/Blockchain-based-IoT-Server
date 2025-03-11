import './style.scss'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from '../FormDesription'
import FormRow from '../FormRow'
import { Field, Form, Formik } from 'formik'
import {
    HiOutlineUserCircle,
    HiOutlineMail,
    HiOutlineBriefcase,
    HiOutlineUser,
    HiCheck,
    HiOutlineGlobeAlt,
    HiCurrencyDollar,
    HiPhone,
    HiUpload,
    HiDocument,
    HiPencilAlt,
    HiHome,
    HiTag,
    HiOutlineHome,
    HiGlobe,
    HiGlobeAlt,
    HiPencil,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import { useGetCurUserProfile } from '@/utils/hooks/useGetCurUserProfile'
import {
    setAvatar,
    setFirstName,
    useAppDispatch,
    useAppSelector,
} from '@/store'
import {
    apiEditUserProfile,
    apiGetMyProfile,
    apiRequestChangeEmail,
    apiRequestVerifyEmail,
    apiVerifyChangeEmailWithToken,
} from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { apiUploadMedia } from '@/services/MediaAPI'
import { Loading } from '@/components/shared'
import { Dialog } from '@/components/ui'
import ServerImageDialog from '@/views/dialog/ServerImageDialog'
import TimeZoneSelector from '../TimezoneSelector'
import CountrySelector from '../CountrySelector'
import PhoneNumberSelector from '../PhoneNumberSelector'
import { SingleValue } from 'react-select'
import useAuth from '@/utils/hooks/useAuth'

export type ProfileFormModel = {
    firstName: string
    lastName: string
    email: string
    //walletAddress: string
    title: string
    avatar: string
    lang: string
    syncData: boolean
    //mobile: string
    //timeZone: string
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

const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .notRequired()
        .min(0, 'Too Short!')
        .max(20, 'Too Long!'),
    lastName: Yup.string()
        .notRequired()
        .min(0, 'Too Short!')
        .max(20, 'Too Long!'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    avatar: Yup.string().notRequired(),
    //walletAddress: Yup.string().notRequired(),
    //mobile: Yup.string(),
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

interface Country {
    label: string
    value: string
}

export function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const Profile = ({}: ProfileProps) => {
    const [apiData, setApiData] = useState<any>({})
    const [imageSrc, setImageSrc] = useState('')
    const [imageFile, setImageFile] = useState('')
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(false)
    const [imageModal, setImageModal] = useState(false)
    const [emailModal, setEmailModal] = useState(false)
    const [newMail, setNewMail] = useState('')
    const [changeEmailStep, setChangeEmailStep] = useState<string>('')
    const [inputs, setInputs] = useState<string[]>(Array(5).fill(''))
    const [selectImageModal, setSelectImageModal] = useState(false)
    const [selectedTimeZone, setSelectedTimeZone] = useState<any>()
    const [seconds, setSeconds] = useState(0)
    const [canRequest, setCanRequest] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState<{
        phoneNumber: string
        countryCode: SingleValue<Country>
    }>({
        phoneNumber: '',
        countryCode: null,
    })
    const dispatch = useAppDispatch()

    const { signOut } = useAuth()

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(timer)
        } else {
            setCanRequest(true)
        }
    }, [seconds])

    async function requestVerifyAccount() {
        setApiLoading(true)
        try {
            const res = await apiRequestVerifyEmail(apiData?.email || '')
            setApiLoading(false)
            if (res) {
                toast.push(
                    <Notification
                        title="The verification link has been successfully sent to your
                        email"
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error: any) {
            setApiLoading(false)
            toast.push(
                <Notification
                    title={error.response.data.message}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetMyProfile()) as any
            setApiData(resData.data.data)
            setPhoneNumber(
                resData.data.data.tel || {
                    phoneNumber: '',
                    countryCode: null,
                }
            )
            if (resData.data.data.timezone) {
                console.log(resData.data.data.timezone)

                setSelectedTimeZone({
                    label: resData.data.data.timezone,
                    value: resData.data.data.timezone,
                })
            }
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
        const uploadData = new FormData()
        uploadData.append('file', imageFile as any)

        const result = imageFile
            ? ((await apiUploadMedia('profile', uploadData)) as any)
            : ''

        dispatch(setAvatar(result?.data?.data?.url || imageSrc))
        dispatch(setFirstName(values.firstName))
        apiEditUserProfile(userId?.toString() || '', {
            ...values,
            avatar: result?.data?.data?.url || imageSrc,
            tel: phoneNumber,
            timezone: selectedTimeZone.value,
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
                            setImageModal(false)
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

    function removeImageHandle() {
        setImageFile('')
        setImageSrc('')
    }

    function serverImageClose(select: boolean) {
        if (select) {
            setImageModal(false)
            setSelectImageModal(false)
        } else {
            setImageModal(true)
            setSelectImageModal(false)
        }
    }

    async function handleRequestChangeEmail() {
        if (!validateEmail(newMail)) {
            return toast.push(
                <Notification title={'Invalid email address'} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
        }
        if (newMail.length == 0) {
            return toast.push(
                <Notification
                    title={`New email input can't be empty`}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
        setApiLoading(true)
        try {
            const res = await apiRequestChangeEmail(newMail)
            setApiLoading(false)
            setChangeEmailStep('token')
            setSeconds(120)
            setCanRequest(false)
            toast.push(
                <Notification
                    title={
                        'A verification code has been sent to your email. Please enter the code to complete the email change.'
                    }
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error: any) {
            setApiLoading(false)
            return toast.push(
                <Notification
                    title={error.response.data.message}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const clearTokenInputs = () => {
        setInputs(Array(5).fill(''))
    }

    const handleTokenInputsChange = (value: string, index: number) => {
        const newInputs = [...inputs]
        newInputs[index] = value

        if (value.length === 1 && index < inputs.length - 1) {
            const nextInput = document.getElementById(`input-${index + 1}`)
            nextInput?.focus()
        }

        setInputs(newInputs)

        if (newInputs.every((input) => input.length === 1)) {
            fetchValidateToken(newInputs)
        }
    }

    const fetchValidateToken = async (inputValues: string[]) => {
        const token = inputValues.join('')
        setApiLoading(true)
        toast.push(
            <Notification
                title={'Checking your entered token, please wait...'}
                type="info"
            />,
            {
                placement: 'top-center',
            }
        )
        try {
            const res = await apiVerifyChangeEmailWithToken(token)
            setApiLoading(false)
            setChangeEmailStep('finish')
            setTimeout(() => {
                signOut()
            }, 2000)
        } catch (error: any) {
            setChangeEmailStep('finish')
            setApiLoading(false)
            clearTokenInputs()
            return toast.push(
                <Notification
                    title={error.response.data.message}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
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
                        <Dialog
                            isOpen={emailModal}
                            onClose={() => {
                                setEmailModal(false)
                                setChangeEmailStep('')
                                setNewMail('')
                                clearTokenInputs()
                            }}
                            contentClassName="w-1/3 h-1/3"
                            closable={!apiLoading}
                        >
                            <h3 className="mb-8">
                                Change Email{' '}
                                {changeEmailStep === 'token' && 'Verification'}
                            </h3>
                            {changeEmailStep === '' && (
                                <section className="flex flex-col w-full gap-4">
                                    <div className="flex w-full gap-4 items-center">
                                        <p className="nowrap">New Email:</p>
                                        <Input
                                            disabled={apiLoading}
                                            type="email"
                                            value={newMail}
                                            onChange={(e) =>
                                                setNewMail(e.target.value)
                                            }
                                            placeholder="example@mail.com"
                                        />
                                    </div>
                                    <Button
                                        loading={apiLoading}
                                        onClick={handleRequestChangeEmail}
                                        type="button"
                                        className="w-fit mx-auto"
                                    >
                                        Send Verification
                                    </Button>
                                </section>
                            )}
                            {changeEmailStep === 'token' && (
                                <div className="flex flex-col gap-3">
                                    <p>
                                        We've sent a 5-digit code to your email.
                                        Please check your inbox (and spam
                                        folder, just in case!) and enter the
                                        code to continue. If you don’t receive
                                        the email shortly, you can request a new
                                        code.
                                    </p>

                                    <section className="flex w-full items-center justify-center gap-12 mt-4 mb-4">
                                        {inputs.map((value, index) => (
                                            <Input
                                                key={index}
                                                id={`input-${index}`}
                                                type="text"
                                                maxLength={1}
                                                disabled={apiLoading}
                                                value={value}
                                                onChange={(e) =>
                                                    handleTokenInputsChange(
                                                        e.target.value,
                                                        index
                                                    )
                                                }
                                                className="text-center border rounded-lg text-2xl text-white"
                                            />
                                        ))}
                                    </section>

                                    <p
                                        onClick={() => {
                                            if (
                                                canRequest &&
                                                apiLoading == false
                                            ) {
                                                handleRequestChangeEmail()
                                            }
                                        }}
                                        className={`${
                                            canRequest &&
                                            'cursor-pointer hover:underline'
                                        } ${
                                            apiLoading && 'text-gray-700'
                                        } w-fit`}
                                    >
                                        {canRequest
                                            ? 'You can request a new code now!'
                                            : `You can request a new code in ${seconds} seconds.`}
                                    </p>
                                </div>
                            )}
                            {changeEmailStep === 'finish' && (
                                <div className="flex flex-col items-center">
                                    <img
                                        className="self-center w-[200px] lg:w-[300px]"
                                        loading="lazy"
                                        src="/img/others/success.png"
                                    />
                                    <h3>
                                        Your email has been successfully
                                        changed!
                                    </h3>
                                </div>
                            )}
                        </Dialog>
                        {(loading === false && (
                            <FormContainer>
                                {/* <FormDesription
                                    title="General"
                                    desc="Basic info, like your name and avatar that will displayed in public"
                                /> */}
                                <FormRow
                                    name="firstName"
                                    label="First Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="firstName"
                                        placeholder="First name"
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
                                        placeholder="Last name"
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
                                    <section className="flex flex-col sm:flex-row w-full gap-6">
                                        <Field
                                            type="email"
                                            autoComplete="off"
                                            name="email"
                                            placeholder="Email"
                                            component={Input}
                                            prefix={
                                                <HiOutlineMail className="text-xl" />
                                            }
                                            disabled={true}
                                        />
                                        {apiData.google == false && (
                                            <>
                                                {(apiData.verificationStatus ==
                                                    'verified' && (
                                                    <Button
                                                        onClick={() =>
                                                            setEmailModal(true)
                                                        }
                                                        size="sm"
                                                        type="button"
                                                        variant="default"
                                                    >
                                                        Change
                                                    </Button>
                                                )) || (
                                                    <Button
                                                        onClick={
                                                            requestVerifyAccount
                                                        }
                                                        size="sm"
                                                        type="button"
                                                        variant="solid"
                                                        loading={apiLoading}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </section>
                                </FormRow>
                                <FormRow
                                    name="tel"
                                    label="Phone"
                                    {...validatorProps}
                                >
                                    <Field
                                        name="tel"
                                        state={phoneNumber}
                                        setState={setPhoneNumber}
                                        component={PhoneNumberSelector}
                                        prefix={<HiPhone className="text-xl" />}
                                    />
                                </FormRow>
                                <FormRow
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
                                        component={TimeZoneSelector}
                                        selectedTimeZone={selectedTimeZone}
                                        setSelectedTimeZone={
                                            setSelectedTimeZone
                                        }
                                        prefix={
                                            <HiOutlineGlobeAlt className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="avatar"
                                    label="Avatar"
                                    {...validatorProps}
                                >
                                    <div
                                        className={`flex w-full flex-col sm:flex-row gap-2 justify-around items-center`}
                                    >
                                        <Dialog
                                            isOpen={imageModal}
                                            onClose={() => setImageModal(false)}
                                            contentClassName="w-1/3 h-1/3"
                                            closable={true}
                                        >
                                            <h4 className="mb-8">
                                                Select Image
                                            </h4>
                                            <div className="flex mx-auto w-2/3 justify-between">
                                                <Upload
                                                    className="cursor-pointer"
                                                    showList={false}
                                                    uploadLimit={1}
                                                    accept=".png, .jpg, .jpeg"
                                                    onChange={handleFileChange}
                                                >
                                                    <Button className="flex items-center gap-2">
                                                        Upload{' '}
                                                        <HiUpload className="text-[1.2rem]" />
                                                    </Button>
                                                </Upload>
                                                <Button
                                                    onClick={() => {
                                                        setImageModal(false)
                                                        setSelectImageModal(
                                                            true
                                                        )
                                                    }}
                                                    className="flex items-center gap-2"
                                                >
                                                    Select{' '}
                                                    <HiDocument className="text-[1.2rem]" />
                                                </Button>
                                            </div>
                                            <div className="flex mt-4 mx-auto w-2/3 justify-between">
                                                <p>
                                                    <strong>
                                                        Image Upload
                                                        Requirements:
                                                    </strong>
                                                    <br />
                                                    <strong>
                                                        Format:
                                                    </strong>{' '}
                                                    PNG, JPEG, JPG <br />
                                                    <strong>Size:</strong>{' '}
                                                    200x200 pixels Maximum
                                                    <br />
                                                    <strong>
                                                        File size:
                                                    </strong>{' '}
                                                    500 KB
                                                </p>
                                            </div>
                                        </Dialog>
                                        <ServerImageDialog
                                            setImageSrc={setImageSrc}
                                            onClose={serverImageClose}
                                            state={selectImageModal}
                                        />

                                        <section
                                            className="cursor-pointer"
                                            onClick={() => setImageModal(true)}
                                        >
                                            {(!imageSrc && (
                                                <Avatar
                                                    className="!w-[100px] !h-[100px] border-2 border-white dark:border-gray-800 shadow-lg"
                                                    size={60}
                                                    shape="circle"
                                                    icon={
                                                        <HiOutlineUser className="text-5xl" />
                                                    }
                                                />
                                            )) || (
                                                <Avatar
                                                    className="!w-[100px] !h-[100px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg"
                                                    size={60}
                                                    shape="circle"
                                                    icon={
                                                        <img
                                                            src={imageSrc} // Assuming imageFile is replaced by imageSrc for handling images
                                                            alt="Uploaded Service Image"
                                                            style={{
                                                                objectFit:
                                                                    'cover',
                                                                width: '100px !important',
                                                                height: '100px !important',
                                                            }}
                                                        />
                                                    }
                                                />
                                            )}
                                        </section>

                                        <Button
                                            onClick={removeImageHandle}
                                            type="button"
                                            variant="solid"
                                            color="red"
                                            size="sm"
                                            disabled={
                                                (!imageSrc && true) || false
                                            }
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                </FormRow>

                                <div className="flex gap-4 justify-end mt-4 ltr:text-right">
                                    {/* <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => {
                                            resetForm()
                                        }}
                                    >
                                        Reset
                                    </Button> */}
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                        size="sm"
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
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Profile
