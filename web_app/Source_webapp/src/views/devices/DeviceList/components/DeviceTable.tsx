import { memo, useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import {
    HiOutlineEye,
    HiOutlinePencil,
    HiOutlineTrash,
    HiShare,
    HiUserGroup,
} from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import {
    apiDeleteDeviceById,
    apiGetDevices,
    apiGetLocalShareUsersWithDeviceId,
    apiLocalShareDeviceWithUserId,
    apiRenameDevice,
    apiUnshareDevice,
} from '@/services/DeviceApi'
import { DoubleSidedImage, Loading } from '@/components/shared'
import { Notification, toast } from '@/components/ui'
import { useAppSelector } from '@/store'
import { apiCheckEmailExist } from '@/services/AuthService'
import { validateEmail } from '@/views/account/Settings/components/Profile/Profile'
import RenameDeviceDialog from './dialogs/RenameDeviceDialog'
import DeleteDeviceDialog from './dialogs/DeleteDeviceDialog'
import { DeviceActionColumn, DeviceProductColumn } from './table/Action'
import SharedUsersDialog from './dialogs/SharedListDialog'
import GlobalUnshareDeviceDialog from './dialogs/GlobalUnshareDeviceDialog'
import LocalShareDeviceDialog from './dialogs/LocalShareDeviceDialog'
import SelectShareDeviceDialog from './dialogs/ShareDeviceDialog'
import GlobalShareDeviceDialog from './dialogs/GlobalShareDevice/GlobalShareDeviceDialog'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

export interface DeviceListOptionsInterface {
    share?: boolean
    edit?: boolean
    view?: boolean
    delete?: boolean
    sharedUsers?: boolean
    unshare?: boolean
    nft?: boolean
}

const LastLogCell = memo(({ lastLog, deviceEncryptedId, payloads }: any) => {
    const [formattedDate, setFormattedDate] = useState('')

    useEffect(() => {
        let theDate

        if (payloads[deviceEncryptedId]?.date) {
            theDate = new Date(payloads[deviceEncryptedId]?.date)
        } else {
            theDate = new Date(lastLog)
        }

        const year = theDate.getFullYear()
        const month = (theDate.getMonth() + 1).toString().padStart(2, '0')
        const day = theDate.getDate().toString().padStart(2, '0')
        const hours = theDate.getHours().toString().padStart(2, '0')
        const minutes = theDate.getMinutes().toString().padStart(2, '0')
        const seconds = theDate.getSeconds().toString().padStart(2, '0')

        const formattedDate = `${year}-${month}-${day}`
        const formattedTime = `${hours}:${minutes}:${seconds}`

        setFormattedDate(`${formattedDate}, ${formattedTime}`)
    }, [lastLog, deviceEncryptedId, payloads])

    return <span>{formattedDate}</span>
})

LastLogCell.displayName = 'LastLogCell'

const DeviceTable = ({
    type,
    deviceList,
    options,
    refreshPage,
    payloads,
}: {
    type: string
    deviceList?: Array<DeviceData>
    options: DeviceListOptionsInterface
    refreshPage: Function
    payloads: Record<string, any>
}) => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<DeviceData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [apiLoading, setApiLoading] = useState<boolean>(false)
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
    const [selectShareDialog, setSelectShareDialog] = useState<boolean>(false)
    const [globalShareDialog, setGlobalShareDialog] = useState<boolean>(false)
    const [globalUnshareDialog, setGlobalUnshareDialog] =
        useState<boolean>(false)
    const [renameDialog, setRenameDialog] = useState<boolean>(false)
    const [localShareDialog, setLocalShareDialog] = useState<boolean>(false)
    const [sharedUsersDialog, setSharedUsersDialog] = useState<boolean>(false)
    const [userIsExist, setUserIsExist] = useState<boolean>(false)
    const [shareUserEmail, setShareUserEmail] = useState<string>('')
    const [newDeviceName, setNewDeviceName] = useState<string>('')
    const [deviceData, setDeviceData] = useState<DeviceData | null>(null)
    const [refreshActionColumnsData, setRefreshActionColumnsData] =
        useState<number>(0)
    const [sharedLoading, setSharedLoading] = useState<boolean>(false)
    const [devicesAreShared, setDevicesAreShared] = useState<{}>({})

    function refreshActionsData() {
        setRefreshActionColumnsData(refreshActionColumnsData + 1)
    }

    useEffect(() => {
        if (deviceList) {
            setData(deviceList)
        }
        refreshActionsData()
    }, [])

    async function fetchActionsData() {
        if (data.length == 0) {
            setLoading(false)
            return false
        }
        setSharedLoading(true)
        let tempData: any = {}
        for (const element of data) {
            try {
                const res = (await apiGetLocalShareUsersWithDeviceId(
                    element._id
                )) as any
                if (res.data.data.length > 0) {
                    tempData[element._id] = true
                } else {
                    tempData[element._id] = false
                }
            } catch (error: any) {
                console.error(error.response.data.message)
            }
        }
        setDevicesAreShared({
            ...tempData,
        })
        setLoading(false)
        setSharedLoading(false)
    }

    useEffect(() => {
        fetchActionsData()
    }, [refreshActionColumnsData])

    const { _id: userId } = useAppSelector((state) => state.auth.user)

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
        setApiLoading(true)
        const res = (await apiDeleteDeviceById(deviceData?._id || '')) as any
        setApiLoading(false)
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

    async function handleGlobalUnshareDevice() {
        setApiLoading(true)
        try {
            const res = (await apiUnshareDevice(deviceData?._id || '')) as any
            toast.push(
                <Notification
                    title={'Device unshared successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
            setTimeout(() => {
                refreshPage()
                setGlobalUnshareDialog(false)
                setApiLoading(false)
            }, 1000)
        } catch (error) {
            setGlobalUnshareDialog(false)
            setApiLoading(false)
            toast.push(
                <Notification
                    title={'Error while unsharing device'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    //eslint-disable-next-line
    //const data = devices?.data.data!
    const columns: ColumnDef<DeviceData>[] = [
        {
            header: 'Name',
            accessorKey: 'deviceName',
            cell: (props) => {
                const row = props.row.original
                return (
                    <DeviceProductColumn
                        dataReceived={payloads[row.deviceEncryptedId]?.received}
                        row={row}
                    />
                )
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
        {
            header: 'Device Id',
            accessorKey: 'deviceEncryptedId',
            cell: (props) => {
                const row = props.row.original
                return (
                    <span className="capitalize">{row.deviceEncryptedId}</span>
                )
            },
        },
        // {
        //     header: 'Use Cost',
        //     accessorKey: 'costOfUse',
        //     sortable: true,
        // },
        {
            header: 'Usage Cost',
            accessorKey: 'costOfUse',
            cell: (props) => {
                const { costOfUse } = props.row.original
                return <span>{costOfUse} FDS</span>
            },
        },
        {
            header: 'Installation',
            accessorKey: 'insertDate',
            enableSorting: false,
            cell: (props) => {
                const dateObj: Date = new Date(props.row.original.insertDate)

                // Extract the year, month, and day from the Date object
                const year: number = dateObj.getFullYear()
                const month: number = dateObj.getMonth() + 1 // Add 1 because getMonth() returns a zero-based index
                const day: number = dateObj.getDate()

                // Extract the hours, minutes, and seconds from the Date object
                const hours: number = dateObj.getHours()
                const minutes: number = dateObj.getMinutes()
                const seconds: number = dateObj.getSeconds()

                // Format the date in YYYY-MM-DD format
                const formattedDate = `${year}-${month
                    .toString()
                    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`

                // Format the time in HH:MM:SS format
                const formattedTime = `${hours
                    .toString()
                    .padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

                // Return the formatted date and time
                return (
                    <span>
                        {formattedDate}, {formattedTime}
                    </span>
                )
            },
        },
        {
            header: 'Last Log',
            accessorKey: 'lastLog',
            enableSorting: true,
            cell: (props) => {
                const { lastLog, deviceEncryptedId } = props.row.original
                return (
                    <LastLogCell
                        lastLog={lastLog}
                        deviceEncryptedId={deviceEncryptedId}
                        payloads={payloads}
                    />
                )
            },
        },

        {
            header: 'Actions',
            id: 'action',
            cell: (props) => {
                return (
                    <DeviceActionColumn
                        setUnshareDeviceDialog={setGlobalUnshareDialog}
                        sharedLoading={sharedLoading}
                        setSharedUsersDialog={setSharedUsersDialog}
                        setDeleteDialog={setDeleteDialog}
                        setDeviceData={setDeviceData}
                        setNewDeviceName={setNewDeviceName}
                        setRenameDialog={setRenameDialog}
                        setSelectShareDialog={setSelectShareDialog}
                        options={options}
                        row={props.row.original}
                    />
                )
            },
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

    async function handleCheckUserExist() {
        if (!validateEmail(shareUserEmail) || shareUserEmail.length == 0) {
            return toast.push(
                <Notification title={'Email is not valid!'} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
        }
        setApiLoading(true)
        let existRes: any = false
        try {
            existRes = (await apiCheckEmailExist(shareUserEmail)) as any
            setUserIsExist(true)
            toast.push(
                <Notification
                    duration={10000}
                    title={
                        'User found. Press "Share" to share the device locally with this user.'
                    }
                    type="info"
                />,
                {
                    placement: 'top-center',
                }
            )
        } catch (errors) {
            setUserIsExist(false)
            toast.push(
                <Notification title={'User not found.'} type="danger" />,
                {
                    placement: 'top-center',
                }
            )
        }
        setApiLoading(false)
    }

    async function handleLocalShareDevice() {
        setApiLoading(true)
        try {
            const res = await apiLocalShareDeviceWithUserId(
                String(deviceData?._id),
                shareUserEmail
            )

            toast.push(
                <Notification
                    title={`'${deviceData?.deviceName}' device successfully shared with '${shareUserEmail}'`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
            refreshPage()
            refreshActionsData()
            setApiLoading(false)
            closeShareDialog()
        } catch (error: any) {
            setApiLoading(false)
            setUserIsExist(false)
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

    function closeShareDialog() {
        refreshActionsData()
        setLocalShareDialog(false)
        setUserIsExist(false)
        setShareUserEmail('')
    }

    return (
        <>
            <SharedUsersDialog
                isOpen={sharedUsersDialog}
                onClose={() => {
                    refreshActionsData()
                    setSharedUsersDialog(false)
                }}
                deviceId={String(deviceData?._id)}
                setSharedUsersDialog={setSharedUsersDialog}
                sharedUsersDialog={sharedUsersDialog}
                refreshPage={refreshPage}
            />

            <RenameDeviceDialog
                isOpen={renameDialog}
                onClose={() => setRenameDialog(false)}
                onRename={handleDeviceRename}
                loading={loading}
                deviceName={newDeviceName}
                setNewDeviceName={setNewDeviceName}
            />

            <LocalShareDeviceDialog
                isOpen={localShareDialog}
                onClose={closeShareDialog}
                onCheckUser={handleCheckUserExist}
                onShare={handleLocalShareDevice}
                userIsExist={userIsExist}
                loading={apiLoading}
                deviceName={String(deviceData?.deviceName)}
                userEmail={shareUserEmail}
                setUserEmail={setShareUserEmail}
            />

            <DeleteDeviceDialog
                loading={apiLoading}
                isOpen={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onDelete={handleDeleteDevice}
                deviceName={String(deviceData?.deviceName)}
            />

            <GlobalUnshareDeviceDialog
                loading={apiLoading}
                isOpen={globalUnshareDialog}
                onClose={() => setGlobalUnshareDialog(false)}
                onUnshare={handleGlobalUnshareDevice}
                deviceName={String(deviceData?.deviceName)}
            />

            <GlobalShareDeviceDialog
                deviceId={String(deviceData?._id)}
                isOpen={globalShareDialog}
                onClose={() => setGlobalShareDialog(false)}
                refreshPage={refreshPage}
            />

            <SelectShareDeviceDialog
                loading={apiLoading}
                isOpen={selectShareDialog}
                onClose={() => setSelectShareDialog(false)}
                setGlobalShareDialog={setGlobalShareDialog}
                setLocalShareDialog={setLocalShareDialog}
                deviceData={deviceData}
            />

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
                <div className="w-full h-[50dvh] flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}

            {loading === false && data.length === 0 && (
                <section className="w-full h-[55dvh] flex flex-col gap-4 sm:gap-3 items-center justify-center">
                    <DoubleSidedImage
                        className="w-2/12 min-w-[125px] max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    {type !== 'all' && (
                        <h4 className="text-center">
                            No {type} devices were found!
                        </h4>
                    )}

                    {type === 'all' && (
                        <>
                            <p className="text-center text-lg">
                                To add your device to this account, please use
                                the FidesInnova mobile app.
                            </p>
                            <a
                                href="https://play.google.com/store/apps/details?id=io.fidesinnova.front"
                                target="_blank"
                            >
                                <img
                                    loading="lazy"
                                    decoding="async"
                                    width="150"
                                    src="/img/stores/gplay-button.png" //
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
                                    src="/img/stores/appstore-button.png"
                                    className="attachment-large size-large wp-image-18034"
                                    alt="FidesInnova appstore pic"
                                />{' '}
                            </a>
                        </>
                    )}
                </section>
            )}

            {loading === false && data.length > 0 && (
                <div className="flex flex-col items-center w-full gap-3 mt-12">
                    <p className="text-center text-md text-gray-400">
                        To add your device to this account, please use the
                        FidesInnova mobile app.
                    </p>
                    <div className="flex gap-2">
                        <a
                            href="https://play.google.com/store/apps/details?id=io.fidesinnova.front"
                            target="_blank"
                        >
                            <img
                                loading="lazy"
                                decoding="async"
                                width="150"
                                src="/img/stores/gplay-button.png" //
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
                                src="/img/stores/appstore-button.png"
                                className="attachment-large size-large wp-image-18034"
                                alt="FidesInnova appstore pic"
                            />{' '}
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

export default DeviceTable
