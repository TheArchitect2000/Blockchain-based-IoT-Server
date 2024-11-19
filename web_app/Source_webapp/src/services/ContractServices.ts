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

export async function apiZKPPublishProof(
    deviceType: string,
    proof: string,
    data: Object
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/publish-proof',
        method: 'post',
        data: {
            deviceType,
            proof,
            data,
        },
    })
}

export async function apiStoreCommitment(
    manufacturerName: string,
    deviceName: string,
    deviceType: string,
    hardwareVersion: string,
    firmwareVersion: string,
    lines: string,
    commitmentData: string
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/store-commitment',
        method: 'post',
        data: {
            manufacturerName: manufacturerName,
            deviceName: deviceName,
            deviceType: deviceType,
            hardwareVersion: hardwareVersion,
            firmwareVersion: firmwareVersion,
            lines: lines,
            commitmentData: commitmentData,
        },
    })
}

export async function apiRemoveCommitment(
    commitmentId: string,
    nodeId: string
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/remove-commitment',
        method: 'post',
        data: {
            commitmentId: commitmentId,
            nodeId: nodeId,
        },
    })
}

export async function apiGetMyCommitments() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/my-commitments',
        method: 'get',
    })
}

export async function apiGetAdminWalletData() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/admin-wallet',
        method: 'get',
    })
}

export async function apiGetFaucetWalletData() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/faucet-wallet',
        method: 'get',
    })
}
