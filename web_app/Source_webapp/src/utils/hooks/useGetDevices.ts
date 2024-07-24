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
    data: DeviceData[]
}

// Define the type for each device data item
export type DeviceData = {
    location: Location
    geometry: Geometry
    _id: string
    userId: string
    deviceName: string
    deviceType: string
    mac: string
    deviceEncryptedId: string
    hardwareVersion: number
    firmwareVersion: number
    parameters: DeviceParameter[]
    isShared: boolean
    costOfUse: number
    insertedBy: string
    insertDate: string
    isDeleted: boolean
    updatedBy: string
    updateDate: string
}

// Define the Location type
type Location = {
    coordinates: number[] // Assuming coordinates are numbers, update if different
}

// Define the Geometry type
type Geometry = {
    coordinates: number[] // Assuming coordinates are numbers, update if different
}

// Define the type for device parameters
type DeviceParameter = {
    title: string
    ui: string
    unit: string | number // Unit can be a string or a number based on your data
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

