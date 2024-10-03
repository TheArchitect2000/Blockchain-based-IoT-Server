import { useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { HiOutlineEye } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { DoubleSidedImage } from '@/components/shared'
import { CommitmentFormModel } from '.'
import { Dialog } from '@/components/ui'
import JsonDisplay from '@/components/ui/JsonDisplay'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const CommitmentTable = ({ data }: { data: CommitmentFormModel[] }) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [consoleDialog, setConsoleDialog] = useState<boolean>(false)
    const [commitmentData, setCommitmentData] = useState<string>('')

    const ActionColumn = ({ row }: { row: CommitmentFormModel }) => {
        const { textTheme } = useThemeClass()

        function onView() {
            setCommitmentData(row.commitmentData)
            setConsoleDialog(true)
        }

        return (
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onView}
            >
                <HiOutlineEye />
            </span>
        )
    }

    const columns: ColumnDef<CommitmentFormModel>[] = [
        {
            header: 'Manufacturer Name',
            accessorKey: 'manufacturerName',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.manufacturerName}</span>
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
            header: 'Lines',
            accessorKey: 'lines',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.lines}</span>
            },
        },

        {
            header: 'Commitment Data',
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
                isOpen={consoleDialog}
                onClose={() => setConsoleDialog(false)}
            >
                <h3>Commitment Data</h3>
                <div className="h-[80dvh] overflow-y-scroll">
                    <JsonDisplay jsonData={commitmentData} />
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
