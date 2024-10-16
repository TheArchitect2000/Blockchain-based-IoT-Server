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
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
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
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import {
    apiDeleteDeviceById,
    apiGetDevices,
    apiRenameDevice,
} from '@/services/DeviceApi'
import { DoubleSidedImage, Loading } from '@/components/shared'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'

const ProductColumn = ({ row }: { row: DeviceData }) => {
    const avatar = <Avatar icon={<FiPackage />} />

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>
                {row.deviceName}
            </span>
        </div>
    )
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const DeviceTable = ({ refreshPage }: { refreshPage: Function }) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<DeviceData[]>([])
    const [loading, setLoading] = useState(true)
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [renameDialog, setRenameDialog] = useState(false)
    const [newDeviceName, setNewDeviceName] = useState('')
    const [deviceData, setDeviceData] = useState<DeviceData | null>(null)

    const ActionColumn = ({ row }: { row: DeviceData }) => {
        const dispatch = useAppDispatch()
        const { textTheme } = useThemeClass()
        const navigate = useNavigate()

        const onEdit = () => {
            setDeviceData(row)
            setNewDeviceName(row?.deviceName || '')
            setRenameDialog(true)
        }

        const onView = () => {
            navigate(`/devices/${row._id}`)
        }

        const onDelete = () => {
            setDeviceData(row)
            setDeleteDialog(true)
        }

        return (
            <div className="flex justify-end text-lg">
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onEdit}
                >
                    <HiOutlinePencil />
                </span>
                <span
                    className="cursor-pointer p-2 hover:${textTheme}"
                    onClick={onView}
                >
                    <HiOutlineEye />
                </span>
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={onDelete}
                >
                    <HiOutlineTrash />
                </span>
            </div>
        )
    }

    async function handleDeviceRename() {
        if (newDeviceName.length === 0) {
            return toast.push(
                <Notification
                    title={'The device name must contain at least one letter.'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
        setLoading(true)
        const res = (await apiRenameDevice(
            deviceData?._id || '',
            newDeviceName
        )) as any
        setDeleteDialog(false)
        setTimeout(() => {
            refreshPage()
            setLoading(false)
        }, 1000)
        if (res?.data?.success) {
            toast.push(
                <Notification
                    title={'The device has been renamed successfully.'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            toast.push(
                <Notification
                    title={
                        'An error occurred while renaming the device. Please try again.'
                    }
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    async function handleDeleteDevice() {
        const res = (await apiDeleteDeviceById(deviceData?._id || '')) as any
        setDeleteDialog(false)
        setTimeout(() => {
            refreshPage()
        }, 1000)
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

    useEffect(() => {
        async function getDevices() {
            const res = (await apiGetDevices(userId || '')) as any
            setLoading(false)
            setData(res?.data.data!)
        }
        getDevices()
    }, [])

    //eslint-disable-next-line
    //const data = devices?.data.data!
    const columns: ColumnDef<DeviceData>[] = [
        {
            header: 'Name',
            accessorKey: 'deviceName',
            cell: (props) => {
                const row = props.row.original
                return <ProductColumn row={row} />
            },
        },
        {
            header: 'Device Type',
            accessorKey: 'deviceType',
            cell: (props) => {
                const row = props.row.original
                return <span className="capitalize">{row.deviceType}</span>
            },
        },
        // {
        //     header: 'Use Cost',
        //     accessorKey: 'costOfUse',
        //     sortable: true,
        // },
        {
            header: 'Use Cost',
            accessorKey: 'costOfUse',
            cell: (props) => {
                const { costOfUse } = props.row.original
                return <span>${costOfUse}</span>
            },
        },
        {
            header: 'Creation Date',
            accessorKey: 'insertDate',
            enableSorting: false,
            cell: (props) => {
                const dateObj: Date = new Date(props.row.original.insertDate)

                // Extract the year, month, and day from the Date object
                const year: number = dateObj.getFullYear()
                const month: number = dateObj.getMonth() + 1 // Add 1 because getMonth() returns a zero-based index
                const day: number = dateObj.getDate()

                // Format the date in YYYY-MM-DD format
                const formattedDate = `${year}-${month
                    .toString()
                    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`

                return <span>{formattedDate}</span>
            },
        },

        {
            header: '',
            id: 'action',
            cell: (props) => <ActionColumn row={props.row.original} />,
        },
    ]

    const table = useReactTable({
        data,
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
            <Dialog
                overlayClassName={'flex items-center'}
                isOpen={renameDialog}
                closable={false}
                contentClassName="!w-1/3 flex flex-col gap-6"
                onClose={() => setRenameDialog(false)}
            >
                <h3>Rename Device</h3>
                <p className="text-center text-[1.4rem]">
                    Enter a new name for the '{deviceData?.deviceName}' device.
                </p>
                <Input
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="Device name..."
                />
                <div className="flex w-2/3 mx-auto justify-between">
                    <Button
                        onClick={() => {
                            handleDeviceRename()
                        }}
                        loading={loading}
                        variant="solid"
                        color="green"
                    >
                        Rename
                    </Button>
                    <Button
                        onClick={() => setRenameDialog(false)}
                        variant="default"
                        loading={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>

            <Dialog
                overlayClassName={'flex items-center'}
                isOpen={deleteDialog}
                closable={false}
                contentClassName="!w-1/3"
                onClose={() => setDeleteDialog(false)}
            >
                <h3 className="mb-8">Delete Device</h3>
                <p className="text-left text-[1.4rem] mb-8">
                    Are you sure you want to delete the
                    "{deviceData?.deviceName}" device?
                    <p className="text-red-400 text-left mt-2 text-[0.9rem]">
                        *This action cannot be undone. and you will need to
                        re-add the device using the mobile app.
                    </p>
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
                        variant="default"
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
            {(loading === false && (
                <Table>
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
                        {table
                            .getRowModel()
                            .rows.slice(0, 10)
                            .map((row) => {
                                return (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <Td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
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

            {loading === false && data.length === 0 && (
                <section className="w-full h-[75dvh] flex flex-col gap-2 items-center justify-center">
                    <DoubleSidedImage
                        className="w-2/12 max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3>Device not found!</h3>
                    <p>
                        To add your device to this account, please use the
                        FidesInnova mobile app.
                    </p>
                    <a
                        href="https://play.google.com/store/apps/details?id=io.fidesinnova.front"
                        target="_blank"
                    >
                        <img
                            loading="lazy"
                            decoding="async"
                            width="150"
                            src="https://fidesinnova.io/wp-content/uploads/2024/06/gplay-button.png"
                            className="attachment-large size-large wp-image-18033"
                            alt="FidesInnova google play pic"
                        />
                    </a>
                    <a
                        href="https://apps.apple.com/ca/app/fidesinnova/id6477492757"
                        target="_blank"
                    >
                        <img
                            loading="lazy"
                            decoding="async"
                            width="150"
                            src="https://fidesinnova.io/wp-content/uploads/2024/06/appstore-button.png"
                            className="attachment-large size-large wp-image-18034"
                            alt="FidesInnova appstore pic"
                        />{' '}
                    </a>
                </section>
            )}

            <ProductDeleteConfirmation />
        </>
    )
}

export default DeviceTable
