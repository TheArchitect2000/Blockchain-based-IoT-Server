import ApiService from './ApiService'

export async function apiGetWalletBalance() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/get-wallet-balance',
        method: 'get',
    })
}

export async function apiRequestFaucet() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/request-faucet',
        method: 'post',
    })
}

export async function apiGetAdminWalletAddress() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/admin-wallet-address',
        method: 'get',
    })
}

export async function apiGetFaucetWalletAddress() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/faucet-wallet-address',
        method: 'get',
    })
}