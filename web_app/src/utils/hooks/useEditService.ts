import { apiEditeService } from '@/services/ServiceAPI'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'

type ApiResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
    data: ServiceData
}

type ServiceData = {
    _id: string
    serviceName: string
    description: string
    serviceType: string
    status: string | null
    devices: string[]
    numberOfInstallations: number
    installationPrice: number
    runningPrice: number
    rate: number
    serviceImage: string | null
    blocklyJson: BlocklyJson | null
    code: string | null
    insertedBy: string
    insertDate: string
}

type BlocklyJson = {
    blocks: {
        languageVersion: number
        blocks: BlockItem[]
    }
    variables?: Variable[]
}

type BlockItem = {
    type: string
    id: string
    x?: number
    y?: number
    fields: Record<string, any>
    inputs?: Record<
        string,
        {
            block: BlockItem
            shadow?: BlockItem
        }
    >
    next?: BlockItem
}

type Variable = {
    name: string
    id: string
}

export function useEditService() {
    //const { serviceId } = useParams()
    
    const { serviceId } = useAppSelector((state) => state.)


    const { data: service, status } = useQuery({
        queryKey: ['service'],
        queryFn: () => apiEditService<ApiResponse>(serviceId, serviceName, description, serviceType, status, devices, serviceImage, blocklyJson, code),
    })
    
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { data: devices, status } = useQuery({
        queryKey: ['devices'],
        queryFn: () => apiGetDevices<ApiResponse>(userId!),
    })

    return { service, status }
}
