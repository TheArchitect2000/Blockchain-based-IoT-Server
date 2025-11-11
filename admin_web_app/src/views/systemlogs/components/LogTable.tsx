import Table from '@/components/ui/Table'
import { LogData, useGetLogs } from '@/utils/hooks/useGetLogs'

const { Tr, Th, Td, THead, TBody } = Table

const LogTable = () => {
    const { logs } = useGetLogs()

    return (
        <div>
            <Table>
                <THead>
                    <Tr>
                        <Th>Message</Th>
                        <Th>Timestamp</Th>
                        <Th>Level</Th>
                    </Tr>
                </THead>
                <TBody>
                    {logs && logs.length > 0 ? (
                        logs.slice(0, 10).map((log: LogData, i: number) => (
                            <Tr key={log._id || i}>
                                <Td>{log.message}</Td>
                                <Td>
                                    {new Date(
                                        log.timestamp
                                    ).toLocaleString()}
                                </Td>
                                <Td>{log.level}</Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={3} className="text-center py-4">
                                No logs available.
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </div>
    )
}

export default LogTable
