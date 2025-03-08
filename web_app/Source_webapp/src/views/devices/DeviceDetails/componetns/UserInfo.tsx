import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'
import { useEffect, useState } from 'react'

const CustomerInfoField = ({
    title,
    value,
}: {
    title: string
    value: string | number
}) => {
    return (
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {value}
            </p>
        </div>
    )
}

const UserInfo = ({ profileData }: { profileData: any }) => {
    const [number, setNumber] = useState('')

    useEffect(() => {
        if (profileData?.tel && profileData?.tel?.countryCode) {
            setNumber(
                `${profileData.tel?.countryCode.value} ${profileData.tel?.phoneNumber}`
            )
        }
    }, [])

    return (
        <Card className="w-full bg-red-500" bodyClass="w-full" bordered={false}>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-col items-center gap-4">
                    <Avatar
                        className="overflow-hidden"
                        size={90}
                        shape="circle"
                        icon={
                            (profileData.avatar && (
                                <img src={profileData.avatar} />
                            )) || <HiOutlineUser />
                        }
                    />
                    {(profileData &&
                        (profileData?.firstName || profileData?.lastName) && (
                            <h4 className="font-bold">{`${
                                profileData?.firstName || ''
                            } ${profileData?.lastName || ''}`}</h4>
                        )) || <h4>User</h4>}
                </div>
                <div className="grid grid-cols-2 gap-y-7 gap-x-4 mt-8">
                    <CustomerInfoField
                        title="Email"
                        value={profileData?.email || 'Not provided'}
                    />
                    <CustomerInfoField
                        title="Phone"
                        value={number || 'Not provided'}
                    />
                    <CustomerInfoField
                        title="Timezone"
                        value={profileData?.timezone || 'Not provided'}
                    />
                    <CustomerInfoField
                        title="Country"
                        value={profileData?.address?.country || 'Not provided'}
                    />
                    <CustomerInfoField
                        title="Address Line 1"
                        value={profileData?.address?.line_1 || 'Not provided'}
                    />

                    <CustomerInfoField
                        title="City"
                        value={profileData?.address?.city || 'Not provided'}
                    />
                    <CustomerInfoField
                        title="State"
                        value={profileData?.address?.state || 'Not provided'}
                    />

                    <CustomerInfoField
                        title="ZipCode"
                        value={profileData?.address?.zipCode || 'Not provided'}
                    />
                </div>
            </div>
        </Card>
    )
}

export default UserInfo
