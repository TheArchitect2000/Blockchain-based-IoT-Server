import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { InstalledServiceData } from '@/utils/hooks/useGetDevices'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineEye, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { Loading } from '@/components/shared'
import {
    apiDeleteInstalledServiceById,
    apiGetAllInstalledServices,
    apiGetInstalledServices,
} from '@/services/ServiceAPI'
import DownloadCSVButton from '@/views/account/Settings/components/DownloadCsv'
import { Button, Dialog, Notification, toast } from '@/components/ui'

const ActionColumn = ({ row }: { row: InstalledServiceData }) => {
    const navigate = useNavigate()

    const onView = () => {
        navigate(`/devices/${row._id}`)
    }

    return (
        <div className="flex justify-end text-lg">
            <span
                className="cursor-pointer p-2 hover:${textTheme}"
                onClick={onView}
            >
                <HiOutlineEye />
            </span>
        </div>
    )
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface UsersTableProps {
    setCount: (count: number) => void
}

const InstalledServicesTable: React.FC<UsersTableProps> = ({ setCount }) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<InstalledServiceData[]>([])
    const [filteredData, setFilteredData] = useState<InstalledServiceData[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteData, setDeleteData] = useState<any>({})

    const ActionColumn = ({ row }: { row: any }) => {
        async function handleDeleteDevice() {
            const res = (await apiDeleteInstalledServiceById(
                deleteData._id
            )) as any
            setDeleteDialog(false)
            refreshPage()
            if (res?.data?.success) {
                toast.push(
                    <Notification
                        title={'Installed service deleted successfully'}
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                toast.push(
                    <Notification
                        title={'Error while deleting installed service'}
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
            const response = await apiGetAllInstalledServices()
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
            (device: any) =>
                device.userId
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.serviceId
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.activationStatus
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.description
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.installedServiceName
                    ?.toString()
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                ''
        )
        setFilteredData(searchFilteredData)
    }

    const columns: ColumnDef<InstalledServiceData>[] = [
        {
            header: 'Name',
            accessorKey: 'installedServiceName',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.installedServiceName &&
                            row.installedServiceName) ||
                            '_'}
                    </span>
                )
            },
        },

        {
            header: 'Description',
            accessorKey: 'description',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>{(row.description && row.description) || '_'}</span>
                )
            },
        },

        {
            header: 'user Id',
            accessorKey: 'userId',
            cell: (props) => {
                const row = props.row.original as any
                return <span>{(row.userId && row.userId) || '_'}</span>
            },
        },

        {
            header: 'Service Id',
            accessorKey: 'serviceId',
            cell: (props) => {
                const row = props.row.original
                return <span>{(row.serviceId && row.serviceId) || '_'}</span>
            },
        },

        {
            header: 'Activation Status',
            accessorKey: 'activationStatus',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.activationStatus && row.activationStatus) || '_'}
                    </span>
                )
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
                        fileName="InstalledServices"
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

export default InstalledServicesTable
