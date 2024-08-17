import { Card } from '@/components/ui'
import PaginatedList from '@/components/ui/PaginationList/PaginationList'
import {
    apiGetAllUserNotificationsByUserId,
    apiGetPublicNotifications,
    apiReadNotificationsByNotifIdList,
} from '@/services/NotificationService'
import {
    setReadedNotifs,
    setUnreadNotifs,
    useAppDispatch,
    useAppSelector,
} from '@/store'
import useApiData from '@/utils/hooks/useApi'
import { convertToUserTimeZone, formatToCustomDateTime } from '@/views/devices/DeviceDetails/DeviceDetails'
import { formatISODate } from '@/views/services/Services/components/Card'
import { useState, useEffect } from 'react'

export interface NotificationProps {
    expiryDate: string
    insertDate: string
    insertedBy: string
    message: string
    public: boolean
    read: boolean
    title: string
    type: string
    userId: string
    _id: string
}

export default function MyNotifications() {
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { data: myNotifs } = useApiData(
        apiGetAllUserNotificationsByUserId,
        userId
    )
    const { data: publicNotifs } = useApiData(apiGetPublicNotifications)
    const [allNotifications, setAllNotifications] = useState<
        NotificationProps[]
    >([])
    const { unreadNotifs, readedNotifs } = useAppSelector(
        (state) => state.locale
    )
    const dispatch = useAppDispatch()

    useEffect(() => {
        let allDatas = [
            ...(myNotifs?.data?.data || []),
            ...(publicNotifs?.data?.data || []),
        ]
        allDatas = allDatas?.map((item) => {
            readedNotifs?.map((readedItem: string) => {
                if (item._id.toString() === readedItem.toString()) {
                    item.read = true
                }
            })
            return item
        })
        setAllNotifications(allDatas)
    }, [myNotifs, publicNotifs])

    async function handleReadClick(data: NotificationProps) {
        console.log(readedNotifs)
        if (!data.read) {
            if (data.public === false) {
                const res = await apiReadNotificationsByNotifIdList([data._id])
            } else {
                let oldReaded = [...readedNotifs] as any
                oldReaded.push(data._id)
                dispatch(setReadedNotifs(oldReaded))
            }
            const newDatas = allNotifications?.map((item) =>
                item._id === data._id ? { ...item, read: true } : item
            )
            setAllNotifications(newDatas)

            dispatch(
                setUnreadNotifs(newDatas.filter((item) => !item.read).length)
            )
        }
    }

    return (
        <main className="w-full flex flex-col">
            <h3 className="mb-6">My Notifications</h3>
            {allNotifications !== undefined && (
                <PaginatedList
                    className="flex flex-col gap-4"
                    itemsPerPage={10}
                >
                    {allNotifications
                        .sort(
                            (a: NotificationProps, b: NotificationProps) =>
                                new Date(b.insertDate).getTime() -
                                new Date(a.insertDate).getTime()
                        )
                        .map((notif: NotificationProps, index: any) => {
                            const notReaded = notif.read == false

                            return (
                                <Card
                                    key={notif._id}
                                    onClick={() =>
                                        handleReadClick(
                                            notif as NotificationProps
                                        )
                                    }
                                    style={{
                                        borderColor:
                                            (notReaded && 'red') || '#374151',
                                    }}
                                    className={`flex flex-col w-full gap-1 p-4 border-2 ${
                                        notReaded &&
                                        'hover:shadow-2xl cursor-pointer '
                                    } rounded-xl`}
                                >
                                    <h4 className="text-[1.3rem]">
                                        {notif.title}
                                    </h4>
                                    <p className="text-[1rem]">
                                        <strong>message:</strong>{' '}
                                        <span
                                            className={`${
                                                notReaded && 'text-white'
                                            }`}
                                        >
                                            {notif.message}
                                        </span>
                                    </p>
                                    <p className="text-[1rem]">
                                        <strong>to:</strong>{' '}
                                        {(notif?.expiryDate && 'Public') ||
                                            'You'}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{' '}
                                        {formatToCustomDateTime(convertToUserTimeZone(notif.insertDate))}
                                    </p>
                                </Card>
                            )
                        })}
                </PaginatedList>
            )}
        </main>
    )
}
