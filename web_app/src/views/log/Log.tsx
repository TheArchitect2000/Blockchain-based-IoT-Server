import { AdaptableCard, Loading } from '@/components/shared'
import LogTable from './components/LogTable'
import { useGetLogs } from '@/utils/hooks/useGetLogs'

const LogList = () => {
    const { loading, error } = useGetLogs()

    return (
        <main className="flex flex-col gap-4 h-full">
            <h3>Activity/Logs</h3>
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="text-red-500">Error: {error}</div>
            ) : (
                <LogTable />
            )}
        </main>
    )
}

export default LogList
