import ApiService from './ApiService'

export async function apiGetLogs<T>() {
    return ApiService.fetchData<T>({
        url: import.meta.env.VITE_URL + 'v1/logs',
        method: 'get',
    })
}
