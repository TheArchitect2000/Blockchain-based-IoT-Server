import { Card } from '@/components/ui'
import Table from '@/components/ui/Table'
import { LogData, useGetLogs } from '@/utils/hooks/useGetLogs'
import { useNavigate } from 'react-router-dom'

import { useConfig } from '@/components/ui/ConfigProvider'
import useColorLevel from '@/components/ui/hooks/useColorLevel'

const { Tr, Th, Td, THead, TBody } = Table

const LogTable = () => {
    const navigate = useNavigate()
    const { logs, loading, error, refetch } = useGetLogs()

    const { themeColor, controlSize, primaryColorLevel } = useConfig()
    const [increaseLevel, decreaseLevel] = useColorLevel(
        primaryColorLevel as any
    )

    return (
        <Card className="col-span-2">
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
                        {loading ? (
                            <Tr>
                                <Td colSpan={3} className="text-center py-4">
                                    Loading logs...
                                </Td>
                            </Tr>
                        ) : error ? (
                            <Tr>
                                <Td colSpan={3} className="text-center py-4 text-red-500">
                                    {error}
                                </Td>
                            </Tr>
                        ) : logs && logs.length > 0 ? (
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
        </Card>
    )
}

export default LogTable
