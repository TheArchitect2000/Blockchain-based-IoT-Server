import { DoubleSidedImage, Loading } from '@/components/shared'
import {
    Dialog,
    Button,
    Input,
    Avatar,
    toast,
    Notification,
} from '@/components/ui'
import SureDialog from '@/components/ui/Dialog/Confirm/ConfirmDialog'
import {
    apiGetLocalShareUsersWithDeviceId,
    apiLocalUnshareDeviceWithUserId,
} from '@/services/DeviceApi'
import { useEffect, useState } from 'react'
import { HiUser } from 'react-icons/hi'

interface ShareDeviceDialogProps {
    isOpen: boolean
    deviceId: string
    onClose: () => void
    setSharedUsersDialog: (value: boolean) => void
    refreshPage: Function
    sharedUsersDialog: boolean
}

const SharedUsersDialog: React.FC<ShareDeviceDialogProps> = ({
    isOpen,
    onClose,
    setSharedUsersDialog,
    sharedUsersDialog,
    deviceId,
    refreshPage
}) => {
    const [sharedUsers, setSharedUsers] = useState<
        Array<{
            avatar: string
            email: string
            firstName: string
            lastName: string
        }>
    >([])
    const [refreshData, setRefreshData] = useState<number>(0)
    const [sureDialog, setSureDialog] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<{
        avatar: string
        email: string
        firstName: string
        lastName: string
    }>({ avatar: '', email: '', firstName: '', lastName: '' })
    const [apiLoading, setApiLoading] = useState<boolean>(false)

    function refreshUsersData() {
        setRefreshData(refreshData + 1)
    }

    function UserComponent({
        user,
    }: {
        user: {
            firstName: string
            lastName: string
            email: string
            avatar: string
        }
    }) {
        return (
            <div className="flex w-full px-4 py-2 gap-8 items-center border rounded-lg">
                <Avatar
                    className="!w-[60px] !h-[60px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg"
                    size={60}
                    shape="circle"
                    src={user.avatar}
                >
                    {!user.avatar && (
                        <span className="text-3xl">
                            <HiUser />
                        </span>
                    )}
                </Avatar>
                <p className="text-white text-[1.1rem]">
                    {user.firstName || user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'No Name'}
                </p>
                <p className="text-white text-[1.1rem]">{user.email}</p>
                <Button
                    onClick={() => {
                        setSelectedUser(user)
                        setSureDialog(true)
                    }}
                    className="ms-auto"
                    variant="solid"
                    color="red-500"
                >
                    Unshare
                </Button>
            </div>
        )
    }

    async function fetchData() {
        if (deviceId) {
            setApiLoading(true)
            const result = (await apiGetLocalShareUsersWithDeviceId(
                deviceId
            )) as any
            setSharedUsers(result.data.data)
            setApiLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen == true) {
            fetchData()
        }
    }, [isOpen, refreshData])

    async function handleConfirmDelete() {
        try {
            setApiLoading(true)
            const res = await apiLocalUnshareDeviceWithUserId(
                deviceId,
                selectedUser.email
            )
            toast.push(
                <Notification
                    title={`Device successfully unshared with ${selectedUser.email}`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
            refreshPage()
            refreshUsersData()
        } catch (error: any) {
            setApiLoading(false)
            toast.push(
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
        <Dialog
            overlayClassName={'flex items-center'}
            isOpen={isOpen}
            contentClassName="!w-1/2 flex flex-col gap-6"
            onClose={() => {
                onClose()
                setTimeout(() => {
                    setSharedUsers([])
                }, 500)
            }}
        >
            <SureDialog
                isOpen={sureDialog}
                onClose={() => setSureDialog(false)}
                onConfirm={handleConfirmDelete}
                title={`Unshare device`}
                message={`Are you sure you want to unshare your device with ${selectedUser.email}`}
            />
            <h3>Device sharing with users</h3>
            {(apiLoading == true || String(deviceId) == 'undefined') && (
                <div className="flex w-full h-[30dvh] items-center justify-center">
                    <Loading loading={true} />
                </div>
            )}
            {apiLoading == false && deviceId && (
                <section className="flex flex-col gap-4 w-full">
                    {sharedUsers.map((item, index) => (
                        <UserComponent user={item} />
                    ))}
                </section>
            )}
            {apiLoading == false && sharedUsers.length == 0 && (
                <div className="flex flex-col gap-4 items-center justify-center w-full h-[35dvh]">
                    <DoubleSidedImage
                        className="w-2/12 max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3>No shared users were found.</h3>
                </div>
            )}
        </Dialog>
    )
}

export default SharedUsersDialog
