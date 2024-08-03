import { Loading } from '@/components/shared'
import { Avatar, Button, Table } from '@/components/ui'
import Sorter from '@/components/ui/Table/Sorter'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import { apiGetAllUsers } from '@/services/UserApi'
import { UserData } from '@/utils/hooks/useGetCurUserProfile'
import DownloadCSVButton from '@/views/account/Settings/components/DownloadCsv'
import { formatISODate } from '@/views/allusers/components/UserTable'
import {
    ColumnDef,
    ColumnSort,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { HiCheck, HiUser, HiX } from 'react-icons/hi'

export default function AdminsList() {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<UserData[]>([])
    const [filteredData, setFilteredData] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [refresh, setRefresh] = useState(0)
    const [count, setCount] = useState(0)

    function refreshPage() {
        setRefresh(refresh + 1)
    }

    const handleSearch = (e: any) => {
        setSearchQuery(e.target.value)
        const searchFilteredData = data.filter(
            (user) =>
                `${user.firstName?.toLowerCase()} ${user.lastName?.toLowerCase()}`.includes(
                    e.target.value.toLowerCase()
                ) ||
                '' ||
                user._id
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                user.email
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                ''
        )
        setFilteredData(searchFilteredData)
    }

    const columns: ColumnDef<UserData>[] = [
        {
            header: 'profile',
            accessorKey: 'profile',
            cell: (props) => {
                const row = props.row.original as any
                return (
                    <Avatar
                        className="!w-[60px] !h-[60px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg"
                        size={60}
                        shape="circle"
                    >
                        {(row.avatar && (
                            <img
                                className="allusers-profile"
                                src={row.avatar}
                            />
                        )) || (
                            <span className="text-3xl">
                                <HiUser />
                            </span>
                        )}
                    </Avatar>
                )
            },
        },
        {
            header: 'Email',
            accessorKey: 'email',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.email}</span>
            },
        },
        {
            header: 'Super Admin',
            accessorKey: '',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.roles.some(
                            (role: any) => role.name == 'super_admin'
                        ) && <HiCheck className="text-[1.5rem]" />) || (
                            <HiX className="text-[1.5rem]" />
                        )}
                    </span>
                )
            },
        },
        {
            header: 'User Admin',
            accessorKey: '',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.roles.some(
                            (role: any) => role.name == 'user_admin'
                        ) && <HiCheck className="text-[1.5rem]" />) || (
                            <HiX className="text-[1.5rem]" />
                        )}
                    </span>
                )
            },
        },
        {
            header: 'Device Admin',
            accessorKey: '',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.roles.some(
                            (role: any) => role.name == 'device_admin'
                        ) && <HiCheck className="text-[1.5rem]" />) || (
                            <HiX className="text-[1.5rem]" />
                        )}
                    </span>
                )
            },
        },
        {
            header: 'Service Admin',
            accessorKey: '',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.roles.some(
                            (role: any) => role.name == 'service_admin'
                        ) && <HiCheck className="text-[1.5rem]" />) || (
                            <HiX className="text-[1.5rem]" />
                        )}
                    </span>
                )
            },
        },
        {
            header: 'Request Admin',
            accessorKey: '',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.roles.some(
                            (role: any) => role.name == 'request_admin'
                        ) && <HiCheck className="text-[1.5rem]" />) || (
                            <HiX className="text-[1.5rem]" />
                        )}
                    </span>
                )
            },
        },
        {
            header: 'Notification Admin',
            accessorKey: '',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.roles.some(
                            (role: any) => role.name == 'notification_admin'
                        ) && <HiCheck className="text-[1.5rem]" />) || (
                            <HiX className="text-[1.5rem]" />
                        )}
                    </span>
                )
            },
        },
    ]

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    useEffect(() => {
        setLoading(true)
        async function fetchUsers() {
            const response = (await apiGetAllUsers()) as any
            const data = (await response?.data?.data?.filter(
                (user: UserData) =>
                    user.roles.some((role) => role.department == 'admins') ==
                    true
            )) as any
            setData(data)
            setFilteredData(data)
            setCount(data.length)
            setLoading(false)
            if (searchQuery.toString().length > 0) {
                handleSearch({
                    target: {
                        value: searchQuery,
                    },
                })
            }
        }
        fetchUsers()
    }, [refresh])

    return (
        <main className='p-6'>
            <h3 className='mb-6'>All Admins List ( {count} )</h3>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border rounded-xl w-4/12 p-2"
                />
                <div className="flex gap-4">
                    <Button disabled={loading} onClick={refreshPage}>
                        Refresh
                    </Button>
                    <DownloadCSVButton
                        disabled={loading}
                        fileName="Users"
                        data={filteredData}
                    />
                </div>
            </div>
            {(loading === false && (
                <Table rowsPerPage={10}>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className:
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                        onClick:
                                                            header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <Sorter
                                                            sort={header.column.getIsSorted()}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </TBody>
                </Table>
            )) || (
                <div className="w-full h-full flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}
            {loading === false && filteredData.length === 0 && (
                <div className="w-full h-full flex justify-center items-center">
                    <h1>Data not found !</h1>
                </div>
            )}
        </main>
    )
}
