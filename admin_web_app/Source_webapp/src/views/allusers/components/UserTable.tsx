import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { UserData } from '@/utils/hooks/useGetDevices'
import {
    apiDeleteUserById,
    apiGetAllUsers,
    apiGetUserProfileByEmail,
} from '@/services/UserApi'
import { Loading } from '@/components/shared'
import DownloadCSVButton from '@/views/account/Settings/components/DownloadCsv'
import { Avatar, Button, Dialog, Notification, toast } from '@/components/ui'
import { HiTrash, HiUser } from 'react-icons/hi'
import PaginatedList from '@/views/market/components/PaginationList'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface UsersTableProps {
    setCount: (count: number) => void
}

export function formatISODate(isoDate: string) {
    // Create a new Date object from the ISO string
    const date = new Date(isoDate)

    // Extract date components
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0')

    // Extract time components
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    // Format the date and time
    const formattedDate = `${year}-${month}-${day}`
    const formattedTime = `${hours}:${minutes}:${seconds}`

    // Combine date and time with a comma
    return `${formattedDate} , ${formattedTime}`
}

const UsersTable: React.FC<UsersTableProps> = ({ setCount }) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<UserData[]>([])
    const [filteredData, setFilteredData] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [refresh, setRefresh] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteData, setDeleteData] = useState<any>({})

    const ActionColumn = ({ row }: { row: any }) => {
        async function handleDeleteDevice() {
            const res = (await apiDeleteUserById(deleteData._id)) as any
            setDeleteDialog(false)
            refreshPage()
            if (res?.data?.success) {
                toast.push(
                    <Notification
                        title={'User deleted successfully'}
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                toast.push(
                    <Notification
                        title={'Error while deleting User'}
                        type="danger"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        }

        return (
            <div className="flex justify-end text-lg">
                <Dialog
                    isOpen={deleteDialog}
                    onClose={() => setDeleteDialog(false)}
                >
                    <h3 className="mb-8">Delete Device</h3>
                    <p className="text-center text-[1.1rem] mb-6">
                        Are you sure about deleting '{deleteData.email}' device
                        ?
                    </p>
                    <div className="flex w-2/3 mx-auto justify-between">
                        <Button
                            onClick={handleDeleteDevice}
                            variant="solid"
                            color="red"
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => setDeleteDialog(false)}
                            variant="solid"
                            color="green"
                        >
                            Cancel
                        </Button>
                    </div>
                </Dialog>
                <span
                    className="cursor-pointer p-2 hover:${textTheme}"
                    onClick={() => {
                        setDeleteData(row)
                        setDeleteDialog(true)
                    }}
                >
                    <HiTrash />
                </span>
            </div>
        )
    }

    function refreshPage() {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        setLoading(true)
        async function fetchUsers() {
            const response = await apiGetAllUsers()
            const data = response.data as any
            setData(data.data)
            setFilteredData(data.data)
            setCount(data.data.length)
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
                '' ||
                user.mobile
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                'Not-Verified'
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                user.creationDate
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                ''
        )
        setFilteredData(searchFilteredData)
    }

    const columns: ColumnDef<UserData>[] = [
        {
            header: '_id',
            accessorKey: '_id',
            cell: (props) => {
                const row = props.row.original
                return <span>{row._id}</span>
            },
        },
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
                        src={row.avatar}
                    >
                        {!row.avatar && (
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
            header: 'First Name',
            accessorKey: 'firstName',
            cell: (props) => {
                const row = props.row.original
                return row.firstName && <span>{row.firstName}</span>
            },
        },
        {
            header: 'Last Name',
            accessorKey: 'lastName',
            cell: (props) => {
                const row = props.row.original
                return row.lastName && <span>{row.lastName}</span>
            },
        },

        {
            header: 'Mobile',
            accessorKey: 'mobile',
            cell: (props) => {
                const row = props.row.original
                return <span>{(row.mobile && row.mobile) || '_'}</span>
            },
        },

        {
            header: 'status',
            accessorKey: 'activationStatus',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.activationStatus == 'active' && 'Verified') ||
                            'Not-Verified'}
                    </span>
                )
            },
        },

        {
            header: 'Creation Date',
            accessorKey: 'insertDate',
            cell: (props) => {
                const row = props.row.original as any
                return <span>{formatISODate(row.insertDate)}</span>
            },
        },

        {
            header: '',
            id: 'action',
            cell: (props) => <ActionColumn row={props.row.original} />,
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

    return (
        <>
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
        </>
    )
}

export default UsersTable
