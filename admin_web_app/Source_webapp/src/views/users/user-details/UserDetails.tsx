import { Loading } from '@/components/shared'
import { Avatar, Notification, toast } from '@/components/ui'
import { apiGetUserProfileByUserId } from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { HiBadgeCheck, HiUser } from 'react-icons/hi'
import { useParams } from 'react-router-dom'

export default function UserDetails() {
    const [apiLoading, setApiLoading] = useState<boolean>(true)
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
        <div className="p-6 max-w-5xl mx-auto shadow-md rounded-md">
            <header className="flex items-center space-x-4 mb-6">
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
            </header>

            <section className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p>
                            <strong>Phone:</strong>{' '}
                            {userData.tel?.countryCode?.value}{' '}
                            {userData.tel?.phoneNumber || 'N/A'}
                        </p>
                        <p>
                            <strong>Time Zone:</strong>{' '}
                            {userData.timezone || 'N/A'}
                        </p>
                    </div>
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
                            <strong>Role:</strong> {role.label} ({role.name})
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
                                    {perm.label} - {perm.name}
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
