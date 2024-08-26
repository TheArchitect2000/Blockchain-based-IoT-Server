import { apiDeleteService } from '@/services/ServiceAPI'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export type ApiResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
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

export function useDeleteService() {
    const { serviceId } = useParams()
    console.log(serviceId)

    const { data: service, status } = useQuery({
        queryKey: ['service'],
        queryFn: () => apiDeleteService<ApiResponse>(serviceId!),
    })

    return { service, status }
}
