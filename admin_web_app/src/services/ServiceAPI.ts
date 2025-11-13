import ApiService from './ApiService'
export function getCookie(name: string): string | null {
    const cookieString: string = document.cookie
    const cookies: string[] = cookieString
        .split(';')
        .map((cookie) => cookie.trim())

    for (const cookie of cookies) {
        const [cookieName, cookieValue]: string[] = cookie.split('=')
        if (cookieName === name) {
            return decodeURIComponent(cookieValue)
        }
    }

    return null
}

const accessToken = getCookie('accessToken')

export async function apiGetAllServices<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/get-all-services',
        method: 'get',
    })
}

export async function apiGetAllRequestPublishServices<T>() {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            'v1/service/get-all-publish-requested-services',
        method: 'get',
    })
}

export async function apiGetAllPublishedServices<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/get-all-published-services',
        method: 'get',
    })
}

export async function apiGetAllInstalledServices<T>() {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            'v1/installed-service/get-all-installed-services  ',
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function apiGetInstalledServices<T>(userId: string) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/installed-service/get-installed-services-by-user-id/${userId}`,
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function apiDeleteInstalledServiceById<T>(
    installedServiceId: string
) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/installed-service/delete-installed-service-by-installed-service-id/${installedServiceId}`,
        method: 'delete',
    })
}

export async function apiPublishService<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/publish-service',
        method: 'patch',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            serviceId: serviceId,
        },
    })
}

export async function apiRejectService<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/reject-service',
        method: 'patch',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            serviceId: serviceId,
        },
    })
}

export async function apiCancelServiceRequest<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/cancel-service-request',
        method: 'patch',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            serviceId: serviceId,
        },
    })
}

export async function apiUninstalleServiceById<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url:
            import.meta.env.VITE_URL +
            `v1/installed-service/delete-installed-service-by-installed-service-id/${serviceId}`,
        method: 'delete',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

// create new service
export async function apiCreateNewService<T>(newServiceData: any) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/insert',
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: newServiceData,
    })
}
// edit service
export async function apiEditServicesById<T>(serviceData: any) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/edit',
        method: 'patch',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: serviceData,
    })
}
// delete service
export async function apiDeleteService<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/service/delete-service-by-service-id/${serviceId}`,
        method: 'delete',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}
// get service by ID
export async function apiGetService<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/service/get-services-by-user-id/${userId}`,
        method: 'get',
    })
}

export async function apiGetAllSharedServices<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/device/get-all-shared-devices',
        method: 'get',
    })
}

//export async function apiEditeService<T>(serviceId: string, serviceName: string, description: string, serviceType: string, status: string, devices: [string], serviceImage: string, blocklyJson: string, code: string) {

export async function apiEditService<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/service/edit`,
        method: 'patch',
        data,
        // data: `{
        //     "serviceId": ${serviceId},
        //     "serviceName": ${serviceName},
        //     "description": ${description},
        //     "serviceType": ${serviceType},
        //     "status": ${status},
        //     "devices": [
        //       ${devices}
        //     ],
        //     "serviceImage": ${serviceImage},
        //     "blocklyJson": ${blocklyJson},
        //     "code": ${code}
        //   }`
    })
}
