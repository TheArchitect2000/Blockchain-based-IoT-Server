import classNames from 'classnames'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import isLastChild from '@/utils/isLastChild'
import {
    HiCheck,
    HiOutlineDesktopComputer,
    HiOutlineDeviceMobile,
    HiOutlineDeviceTablet,
} from 'react-icons/hi'
import dayjs from 'dayjs'
import * as Yup from 'yup'
import {
    apiChangePasswordByEmail,
    apiGetCurUserProfile,
    apiRequestVerifyEmail,
} from '@/services/UserApi'
import { apiCheckPassword } from '@/services/AuthService'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'

type LoginHistory = {
    type: string
    deviceName: string
    time: number
    location: string
}

type PasswordFormModel = {
    password: string
    newPassword: string
    confirmNewPassword: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password Required'),
    newPassword: Yup.string()
        .required('Enter your new password')
        .matches(/^[A-Za-z0-9_-]*$/, 'Only Letters & Numbers Allowed'),
    confirmNewPassword: Yup.string()
        .required('Enter your confirm password')
        .oneOf([Yup.ref('newPassword'), ''], 'Password not match'),
})

const Password = () => {
    const [apiData, setApiData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const [requestLoading, setRequestLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetCurUserProfile()) as any
            setApiData(resData.data.data)
            console.log(resData.data.data)
            setLoading(false)
        }
        fetchData()
    }, [])

    async function requestVerifyAccount() {
        setRequestLoading(true)
        try {
            const res = await apiRequestVerifyEmail(apiData?.userName || '')
            if (res) {
                toast.push(
                    <Notification title="Success" type="success">
                        The verification link has been successfully sent to your
                        email
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Failed" type="danger">
                    The verification link has already been sent
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
        setRequestLoading(false)
    }

    return (
        <>
            {(loading == false && (
                <main>
                    {(apiData?.verificationStatus == 'verified' && (
                        <div className="flex flex-col gap-1">
                            <h3>Verify your account</h3>
                            <p>
                                By clicking this button it will send you an
                                verification link to your email
                            </p>
                            <h3 className="flex flex-col justify-center items-center gap-2 mt-6">
                                <img
                                    className="self-center w-[200px] lg:w-[300px]"
                                    loading="lazy"
                                    src="/img/others/success.png"
                                />
                                Your account is already verfied{' '}
                            </h3>
                        </div>
                    )) || (
                        <div className="flex flex-col gap-1">
                            <h3>Verify your account</h3>
                            <p>
                                By clicking this button it will send you an
                                verification link to your email
                            </p>
                            <Button
                                onClick={requestVerifyAccount}
                                className="mx-auto mt-10"
                                variant="solid"
                                loading={requestLoading}
                            >
                                Send verification link
                            </Button>
                        </div>
                    )}
                </main>
            )) || (
                <div className="w-full h-[60dvh]">
                    <Loading loading={true} />
                </div>
            )}
        </>
    )
}

export default Password
