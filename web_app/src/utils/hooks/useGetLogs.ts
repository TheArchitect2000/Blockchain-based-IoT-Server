import { useState, useEffect } from 'react'
import { apiGetLogs } from '@/services/LogApi'

type ApiResponse = {
    statusCode: number
    success: boolean
    date: string
    message: string
    data: LogData[]
}

export type LogData = {
    _id: string
    message: string
    timestamp: string
    level: string
    source?: string
    serviceId?: string
}

export const useGetLogs = () => {
    const [logs, setLogs] = useState<LogData[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const response = await apiGetLogs()
            if (response && (response as any).data) {
                setLogs((response as any).data.data || [])
            } else {
                setError('Failed to fetch logs')
            }
        } catch (err) {
            setError('Failed to fetch logs')
            console.error('Error fetching logs:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return { logs, loading, error, refetch: fetchLogs }
}
