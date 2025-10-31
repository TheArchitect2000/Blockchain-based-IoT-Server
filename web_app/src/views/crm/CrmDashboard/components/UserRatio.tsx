import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import type { Emails } from '../store'
import { useEffect, useState } from 'react'
import { apiGetMyProfile } from '@/services/UserApi'
import { useNavigate } from 'react-router-dom'

type EmailSentProps = {
    data?: Partial<Emails>
    className?: string
}

const ProgressInfo = ({ precent }: { precent?: number }) => {
    return (
        <div>
            <h3 className="font-bold">{precent}%</h3>
        </div>
    )
}

const profileValues = [
    'walletAddress',
    'tel',
    'lastName',
    'firstName',
    'email',
    'avatar',
    'timezone',
]

const AddressValues = ['name', 'line_1', 'country', 'city', 'state', 'zipCode']

const EmailSent = ({ data = {}, className }: EmailSentProps) => {
    const [percent, setPercent] = useState(0)
    const navigateTo = useNavigate()

    useEffect(() => {
        async function fetchData() {
            let nowPercent = 2.5
            const resData = (await apiGetMyProfile()) as any
            if (resData?.data && resData?.data?.data) {
                profileValues?.forEach((item) => {
                    if (resData?.data?.data[item]) {
                        if (item === 'tel') {
                            if (
                                resData?.data?.data[item]?.countryCode !=
                                    null &&
                                resData?.data?.data[item]?.phoneNumber
                            ) {
                                nowPercent = nowPercent + 7.5
                            }
                        } else {
                            nowPercent = nowPercent + 7.5
                        }
                    }
                })
            }
            if (
                resData?.data &&
                resData?.data?.data &&
                resData?.data?.data?.address
            ) {
                AddressValues?.forEach((item) => {
                    if (resData?.data?.data?.address[item]) {
                        nowPercent = nowPercent + 7.5
                    }
                })
            }
            setPercent(nowPercent)
        }
        fetchData()
    }, [])

    return (
        <Card
            onClick={() => navigateTo('/account/settings/profile')}
            className={`${className} cursor-pointer`}
        >
            <h4>Your Profile</h4>
            <div className="mt-6">
                <Progress
                    variant="circle"
                    percent={percent}
                    width={200}
                    className="flex justify-center"
                    strokeWidth={4}
                    customInfo={<ProgressInfo precent={percent} />}
                />
            </div>
            <div className="text-center mt-6">
                <h4 className="w-2/3 mx-auto font-bold">
                    Complete Your Profile and Get a{' '}
                    <span className="text-[#00ff00]">Free</span> E-Card!
                </h4>
                <p className="font-semibold">
                    Finish filling out your profile, and we'll send a
                    complimentary e-card straight to your address.
                </p>
            </div>
        </Card>
    )
}

export default EmailSent
