import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { RequestData } from '@/utils/hooks/useGetDevices'
import { apiGetUserProfileByUserId } from '@/services/UserApi'
import { Loading, SyntaxHighlighter } from '@/components/shared'
import {
    apiCancelServiceRequest,
    apiGetAllRequestPublishServices,
    apiGetAllServices,
    apiPublishService,
    apiRejectService,
} from '@/services/ServiceAPI'
import { HiOutlineEye } from 'react-icons/hi'
import { useAppDispatch } from '@/store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import './style.css'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

interface UsersTableProps {
    setCount: (count: number) => void
}

const RequestTable: React.FC<UsersTableProps> = ({ setCount }) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<RequestData[]>([])
    const [filteredData, setFilteredData] = useState<RequestData[]>([])
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(false)
    const [requestModalIsOpen, setRequestModalIsOpen] = useState(false)
    const [modalData, setModalData] = useState<RequestData>()
    const [userProfile, setUserProfile] = useState<any>({})
    const [codeModal, setCodeModal] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const { textTheme } = useThemeClass()

    function refreshPage() {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        setLoading(true)
        async function fetchUsers() {
            const response = await apiGetAllServices()
            const data = response.data as any
            data.data = data.data.filter(
                (item: RequestData) =>
                    (item.publishRejected == true ||
                        item.publishRequested == true ||
                        item.published == true) &&
                    (!item.nodeServiceId ||
                        item.nodeServiceId == null ||
                        item.nodeServiceId == undefined)
            )
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

    function getServiceState(data: RequestData) {
        let serviceState = ''

        if (data.published == true) {
            serviceState = 'Published'
        } else if (data.publishRejected == true) {
            serviceState = 'Rejected'
        } else if (data.publishRequested == true) {
            serviceState = 'Requested'
        }
        return serviceState
    }

    const handleSearch = (e: any) => {
        setSearchQuery(e.target.value)
        const searchFilteredData = data.filter(
            (user) =>
                user._id
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                user.serviceName
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                user.description
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                user.serviceType
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                user.installationPrice
                    ?.toString()
                    .includes(e.target.value.toString().toLowerCase()) ||
                '' ||
                user.insertedBy
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                '' ||
                getServiceState(user)
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                ''
        )
        setFilteredData(searchFilteredData)
    }

    const columns: ColumnDef<RequestData>[] = [
        {
            header: 'Name',
            accessorKey: 'serviceName',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.serviceName}</span>
            },
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.description}</span>
            },
        },
        {
            header: 'Type',
            accessorKey: 'serviceType',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.serviceType}</span>
            },
        },
        {
            header: 'Price',
            accessorKey: 'installationPrice',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.installationPrice}</span>
            },
        },
        {
            header: 'Owner ID',
            accessorKey: 'insertedBy',
            cell: (props) => {
                const row = props.row.original
                return <span>{row.insertedBy}</span>
            },
        },
        {
            header: '_id',
            accessorKey: '_id',
            cell: (props) => {
                const row = props.row.original
                return <span>{row._id}</span>
            },
        },

        {
            header: 'state',
            accessorKey: 'published',
            cell: (props) => {
                const row = props.row.original
                return <span>{getServiceState(row)}</span>
            },
        },

        {
            header: '',
            id: 'action',
            cell: (props) => {
                async function handleClick() {
                    setModalData(props.row.original)
                    setRequestModalIsOpen(true)
                    const res = (await apiGetUserProfileByUserId(
                        props.row.original?.insertedBy || ''
                    )) as any
                    console.log(res?.data.data)

                    setUserProfile(res?.data.data)
                }

                return (
                    <span
                        className={`text-xl cursor-pointer p-2 hover:${textTheme}`}
                        onClick={handleClick}
                    >
                        <HiOutlineEye />
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

    const cardHeader = (
        <div className="flex relative card-header-svg items-center justify-center rounded-tl-lg rounded-tr-lg overflow-hidden">
            <ImageWithFallBack
                src={
                    (modalData?.serviceImage && modalData?.serviceImage) ||
                    '/img/others/img-1.jpg'
                }
                alt="card header"
            />
        </div>
    )

    async function handleRejectService() {
        setApiLoading(true)
        const res = await apiRejectService(modalData?._id || '')
        setApiLoading(false)
        if (res) {
            toast.push(
                <Notification
                    title={'Service rejected successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
            setRequestModalIsOpen(false)
            setCodeModal(false)
            refreshPage()
        }
    }

    async function handleCancelRequest() {
        setApiLoading(true)
        const res = await apiCancelServiceRequest(modalData?._id || '')
        setApiLoading(false)
        if (res) {
            toast.push(
                <Notification
                    title={'Service request canceled successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
            setRequestModalIsOpen(false)
            setCodeModal(false)
            refreshPage()
        }
    }

    async function handlePublishService() {
        setApiLoading(true)
        const res = await apiPublishService(modalData?._id || '')
        setApiLoading(false)
        if (res) {
            toast.push(
                <Notification
                    title={'Service published successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
            setRequestModalIsOpen(false)
            setCodeModal(false)
            refreshPage()
        }
    }

    return (
        <>
            <Dialog
                width={'40%'}
                className={''}
                isOpen={requestModalIsOpen}
                onClose={() => setRequestModalIsOpen(false)}
            >
                <h3 className="mb-8">Request Review</h3>
                <figure className="mb-8">{cardHeader}</figure>
                <div className="w-10/12 mx-auto flex flex-col modal-infos gap-3">
                    <h6>
                        Name: <strong>{modalData?.serviceName}</strong>
                    </h6>
                    <h6>
                        Description: <strong>{modalData?.description}</strong>
                    </h6>
                    <h6>
                        Type: <strong>{modalData?.serviceType}</strong>
                    </h6>

                    <h6>
                        Price: <strong>{modalData?.installationPrice}</strong>
                    </h6>

                    <h6>
                        Owner Username: <strong>{userProfile?.userName}</strong>
                    </h6>

                    <h6>
                        Owner ID: <strong>{modalData?.insertedBy}</strong>
                    </h6>

                    <div className="flex flex-col items-center w-full my-2 gap-2">
                        <Button
                            variant="solid"
                            size="sm"
                            onClick={() => setCodeModal(true)}
                            className="w-1/2 "
                        >
                            See Code
                        </Button>
                        <div className="flex w-full gap-4">
                            <Button
                                variant="solid"
                                color="red"
                                size="sm"
                                className="w-1/3"
                                onClick={handleRejectService}
                                loading={apiLoading}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="solid"
                                color="yellow"
                                size="sm"
                                className="w-1/3"
                                onClick={handleCancelRequest}
                                loading={apiLoading}
                            >
                                Cancel Request
                            </Button>
                            <Button
                                color="green"
                                variant="solid"
                                size="sm"
                                className="w-1/3"
                                onClick={handlePublishService}
                                loading={apiLoading}
                            >
                                Publish
                            </Button>
                        </div>
                    </div>

                    <Dialog
                        width={'40%'}
                        className={''}
                        isOpen={codeModal}
                        onClose={() => setCodeModal(false)}
                    >
                        <h5 className="mb-4">Code</h5>
                        <div className="">
                            <SyntaxHighlighter language="javascript">
                                {modalData?.code || ''}
                            </SyntaxHighlighter>
                        </div>
                        <Button
                            variant="solid"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => {
                                toast.push(
                                    <Notification
                                        title={'Code copied successfully'}
                                        type="success"
                                    />,
                                    {
                                        placement: 'top-center',
                                    }
                                )
                                navigator.clipboard.writeText(
                                    modalData?.code || ''
                                )
                            }}
                        >
                            Copy
                        </Button>
                    </Dialog>
                </div>
            </Dialog>
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border rounded-xl w-4/12 p-2"
                />
                <Button disabled={loading} onClick={refreshPage}>
                    Refresh
                </Button>
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

export default RequestTable
