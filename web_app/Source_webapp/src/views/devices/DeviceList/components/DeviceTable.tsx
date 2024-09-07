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
import { apiGetDevices } from '@/services/DeviceApi'
import { DoubleSidedImage, Loading } from '@/components/shared'

const ActionColumn = ({ row }: { row: DeviceData }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/devices/edit/${row._id}`)
    }

    const onView = () => {
        navigate(`/devices/${row._id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        // dispatch(setSelectedProduct(row._id))
    }

    return (
        <div className="flex justify-end text-lg">
            {/* <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onEdit}
            >
                <HiOutlinePencil />
            </span> */}
            <span
                className="cursor-pointer p-2 hover:${textTheme}"
                onClick={onView}
            >
                <HiOutlineEye />
            </span>
            {/* <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onDelete}
            >
                <HiOutlineTrash />
            </span> */}
        </div>
    )
}

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

const DeviceTable = () => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<DeviceData[]>([])
    const [loading, setLoading] = useState(true)
    const { _id: userId } = useAppSelector((state) => state.auth.user)

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
