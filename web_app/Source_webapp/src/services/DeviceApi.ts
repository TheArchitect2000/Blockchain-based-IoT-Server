import ApiService from './ApiService'

export async function apiGetDevices<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device/get-devices-by-user-id/${userId}`,
        method: 'get',
    })
}

export async function apiGetNodeDevices<T>() {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/devices`,
        method: 'get',
    })
}

export async function apiDeleteDeviceById<T>(deviceId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device/delete-device-by-device-id/${deviceId}`,
        method: 'delete',
    })
}

export async function apiRenameDevice<T>(deviceId: string, deviceName: string) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/rename-device`,
        method: 'patch',
        data: {
            deviceId: deviceId,
            deviceName: deviceName,
        },
    })
}

export async function apiEditDevice<T>(deviceId: string, data: Object) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/edit`,
        method: 'patch',
        data: {
            deviceId: deviceId,
            ...data,
        },
    })
}

export async function apiGlobalShare<T>(deviceId: string, data: Object) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/global-share/${deviceId}`,
        method: 'patch',
        data: {
            ...data,
        },
    })
}

export async function apiGetAllSharedDevices<T>() {
    return ApiService.fetchData<T>(
        {
            url: `${import.meta.env.VITE_URL}v1/device/get-all-shared-devices`,
            method: 'get',
        },
        2 * 60 * 1000
    )
}

export async function apiGetDeviceLogByEncryptedIdAndNumberOfDays<T>(
    encryptedId: string,
    days: number
) {
    const params = new URLSearchParams({
        deviceEncryptedId: encryptedId,
        fieldName: '',
        daysBefore: days,
    } as any)

    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device-log/get-device-log-by-encrypted-deviceid-and-field-name-and-number-of-days-before?${params.toString()}`,
        method: 'get',
    })
}

export async function apiGetLastDeviceLogByEncryptedId<T>(encryptedId: string) {
    const params = new URLSearchParams({
        deviceEncryptedId: encryptedId,
        fieldName: 'data',
    } as any)

    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device-log/get-last-device-log-by-encrypted-deviceid-and-field-name?${params.toString()}`,
        method: 'get',
    })
}

export async function apiGetSharedWithMeDevices<T>() {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/get-my-local-shared-devices`,
        method: 'get',
    })
}

export async function apiLocalShareDeviceWithUserId<T>(
    deviceId: string,
    userEmail: string
) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/local-share`,
        method: 'patch',
        data: {
            deviceId,
            userEmail,
        },
    })
}

export async function apiLocalUnshareDeviceWithUserId<T>(
    deviceId: string,
    userEmail: string
) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/local-unshare`,
        method: 'patch',
        data: {
            deviceId,
            userEmail,
        },
    })
}

export async function apiGetLocalShareUsersWithDeviceId<T>(deviceId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device/${deviceId}/local-share/users`,
        method: 'get',
    })
}

export async function apiUnshareDevice<T>(deviceId: string) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/device/global-unshare/${deviceId}`,
        method: 'patch',
    })
}
