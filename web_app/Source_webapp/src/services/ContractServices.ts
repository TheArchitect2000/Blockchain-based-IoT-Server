import ApiService from './ApiService'

export async function apiGetWalletBalance() {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/get-wallet-balance',
        method: 'get',
    })
}

export async function apiRequestFaucet(
    type: 'identity' | 'ownership',
    walletAddress?: string
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/request-faucet',
        method: 'post',
        data: {
            type: type,
            ownerShipWalletAddress: walletAddress,
        },
    })
}

export async function apiZKPPublishProof(
    deviceType: string,
    proof: string,
    data: Object,
    frontPublish = false
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/publish-proof',
        method: 'post',
        data: {
            deviceType,
            proof,
            data,
            frontPublish,
        },
    })
}

export async function apiStoreCommitment(
    commitmentID: string,
    deviceType: string,
    deviceIdType: string,
    deviceModel: string,
    manufacturer: string,
    softwareVersion: string,
    commitmentData: string,
    transactionId: null | string = null,
    frontPublish = false
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/store-commitment',
        method: 'post',
        data: {
            deviceType: deviceType,
            deviceIdType: deviceIdType,
            deviceModel: deviceModel,
            manufacturer: manufacturer,
            softwareVersion: softwareVersion,
            commitmentData: commitmentData,
            commitmentID: commitmentID,
            frontPublish: frontPublish,
            transactionId: transactionId,
        },
    })
}

export async function apiRemoveCommitment(
    commitmentId: string,
    dbId: string,
    nodeId: string
) {
    return ApiService.fetchData({
        url: import.meta.env.VITE_URL + 'v1/contract/remove-commitment',
        method: 'post',
        data: {
            commitmentId: commitmentId,
            dbId: dbId,
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
