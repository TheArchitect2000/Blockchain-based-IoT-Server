import ApiService from './ApiService'

export async function apiGetServiceById<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + `v1/storx/construct-uri`,
        method: 'get',
        headers: {},
    })
}
