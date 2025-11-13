import ApiService from './ApiService'

export async function apiSendNotificationToUser<T>(
    userId: string,
    title: string,
    message: string
) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            'v1/notification/add-notification-by-user-id',
        method: 'post',
        data: {
            userId,
            title,
            message,
        },
    })
}

export async function apiSendPublicNotification<T>(
    title: string,
    message: string,
    expiryDate: number
) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            'v1/notification/add-public-notification',
        method: 'post',
        data: {
            title,
            message,
            expiryDate,
        },
    })
}

export async function apiGetPublicNotifications<T>() {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/notification/get-public-notifications`,
        method: 'get',
    })
}

export async function apiGetNotificationByNotifId<T>(notifId: string) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/notification/get-notification-by-id/${notifId}`,
        method: 'get',
    })
}

export async function apiGetUserNotificationsByUserId<T>(userId: string) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/notification/get-unread-notifications-by-user-id/${userId}`,
        method: 'get',
    })
}

export async function apiGetAllUserNotificationsByUserId<T>(userId: string) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/notification/get-all-notifications-by-user-id/${userId}`,
        method: 'get',
    })
}

export async function apiReadNotificationsByNotifIdList<T>(
    notifIdList: string[]
) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/notification/read-notification-by-notif-id-list`,
        method: 'patch',
        data: {
            notifications: notifIdList,
        },
    })
}

export async function apiEditNotificationByNotifId<T>(
    notifId: string,
    title: string,
    message: string,
    expiryDate?: number
) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/notification/edit-notification-by-id`,
        method: 'patch',
        data: {
            notifId,
            title,
            message,
            expiryDate: (expiryDate && expiryDate) || 0,
        },
    })
}



