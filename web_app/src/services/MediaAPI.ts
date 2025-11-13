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

export async function apiUploadMedia<T>(
    mediaType: string,
    imageFile: FormData
) {
    return ApiService.fetchData<T>({
        url: `${import.meta.env.VITE_URL}v1/media/upload?type=${mediaType}`,
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: imageFile as any,
    })
}
