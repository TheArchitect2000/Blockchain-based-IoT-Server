import ApiService from './ApiService'

export async function apiGetDevices<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device/get-devices-by-user-id/${userId}`,
        method: 'get',
    })
}


export async function apiGetAllDevices<T>() {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device/get-all-devices/`,
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

export async function apiGetDeviceLogByEncryptedIdAndNumberOfDays<T>(
    encryptedId: string,
    days: number
) {
    const params = new URLSearchParams({
        deviceEncryptedId: encryptedId,
        fieldName: 'data',
        daysBefore: days,
    } as any)

    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/device-log/get-device-log-by-encrypted-deviceid-and-field-name-and-number-of-days-before?${params.toString()}`,
        method: 'get',
    })
}