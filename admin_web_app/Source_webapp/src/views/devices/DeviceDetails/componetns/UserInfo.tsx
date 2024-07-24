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
        console.log(profileData)

        if (profileData?.tel && profileData?.tel?.countryCode) {
            setNumber(
                `${profileData.tel?.countryCode.value} ${profileData.tel?.phoneNumber}`
            )
        }
    }, [])

    return (
        <Card bordered={false}>
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
                    <h4 className="font-bold">{`${
                        (profileData?.firstName && profileData?.firstName) ||
                        'First Name'
                    } ${
                        (profileData?.lastName && profileData?.lastName) ||
                        'Last Name'
                    }`}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
                    <CustomerInfoField
                        title="Email"
                        value={profileData?.email || 'No email found'}
                    />
                    <CustomerInfoField
                        title="Tel"
                        value={number || 'No tel number found'}
                    />
                    <CustomerInfoField
                        title="Timezone"
                        value={profileData?.timezone || 'No timezone found'}
                    />
                    <CustomerInfoField
                        title="Country"
                        value={
                            profileData?.address?.country || 'No country found'
                        }
                    />
                    <CustomerInfoField
                        title="Address Line 1"
                        value={
                            profileData?.address?.line_1 || 'No address found'
                        }
                    />

                    <div className="w-full justify-between flex">
                        <CustomerInfoField
                            title="City"
                            value={
                                profileData?.address?.city || 'No city found'
                            }
                        />
                        <CustomerInfoField
                            title="State"
                            value={
                                profileData?.address?.state ||
                                'No state found'
                            }
                        />

                        <CustomerInfoField
                            title="ZipCode"
                            value={
                                profileData?.address?.zipCode ||
                                'No zipcode found'
                            }
                        />
                    </div>
                    {/* 
                    city : "gojestan" 
                    country : "United Arab Emirates" 
                    line_1 :"no where" 
                    line_2 : "my house" 
                    state : "111" 
                    zipCode : "222" */}
                    {/* <CustomerInfoField title="Location" value="London, UK" /> */}
                    {/* <CustomerInfoField
                        title="Date of birth"
                        value={data.personalInfo?.birthday}
                    />
                    <CustomerInfoField
                        title="Title"
                        value={data.personalInfo?.title}
                    /> */}
                    {/* <div className="mb-7">
                        <span>Social</span>
                        <div className="flex mt-4">
                            <Button
                                className="mr-2"
                                shape="circle"
                                size="sm"
                                icon={
                                    <FaFacebookF className="text-[#1773ea]" />
                                }
                            />
                            <Button
                                className="mr-2"
                                shape="circle"
                                size="sm"
                                icon={<FaTwitter className="text-[#1da1f3]" />}
                            />
                            <Button
                                className="mr-2"
                                shape="circle"
                                size="sm"
                                icon={
                                    <FaLinkedinIn className="text-[#0077b5]" />
                                }
                            />
                            <Button
                                className="mr-2"
                                shape="circle"
                                size="sm"
                                icon={
                                    <FaPinterestP className="text-[#df0018]" />
                                }
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </Card>
    )
}

export default UserInfo
