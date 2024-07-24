import { apiGetAllServices } from '@/services/ServiceAPI'
import { useQuery } from '@tanstack/react-query'

type ApiResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
    data: ServiceData[]
}

export type ServiceData = {
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

export function useGetServices() {
    const { data: services, status } = useQuery({
        queryKey: ['services'],
        queryFn: apiGetAllServices<ApiResponse>,
    })

    return { services, status }
}
