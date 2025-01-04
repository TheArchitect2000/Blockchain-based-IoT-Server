import { useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { HiOutlineEye, HiTrash } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { DoubleSidedImage } from '@/components/shared'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import JsonDisplay from '@/components/ui/JsonDisplay'
import { apiRemoveCommitment } from '@/services/ContractServices'

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
    const [deleteData, setDeleteData] = useState<{
        dbId: string
        commitmentId: string
        nodeId: string
    }>({ commitmentId: '', nodeId: '', dbId: '' })

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

        return (
            <span className={`flex gap-4 justify-center p-2`}>
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
                return <span>{row.commitmentId}</span>
            },
        },
        {
            header: 'Manufacturer Name',
            accessorKey: 'manufacturerName',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.manufacturerName}</span>
            },
        },

        {
            header: 'Firmware Version',
            accessorKey: 'firmwareVersion',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.firmwareVersion}</span>
            },
        },

        {
            header: 'Hardware Version',
            accessorKey: 'hardwareVersion',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.hardwareVersion}</span>
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
                <div className="h-[80dvh] overflow-y-auto">
                    <JsonDisplay jsonData={commitmentData} />
                </div>
            </Dialog>

            <Dialog
                isOpen={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                closable={false}
                contentClassName="flex flex-col gap-4"
            >
                <h3>Delete Confirmation</h3>
                <p className="text-[1.2rem] text-center text-white">
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
                    <h3>No commitments found yet!</h3>
                </section>
            )}
        </>
    )
}

export default CommitmentTable
