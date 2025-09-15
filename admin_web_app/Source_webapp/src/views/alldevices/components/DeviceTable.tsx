import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { DeviceData, useGetDevices } from '@/utils/hooks/useGetDevices'
import Avatar from '@/components/ui/Avatar'
import {
    HiDocumentRemove,
    HiFolderRemove,
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineTrash,
    HiShare,
    HiTrash,
} from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import {
    getProducts,
    setTableData,
    setSelectedProduct,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import {
    apiDeleteDeviceById,
    apiGetAllDevices,
    apiGetDevices,
    apiUnshareDevice,
} from '@/services/DeviceApi'
import { Loading } from '@/components/shared'
import DownloadCSVButton from '@/views/account/Settings/components/DownloadCsv'
import { Button, Dialog, Notification, toast } from '@/components/ui'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface UsersTableProps {
    setCount: (count: number) => void
    superAdmin: boolean
}

const DevicesTable: React.FC<UsersTableProps> = ({ setCount, superAdmin }) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<DeviceData[]>([])
    const [filteredData, setFilteredData] = useState<DeviceData[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [apiloading, setApiLoading] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [unshareDialog, setUnshareDialog] = useState(false)
    const [deviceData, setDeviceData] = useState<DeviceData | null>(null)

    const ActionColumn = ({ row }: { row: DeviceData }) => {
        const navigate = useNavigate()

        const onView = () => {
            navigate(`/devices/${row?._id}`)
        }

        async function handleDeleteDevice() {
            const res = (await apiDeleteDeviceById(
                deviceData?._id || ''
            )) as any
            setDeleteDialog(false)
            refreshPage()
            if (res?.data?.success) {
                toast.push(
                    <Notification
                        title={'Device deleted successfully'}
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                toast.push(
                    <Notification
                        title={'Error while deleting device'}
                        type="danger"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }
        }

        async function handleUnshareDevice() {
            try {
                setApiLoading(true)
                const res = await apiUnshareDevice(String(deviceData?._id))
                if (res.status !== 200) {
                    toast.push(
                        <Notification
                            title={'Error while unsharing device'}
                            type="danger"
                        />,
                        {
                            placement: 'top-center',
                        }
                    )
                } else {
                    setApiLoading(false)
                    setUnshareDialog(false)
                    toast.push(
                        <Notification
                            title={'Device was successfully unshared.'}
                            type="success"
                        />,
                        {
                            placement: 'top-center',
                        }
                    )
                    refreshPage()
                }
            } catch (error: any) {
                setApiLoading(false)
                setUnshareDialog(false)
                return toast.push(
                    <Notification
                        title={error.response.data.message}
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
                    overlayClassName={'flex items-center'}
                    isOpen={unshareDialog}
                    closable={false}
                    onClose={() => setUnshareDialog(false)}
                >
                    <h3 className="mb-8">Unshare Device</h3>
                    <p className="text-center text-[1.1rem] mb-6">
                        Are you sure you want to unshare the device '
                        {deviceData?.deviceName}'?
                    </p>
                    <div className="flex w-2/3 mx-auto justify-between">
                        <Button
                            onClick={() => {
                                handleUnshareDevice()
                            }}
                            loading={apiloading}
                            variant="solid"
                            color="red"
                        >
                            Unshare
                        </Button>
                        <Button
                            onClick={() => setUnshareDialog(false)}
                            variant="solid"
                            loading={apiloading}
                            color="green"
                        >
                            Cancel
                        </Button>
                    </div>
                </Dialog>
                <Dialog
                    overlayClassName={'flex items-center'}
                    isOpen={deleteDialog}
                    closable={false}
                    onClose={() => setDeleteDialog(false)}
                >
                    <h3 className="mb-8">Delete Device</h3>
                    <p className="text-center text-[1.1rem] mb-6">
                        Are you sure about deleting '{deviceData?.deviceName}'
                        device ?
                    </p>
                    <div className="flex w-2/3 mx-auto justify-between">
                        <Button
                            onClick={() => {
                                handleDeleteDevice()
                            }}
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
                    onClick={onView}
                >
                    <HiOutlineEye />
                </span>
                <span
                    className="cursor-pointer p-2 hover:${textTheme}"
                    onClick={() => {
                        setDeviceData(row)
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
            const response = await apiGetAllDevices()
            let data = response.data as any
            data = data.data.filter(
                (item: any) =>
                    item.nodeDeviceId == null ||
                    item.nodeDeviceId == undefined ||
                    item.nodeDeviceId == 'undefined'
            )
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

    const handleSearch = (e: any) => {
        setSearchQuery(e.target.value)
        const searchFilteredData = data.filter(
            (device) =>
                device._id
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.deviceEncryptedId
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.deviceName
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.deviceType
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.mac
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                device.isShared
                    ?.toString()
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                ''
        )
        setFilteredData(searchFilteredData)
    }

    const columns: ColumnDef<DeviceData>[] = [
        {
            header: 'Name',
            accessorKey: 'deviceName',
            cell: (props) => {
                const row = props.row.original
                return <span>{(row.deviceName && row.deviceName) || '_'}</span>
            },
        },
        {
            header: 'Type',
            accessorKey: 'deviceType',
            cell: (props) => {
                const row = props.row.original
                return <span>{(row.deviceType && row.deviceType) || '_'}</span>
            },
        },
        {
            header: 'Mac',
            accessorKey: 'mac',
            cell: (props) => {
                const row = props.row.original
                return <span>{(row.mac && row.mac) || '_'}</span>
            },
        },
        {
            header: 'EncryptedId',
            accessorKey: 'deviceEncryptedId',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span>
                        {(row.deviceEncryptedId && row.deviceEncryptedId) ||
                            '_'}
                    </span>
                )
            },
        },
        {
            header: '_id',
            accessorKey: '_id',
            cell: (props) => {
                const row = props.row.original
                return <span>{(row._id && row._id) || '_'}</span>
            },
        },

        {
            header: 'Is Shared',
            accessorKey: 'isShared',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span className={`relative flex gap-4`}>
                        {(row?.isShared && row.isShared.toString()) || '_'}

                        {row?.isShared && superAdmin && (
                            <div
                                className="relative cursor-pointer"
                                onClick={() => {
                                    setDeviceData(row)
                                    setUnshareDialog(true)
                                }}
                            >
                                <HiShare className="text-[1.3rem]" />
                                <p className="absolute top-[-13px] left-[-3px] text-red-500 text-[1.3rem]">
                                    ___
                                </p>
                            </div>
                        )}
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
                        fileName="Devices"
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

export default DevicesTable
