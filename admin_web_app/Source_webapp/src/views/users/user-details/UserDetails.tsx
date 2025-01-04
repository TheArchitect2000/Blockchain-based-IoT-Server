import { Loading } from '@/components/shared'
import { Avatar, Checkbox, Input, Notification, toast } from '@/components/ui'
import {
    apiGetUserProfileByUserId,
    apiGiveUserAdminRank,
    apiTakeUserAdminRank,
} from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { HiBadgeCheck, HiUser } from 'react-icons/hi'
import { useParams } from 'react-router-dom'

function capitalizeFirstLetter(string: string) {
    if (!string) return '' // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function UserDetails() {
    const [apiLoading, setApiLoading] = useState<boolean>(true)
    const [developerLoading, setDeveloperLoading] = useState<boolean>(false)
    const [userData, setUserData] = useState<any>()
    const { userId } = useParams()

    async function fetchData() {
        setApiLoading(true)
        try {
            const res = (await apiGetUserProfileByUserId(String(userId))) as any
            setUserData(res.data.data)
        } catch (error: any) {
            toast.push(
                <Notification
                    title={
                        error.response?.data?.message || 'Error loading data'
                    }
                    type="danger"
                />,
                { placement: 'top-center' }
            )
        } finally {
            setApiLoading(false)
        }
    }

    function isDeveloper() {
        return userData.roles.some(
            (theRole: any) =>
                theRole.name == 'company_developer' ||
                theRole.label == 'company_developer' ||
                theRole.department == 'company_developer'
        )
    }

    async function changeUserDeveloper(checked: boolean) {
        setDeveloperLoading(true)
        if (checked) {
            await apiGiveUserAdminRank(userData.email, ['cm_developer'])
            toast.push(
                <Notification
                    title={`User has been successfully granted the 'Company Developer' rank.`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            await apiTakeUserAdminRank(userData.email, ['cm_developer'])
            toast.push(
                <Notification
                    title={`The 'Company Developer' rank has been successfully removed from the user.`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
        await fetchData()
        setDeveloperLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [userId])

    if (apiLoading) {
        return (
            <main className="w-full h-screen flex items-center justify-center">
                <Loading loading={true} />
            </main>
        )
    }

    return (
        <div className="p-6 max-w-5xl mx-auto shadow-xl rounded-md">
            <header className="w-full flex items-center space-x-4 mb-6">
                <Avatar
                    className="!w-[60px] !h-[60px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg"
                    size={60}
                    shape="circle"
                    src={userData.avatar}
                >
                    {!userData.avatar && (
                        <span className="text-3xl">
                            <HiUser />
                        </span>
                    )}
                </Avatar>

                <div>
                    <h2 className="text-xl font-semibold">
                        {userData.firstName || 'N/A'}{' '}
                        {userData.lastName || 'N/A'}
                    </h2>
                    <p className="text-gray-500">{userData.email}</p>
                    <p
                        className={`text-sm ${
                            userData.activationStatus === 'inactive'
                                ? 'text-red-500'
                                : 'text-green-500'
                        }`}
                    >
                        Status: {userData.activationStatus}
                    </p>
                </div>
                <div className="!ml-auto flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Developer:</h2>
                    <Checkbox
                        disabled={developerLoading}
                        defaultChecked={isDeveloper()}
                        onChange={changeUserDeveloper}
                        id="admin_developer_checkbox"
                    />
                </div>
            </header>

            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                        <strong>Phone:</strong>{' '}
                        {userData.tel?.countryCode?.value}{' '}
                        {userData.tel?.phoneNumber || 'N/A'}
                    </p>
                    <p>
                        <strong>Time Zone:</strong> {userData.timezone || 'N/A'}
                    </p>
                    <div>
                        <p>
                            <strong>Address:</strong>{' '}
                            {[
                                userData.address?.line_1,
                                userData.address?.line_2,
                                userData.address?.city,
                                userData.address?.state,
                                userData.address?.country,
                            ]
                                .filter(Boolean)
                                .join(', ') || 'N/A'}
                            {userData.address?.zipCode
                                ? ` - ${userData.address.zipCode}`
                                : ''}
                        </p>
                    </div>
                    <div>
                        <p>
                            <strong>Company:</strong>{' '}
                            {[
                                userData.company?.line_1,
                                userData.company?.line_2,
                                userData.company?.city,
                                userData.company?.state,
                                userData.company?.country,
                            ]
                                .filter(Boolean)
                                .join(', ') || 'N/A'}
                            {userData.company?.zipCode
                                ? ` - ${userData.company.zipCode}`
                                : ''}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    Roles & Permissions
                </h3>
                {userData.roles?.map((role: any, index: number) => (
                    <div
                        key={role._id || index}
                        className="p-4 border rounded-md mb-4"
                    >
                        <p>
                            <strong>Role:</strong>{' '}
                            {capitalizeFirstLetter(
                                String(role.label).split('_')[0]
                            )}{' '}
                            {capitalizeFirstLetter(
                                String(role.label).split('_')[1]
                            )}
                        </p>
                        <p>
                            <strong>Department:</strong> {role.department}
                        </p>
                        <p>
                            <strong>Status:</strong> {role.activationStatus}
                        </p>
                        <h4 className="text-sm font-semibold mt-2">
                            Permissions:
                        </h4>
                        <ul className="list-disc list-inside text-sm">
                            {role.permissions?.map((perm: any, idx: number) => (
                                <li key={perm._id || idx}>
                                    {perm.label} - {perm.name.replace('_', ' ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">
                    Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                        <strong>Joined On:</strong>{' '}
                        {new Date(userData.insertDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Last Updated:</strong>{' '}
                        {new Date(userData.updateDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Wallet Address:</strong>{' '}
                        {userData.walletAddress || 'N/A'}
                    </p>
                    <p className="flex gap-1 items-center">
                        <strong>Verification Status:</strong>{' '}
                        {userData.verificationStatus}{' '}
                        {userData.verificationStatus == 'verified' && (
                            <HiBadgeCheck className="text-blue-500" />
                        )}
                    </p>
                </div>
            </section>
        </div>
    )
}
