import { apiGetDevices } from '@/services/DeviceApi'
import { apiGetAllSharedServices } from '@/services/ServiceAPI'
import { useAppSelector } from '@/store'
import { useQuery } from '@tanstack/react-query'

// Define the main response type
type ApiResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
    data: UserData[]
}

// Define the type for each device data item
export type UserData = {
    activationStatus: string
    email: string
    firstName: string
    lastName: string
    mobile: string
    _id: string
    creationDate: string
}

export type RequestData = {
    nodeId: string
    nodeServiceId: string
    blocklyJson: string
    code: string
    description: string
    devices: Array<any>
    insertDate: string
    insertedBy: string
    installationPrice: number
    numberOfInstallations: number
    publishRejected: boolean
    publishRequested: boolean
    published: boolean
    rate: number
    runningPrice: number
    serviceImage: string
    serviceName: string
    serviceType: string
    status: string
    _id: string
}

export type DeviceData = {
    userId: string
    deviceName: string
    deviceType: string
    mac: string
    deviceEncryptedId: string
    isShared: string
    _id: string
    hardwareVersion: string
    firmwareVersion: string
}

export type InstalledServiceData = {
    _id: string
    serviceId: string
    installedServiceName: string
    description: string
    installedServiceImage: string
    activationStatus: string
}

export function useGetDevices() {
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { data: devices, status } = useQuery({
        queryKey: ['devices'],
        queryFn: () => apiGetDevices<ApiResponse>(userId!),
    })

    return { devices, status }
}

export function useGetSharedDevices() {
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { data: devices, status } = useQuery({
        queryKey: ['devices'],
        queryFn: () => apiGetAllSharedServices<ApiResponse>(),
    })

    return { devices, status }
}
