import { Button, Checkbox, Input, Notification, toast } from '@/components/ui'
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
        { short: 'super', roleName: 'super_admin' },
        { short: 'user', roleName: 'user_admin' },
        { short: 'device', roleName: 'device_admin' },
        { short: 'service', roleName: 'service_admin' },
        { short: 'request', roleName: 'request_admin' },
        { short: 'notification', roleName: 'notification_admin' },
    ]

    const [selected, setSelected] = useState<any>()
    const [searching, setSearching] = useState(false)
    const [apiCalling, setApiCalling] = useState(false)
    const [selectedRanks, setSelectedRanks] = useState<Array<string>>([])
    const [notSelectedRanks, setNotSelectedRanks] = useState<Array<string>>(
        adminRanks.map((rank) => rank.short)
    )

    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value)
    }

    async function cancelSearch() {
        setSelected(null)
        setInputValue('')
        setSelectedRanks([])
        setNotSelectedRanks(adminRanks.map((rank) => rank.short))
    }

    async function handleSearch() {
        if (!validateEmail(inputValue)) {
            return toast.push(
                <Notification title={'Enter a valid email'} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
        }
        try {
            setSearching(true)
            const res = (await apiGetUserProfileByEmail(inputValue)) as any
            if (
                !res ||
                !res.data ||
                !res.data.data ||
                res.data.data == null ||
                res.data.data == undefined
            ) {
                setSearching(false)
                return toast.push(
                    <Notification title={'User not found'} type="danger" />,
                    {
                        placement: 'top-center',
                    }
                )
            }

            const userDatas = res?.data?.data
            setSelected(userDatas)

            // Map full role names to short names
            const userRoles = userDatas.roles || []
            const userRolesShortNames = userRoles
                .map(
                    (role: any) =>
                        adminRanks.find((r) => r.roleName === role.name)?.short
                )
                .filter(Boolean) as string[]
            setSelectedRanks(userRolesShortNames)
            setNotSelectedRanks(
                adminRanks
                    .map((rank) => rank.short)
                    .filter((rank) => !userRolesShortNames.includes(rank))
            )

            setSearching(false)
        } catch (error) {
            toast.push(
                <Notification title={'User not found'} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
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
            toast.push(
                <Notification
                    title={`Ranks successfully gived to ${selected.email}`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            toast.push(
                <Notification
                    title={'Error while giving admin ranks'}
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
            <h3>Manage Admins</h3>
            <div className="flex flex-col lg:flex-row gap-10 ">
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
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
                <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 px-4 py-6 border border-gray-600 rounded-lg">
                    <h4 className='col-span-2 mb-2 mx-auto'> Rank Selection</h4>
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
                </div>
            </div>
        </section>
    )
}
