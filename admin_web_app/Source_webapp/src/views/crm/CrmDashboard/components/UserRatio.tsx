import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import type { Emails } from '../store'
import { useEffect, useState } from 'react'
import { apiGetCurUserProfile } from '@/services/UserApi'

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
    'mobile',
    'lastName',
    'firstName',
    'email',
    'avatar',
]

const EmailSent = ({ data = {}, className }: EmailSentProps) => {
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        async function fetchData() {
            const resData = (await apiGetCurUserProfile()) as any
            let nowPercent = 1
            profileValues.forEach((item) => {
                if (resData.data.data[item]) {
                    nowPercent = nowPercent + 16.5
                }
            })
            setPercent(nowPercent)
        }
        fetchData()
    }, [])

    return (
        <Card className={className}>
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
                <h4 className="font-bold">Profile completion</h4>
                <p className="font-semibold">
                    In order to complete your profile, please provide us with
                    the required information.
                </p>
            </div>
        </Card>
    )
}

export default EmailSent
