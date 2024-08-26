import { apiGetWalletBalance } from '@/services/ContractServices'
import { useQuery } from '@tanstack/react-query'

export function useWalletBalance() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['walletBalance'],
        queryFn: apiGetWalletBalance,
        staleTime: 0, // Always consider data stale and re-fetch
        gcTime: 0, // Cache data for 5 minutes
    })

    return {
        data: data?.data as any,
        isError,
        isLoading,
    }
}
