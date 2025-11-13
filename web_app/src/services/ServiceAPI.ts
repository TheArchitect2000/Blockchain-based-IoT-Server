import ApiService from './ApiService'

function getCookie(name: string): string | null {
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

export async function apiGetServiceByServiceId<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/service/get-service-by-service-id/${serviceId}`,
        method: 'get',
    })
}

export async function apiGetAllPublishedServices<T>() {
    return ApiService.fetchData<T>(
        {
            url:
                import.meta.env.VITE_URL +
                'v1/service/get-all-published-services',
            method: 'get',
        },
        5 * 60 * 1000
    )
}

export async function apiSendServicePublishRequest<T>(serviceId: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/service/request-service-publish',
        method: 'patch',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            serviceId: serviceId,
        },
    })
}

export async function apiGetAllInstalledServices<T>(userId: string) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/installed-service/get-installed-services-by-user-id/${userId}`,
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function apiInstallNewService<T>(data: any) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/installed-service/insert`,
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: data,
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
