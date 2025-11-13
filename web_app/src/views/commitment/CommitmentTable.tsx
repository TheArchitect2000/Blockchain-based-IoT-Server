import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { HiGlobe, HiOutlineEye, HiTrash } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { DoubleSidedImage } from '@/components/shared'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import JsonDisplay from '@/components/ui/JsonDisplay'
import { apiRemoveCommitment } from '@/services/ContractServices'
import { formatDate } from '../devices/DeviceDetails/componetns/DevicePayload/DevicePayload'
import { FaGlobe } from 'react-icons/fa'
import { apiGetMyProfile } from '@/services/UserApi'
import { convertToTimeZone } from '../account/Settings/components/TimezoneSelector'
import { formatToCustomDateTime } from '../devices/DeviceDetails/DeviceDetails'
import { formatISODate } from '../services/Services/components/Card'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const CommitmentTable = ({
    data,
    refreshData,
}: {
    data: any[]
    refreshData: Function
}) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [consoleDialog, setConsoleDialog] = useState<boolean>(false)
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
    const [apiLoading, setApiLoading] = useState<boolean>(false)
    const [commitmentData, setCommitmentData] = useState<string>('')
    const [userProfile, setUserProfile] = useState<any>()
    const [deleteData, setDeleteData] = useState<{
        dbId: string
        commitmentId: string
        nodeId: string
    }>({ commitmentId: '', nodeId: '', dbId: '' })

    useEffect(() => {
        async function fetchProfile() {
            const res = (await apiGetMyProfile()) as any
            setUserProfile(res.data.data)
        }
        fetchProfile()
    }, [])

    const ActionColumn = ({ row }: { row: any }) => {
        const { textTheme } = useThemeClass()

        function onView() {
            setCommitmentData(row.commitmentData)
            setConsoleDialog(true)
        }

        function onDelete() {
            setDeleteData({
                dbId: row._id,
                commitmentId: row.commitmentId,
                nodeId: row.nodeId,
            })
            setDeleteDialog(true)
        }

        function onTransactionView() {
            window.open(
                `https://explorer.fidesinnova.io/tx/${row.transactionId}`,
                '_blank'
            )
        }

        return (
            <span className={`flex gap-4 justify-center p-2`}>
                <FaGlobe
                    onClick={onTransactionView}
                    className={`cursor-pointer hover:text-yellow-500`}
                />
                <HiOutlineEye
                    onClick={onView}
                    className={`cursor-pointer hover:${textTheme}`}
                />
                <HiTrash
                    onClick={onDelete}
                    className="cursor-pointer hover:text-red-500"
                />
            </span>
        )
    }

    const columns: ColumnDef<any>[] = [
        {
            header: 'Commitment ID',
            accessorKey: 'commitmentID',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span
                        onClick={() => {
                            window.open(
                                `https://explorer.fidesinnova.io/tx/${row.transactionId}`,
                                '_blank'
                            )
                        }}
                        className="hover:cursor-pointer hover:underline hover:text-white"
                    >
                        {row.commitmentId}
                    </span>
                )
            },
        },
        {
            header: 'Manufacturer',
            accessorKey: 'manufacturer',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.manufacturer}</span>
            },
        },
        {
            header: 'Device Type',
            accessorKey: 'deviceType',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.deviceType}</span>
            },
        },
        {
            header: 'Device Id Type',
            accessorKey: 'deviceIdType',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.deviceIdType}</span>
            },
        },

        {
            header: 'Device Model',
            accessorKey: 'deviceModel',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.deviceModel}</span>
            },
        },

        {
            header: 'Software Version',
            accessorKey: 'softwareVersion',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.softwareVersion}</span>
            },
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: (props) => {
                const row = props.row.original

                let userDate, formattedUTCOffset

                if (userProfile?.timezone) {
                    userDate = new Date(
                        convertToTimeZone(row?.createdAt, userProfile?.timezone)
                    )

                    // Get the timezone offset in minutes
                    const timezoneOffset = userDate.getTimezoneOffset() // Offset in minutes
                    const totalOffsetMinutes = -timezoneOffset // Negate for UTC+/- convention

                    // Calculate hours and minutes
                    const offsetHours = Math.floor(totalOffsetMinutes / 60)
                    const offsetMinutes = Math.abs(totalOffsetMinutes % 60)

                    // Format as UTC+HH:mm or UTC-HH:mm
                    formattedUTCOffset = `UTC${
                        offsetHours >= 0 ? '+' : ''
                    }${offsetHours}:${offsetMinutes
                        .toString()
                        .padStart(2, '0')}`
                }

                return (
                    <span>
                        {(userProfile?.timezone &&
                            formatDate(String(userDate))) ||
                            formatDate(String(row?.createdAt))}
                        {userProfile?.timezone && formattedUTCOffset && (
                            <p>{formattedUTCOffset}</p>
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
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    async function handleDeleteCommitment() {
        setApiLoading(true)
        try {
            const res = await apiRemoveCommitment(
                deleteData.commitmentId,
                deleteData.dbId,
                deleteData.nodeId
            )
            setApiLoading(false)
            setDeleteDialog(false)
            setTimeout(() => {
                refreshData()
            }, 1000)
            toast.push(
                <Notification
                    title={'Commitment deleted successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        } catch (error: any) {
            setApiLoading(false)
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
        <>
            <Dialog
                isOpen={consoleDialog}
                onClose={() => setConsoleDialog(false)}
            >
                <h3>Commitment Data</h3>
                <div className="h-[80dvh] overflow-auto">
                    <JsonDisplay jsonData={commitmentData} />
                </div>
            </Dialog>

            <Dialog
                isOpen={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                closable={false}
                contentClassName="flex flex-col gap-4"
            >
                <h4>Delete Confirmation</h4>
                <p className="text-lg text-center text-white">
                    Are you sure you want to delete this commitment? This action
                    cannot be undone.
                </p>
                <div className="flex justify-center gap-8">
                    <Button
                        onClick={handleDeleteCommitment}
                        variant="solid"
                        color="red-500"
                        loading={apiLoading}
                    >
                        Delete
                    </Button>
                    <Button
                        loading={apiLoading}
                        onClick={() => setDeleteDialog(false)}
                        variant="default"
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>

            {
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
            }

            {data.length === 0 && (
                <section className="w-full h-[50dvh] flex flex-col gap-2 items-center justify-center">
                    <DoubleSidedImage
                        className="w-2/12 max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3>No commitments were found!</h3>
                </section>
            )}
        </>
    )
}

export default CommitmentTable
