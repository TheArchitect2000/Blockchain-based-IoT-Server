import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiGetCurUserProfile, apiRequestVerifyEmail } from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'
import FormDesription from './FormDesription'

const Verify = () => {
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
            const res = await apiRequestVerifyEmail(apiData?.email || '')
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
                    <div className="flex flex-col gap-1">
                        <FormDesription
                            title="Verify your account"
                            desc="By clicking this button it will send you an verification link to your email"
                        />
                        {(apiData?.verificationStatus == 'verified' && (
                            <h3 className="flex flex-col justify-center items-center gap-2 mt-6">
                                <img
                                    className="self-center w-[200px] lg:w-[300px]"
                                    loading="lazy"
                                    src="/img/others/success.png"
                                />
                                Your account has already been verified{' '}
                            </h3>
                        )) || (
                            <Button
                                onClick={requestVerifyAccount}
                                className="mx-auto mt-10"
                                variant="solid"
                                loading={requestLoading}
                            >
                                Send verification link
                            </Button>
                        )}
                    </div>
                </main>
            )) || (
                <div className="w-full h-[60dvh]">
                    <Loading loading={true} />
                </div>
            )}
        </>
    )
}

export default Verify
