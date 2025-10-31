import {
    Button,
    Checkbox,
    Dropdown,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import {
    apiGetUserProfileByEmail,
    apiGiveUserAdminRank,
    apiTakeUserAdminRank,
} from '@/services/UserApi'
import { useState } from 'react'

function formatRankString(str: string) {
    return str
        .split('_') // Split the string by underscores
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize the first letter of each word
        .join(' ') // Join the words with a space
}

function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export default function MakeAdmin() {
    const adminRanks = [
        { short: 'user', roleName: 'user_admin' },
        { short: 'device', roleName: 'device_admin' },
        { short: 'service', roleName: 'service_admin' },
        { short: 'request', roleName: 'request_admin' },
        { short: 'notification', roleName: 'notification_admin' },
        //{ short: 'super', roleName: 'super_admin' },
        //{ short: 'cm_developer', roleName: 'company_developer' },
    ]
    const reverseDeveloperRoleMap = {
        None: 'None',
        'Developer A': 'cmd_a',
        'Developer B': 'cmd_b',
        'Developer C': 'cmd_c',
    }
    const [developerLoading, setDeveloperLoading] = useState<boolean>(false)
    const [selected, setSelected] = useState<any>()
    const [searching, setSearching] = useState(false)
    const [apiCalling, setApiCalling] = useState(false)
    const [selectedRanks, setSelectedRanks] = useState<Array<string>>([])
    const [inputValue, setInputValue] = useState('')
    const [notSelectedRanks, setNotSelectedRanks] = useState<Array<string>>(
        adminRanks.map((rank) => rank.short)
    )
    type DeveloperRole = keyof typeof reverseDeveloperRoleMap

    // Initialize state with the correct type
    const [tempDeveloperRole, setTempDeveloperRole] =
        useState<DeveloperRole>('None')

    // Map internal keys to display names
    const developerRoleMap = {
        None: 'None',
        cmd_a: 'Developer A',
        cmd_b: 'Developer B',
        cmd_c: 'Developer C',
    }

    // Map display names back to internal keys

    function getDeveloperRole(customSelected?: any) {
        let selectedUser
        if (customSelected) {
            selectedUser = customSelected
        } else {
            selectedUser = selected
        }
        if (
            selectedUser?.roles?.some(
                (role: any) =>
                    role.name === 'company_developer_a' ||
                    role.label === 'company_developer_a'
            )
        ) {
            return 'Developer A'
        } else if (
            selectedUser?.roles?.some(
                (role: any) =>
                    role.name === 'company_developer_b' ||
                    role.label === 'company_developer_b'
            )
        ) {
            return 'Developer B'
        } else if (
            selectedUser?.roles?.some(
                (role: any) =>
                    role.name === 'company_developer_c' ||
                    role.label === 'company_developer_c'
            )
        ) {
            return 'Developer C'
        }
        return 'None'
    }

    async function changeUserDeveloper(selectedRole: DeveloperRole) {
        setTempDeveloperRole(selectedRole) // Update temporary state with display name
    }

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value)
    }

    async function cancelSearch() {
        setSelected(null)
        setInputValue('')
        setSelectedRanks([])
        setNotSelectedRanks(adminRanks.map((rank) => rank.short))
        setTempDeveloperRole('None') // Reset temporary developer role
    }

    async function handleSearch() {
        if (!validateEmail(inputValue)) {
            return toast.push(
                <Notification title={'Enter a valid email'} type="danger" />,
                { placement: 'top-center' }
            )
        }
        try {
            setSearching(true)
            const res = (await apiGetUserProfileByEmail(inputValue)) as any

            if (!res?.data?.data) {
                setSearching(false)
                return toast.push(
                    <Notification title={'User not found'} type="danger" />,
                    { placement: 'top-center' }
                )
            }

            const userDatas = res.data.data
            setSelected(userDatas)

            const userRoles = userDatas.roles || []

            // Check if user has 'super_admin' role
            const isSuperAdmin = userRoles.some(
                (role: any) => role.name === 'super_admin'
            )

            if (isSuperAdmin) {
                // Select all ranks if super_admin
                setSelectedRanks(adminRanks.map((rank) => rank.short))
                setNotSelectedRanks([]) // Nothing left unselected
            } else {
                // Map assigned roles to short names
                const userRolesShortNames = userRoles
                    .map(
                        (role: any) =>
                            adminRanks.find((r) => r.roleName === role.name)
                                ?.short
                    )
                    .filter(Boolean) as string[]

                setSelectedRanks(userRolesShortNames)
                setNotSelectedRanks(
                    adminRanks
                        .map((rank) => rank.short)
                        .filter((rank) => !userRolesShortNames.includes(rank))
                )
            }

            // Set the temporary developer role based on the user's current role
            setTempDeveloperRole(getDeveloperRole(userDatas))

            toast.push(<Notification title={'User selected'} type="info" />, {
                placement: 'top-center',
            })

            setSearching(false)
        } catch (error) {
            toast.push(
                <Notification title={'User not found'} type="danger" />,
                { placement: 'top-center' }
            )
            setSearching(false)
        }
    }

    const handleCheckboxChange = (shortName: string) => {
        setSelectedRanks((prevRanks) => {
            const newSelectedRanks = prevRanks.includes(shortName)
                ? prevRanks.filter((rank) => rank !== shortName)
                : [...prevRanks, shortName]

            setNotSelectedRanks(
                adminRanks
                    .map((rank) => rank.short)
                    .filter((rank) => !newSelectedRanks.includes(rank))
            )

            return newSelectedRanks
        })
    }

    async function handleRankApply() {
        try {
            setApiCalling(true)
            await apiGiveUserAdminRank(selected.email, selectedRanks)
            await apiTakeUserAdminRank(selected.email, notSelectedRanks)

            // Handle developer role change
            if (tempDeveloperRole !== getDeveloperRole()) {
                setDeveloperLoading(true)
                const selectedRoleKey =
                    reverseDeveloperRoleMap[tempDeveloperRole]

                if (selectedRoleKey === 'None') {
                    await apiTakeUserAdminRank(selected.email, [
                        'cm_developer',
                        'cmd_a',
                        'cmd_b',
                        'cmd_c',
                    ])
                } else {
                    await apiTakeUserAdminRank(selected.email, [
                        'cmd_a',
                        'cmd_b',
                        'cmd_c',
                    ])
                    await apiGiveUserAdminRank(selected.email, [
                        'cm_developer',
                        selectedRoleKey,
                    ])
                }
                setDeveloperLoading(false)
            }

            toast.push(
                <Notification
                    title={`Roles successfully applied to ${selected.email}`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            toast.push(
                <Notification
                    title={'Error while applying admin roles'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
        setApiCalling(false)
    }

    return (
        <section className="w-full p-6 flex flex-col gap-4">
            <h3>Manage Roles</h3>
            <div className="flex flex-col-reverse lg:flex-row gap-10 ">
                <div className="w-full xl:w-3/5 max-w-[800px] flex flex-col sm:grid sm:grid-cols-2 gap-4 px-4 py-6 border border-gray-600 rounded-lg">
                    <h4 className="col-span-2 mb-2 mx-auto">Role Selection</h4>
                    {adminRanks.map((rank, index) => (
                        <div
                            key={index}
                            className="flex mx-auto justify-start items-center gap-2"
                        >
                            <label
                                className="text-[1.1rem] font-bold"
                                htmlFor={rank.short}
                            >
                                {formatRankString(rank.roleName)}
                            </label>
                            <Checkbox
                                checked={selectedRanks.includes(rank.short)}
                                onChange={() =>
                                    handleCheckboxChange(rank.short)
                                }
                                id={rank.short}
                                disabled={selected ? false : true}
                            />
                        </div>
                    ))}
                    <br />
                    <h4 className="col-span-2 mb-2 mx-auto">Developer Role</h4>
                    <div className="w-full flex items-center justify-center col-span-2">
                        <Dropdown
                            disabled={
                                developerLoading || selected ? false : true
                            }
                            renderTitle={
                                <span
                                    className={`text-[0.95rem] font-bold px-3 py-1 border rounded-md ${
                                        selected
                                            ? 'cursor-pointer'
                                            : 'cursor-not-allowed'
                                    }`}
                                >
                                    {tempDeveloperRole}
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
                                onClick={() =>
                                    changeUserDeveloper('Developer A')
                                }
                            >
                                Developer A
                            </Dropdown.Item>
                            <Dropdown.Item
                                eventKey="Developer B"
                                onClick={() =>
                                    changeUserDeveloper('Developer B')
                                }
                            >
                                Developer B
                            </Dropdown.Item>
                            <Dropdown.Item
                                eventKey="Developer C"
                                onClick={() =>
                                    changeUserDeveloper('Developer C')
                                }
                            >
                                Developer C
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                    <div className="col-span-2 w-full flex flex-col gap-4">
                        <Input
                            className="w-full"
                            type="email"
                            placeholder="admin.email@example.com"
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={searching || selected ? true : false}
                        />

                        <div className="w-full flex flex-col lg:flex-row gap-2 overflow-hidden">
                            <Button
                                onClick={handleSearch}
                                className="xl:w-1/3 w-full"
                                variant="solid"
                                disabled={selected ? true : false}
                                loading={searching}
                            >
                                Search
                            </Button>
                            <Button
                                onClick={handleRankApply}
                                className="xl:w-1/3 w-full"
                                variant="solid"
                                color="green"
                                disabled={selected ? false : true}
                                loading={apiCalling}
                            >
                                Apply
                            </Button>
                            <Button
                                onClick={cancelSearch}
                                className="xl:w-1/3 w-full"
                                variant="solid"
                                color="yellow"
                                disabled={selected ? false : true}
                                loading={apiCalling}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
