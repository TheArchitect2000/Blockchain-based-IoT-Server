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

export async function apiConstructUri<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/storx/construct-uri`,
        method: 'get',
        headers: {},
    })
}

export async function apiPostStorxCredentials<T>(accessGrant: string) {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/storx/credentials`,
        method: 'post',
        data: { accessGrant },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export async function apiGetStorxCredentials<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/storx/credentials`,
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}
