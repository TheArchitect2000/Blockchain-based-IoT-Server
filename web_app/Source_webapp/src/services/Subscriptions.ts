import ApiService from './ApiService'

export async function apiGetMyEmailSubscription<T>() {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/subscriptions/check-my-email-subscription`,
        method: 'get',
    })
}

export async function apiSetMyEmailSubscription<T>(subscribe: boolean) {
    return ApiService.fetchData<T>({
        url: `${
            import.meta.env.VITE_URL
        }v1/subscriptions/set-email-subscription`,
        method: 'post',
        data: {
            subscribe: subscribe,
        },
    })
}
