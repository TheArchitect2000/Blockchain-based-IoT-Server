import { Loading } from '@/components/shared'
import { Avatar, Dropdown, Notification, toast } from '@/components/ui'
import {
    apiGetUserProfileByUserId,
    apiGiveUserAdminRank,
    apiTakeUserAdminRank,
} from '@/services/UserApi'
import { useEffect, useState } from 'react'
import { HiBadgeCheck, HiUser } from 'react-icons/hi'
import { useParams } from 'react-router-dom'

function capitalizeFirstLetter(string: string) {
    if (!string) return ''
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

    function getDeveloperRole() {
        if (
            userData.roles.some(
                (role: any) =>
                    role.name === 'company_developer_a' ||
                    role.label === 'company_developer_a'
            )
        ) {
            return 'Developer A'
        } else if (
            userData.roles.some(
                (role: any) =>
                    role.name === 'company_developer_b' ||
                    role.label === 'company_developer_b'
            )
        ) {
            return 'Developer B'
        } else if (
            userData.roles.some(
                (role: any) =>
                    role.name === 'company_developer_c' ||
                    role.label === 'company_developer_c'
            )
        ) {
            return 'Developer C'
        }
        return 'None'
    }

    async function changeUserDeveloper(selectedRole: string) {
        setDeveloperLoading(true)
        try {
            if (String(selectedRole) == 'None') {
                await apiTakeUserAdminRank(userData.email, [
                    'cm_developer',
                    'cmd_a',
                    'cmd_b',
                    'cmd_c',
                ])
            } else {
                await apiTakeUserAdminRank(userData.email, [
                    'cm_developer',
                    'cmd_a',
                    'cmd_b',
                    'cmd_c',
                ])
                await apiGiveUserAdminRank(userData.email, [
                    'cm_developer',
                    selectedRole,
                ])
            }

            toast.push(
                <Notification
                    title={`User role changed to '${selectedRole}'.`}
                    type="success"
                />,
                { placement: 'top-center' }
            )

            await fetchData()
        } finally {
            setDeveloperLoading(false)
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
        <div className="p-6 max-w-5xl mx-auto shadow-xl rounded-md">
            <header className="w-full flex items-center  gap-4 mb-6">
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

                {/* Developer Role Dropdown */}
                <div className="!ml-auto flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Developer:</h2>
                    <Dropdown
                        disabled={developerLoading}
                        renderTitle={
                            <span className="px-3 py-1 border rounded-md cursor-pointer">
                                {getDeveloperRole()}
                            </span>
                        }
                        placement="bottom-end"
                    >
                        <Dropdown.Item
                            eventKey="None"
                            onClick={() => changeUserDeveloper('None')}
                        >
                            None
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="Developer A"
                            onClick={() => changeUserDeveloper('cmd_a')}
                        >
                            Developer A
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="Developer B"
                            onClick={() => changeUserDeveloper('cmd_b')}
                        >
                            Developer B
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="Developer C"
                            onClick={() => changeUserDeveloper('cmd_c')}
                        >
                            Developer C
                        </Dropdown.Item>
                    </Dropdown>
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
        </div>
    )
}
