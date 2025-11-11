import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import LogTable from '@/views/systemlogs/components/LogTable'

const SystemLogs = () => {
    return (
        <Container>
            <AdaptableCard>
                <div className="mb-6">
                    <h3>Activity/System Logs</h3>
                </div>
                <LogTable />
            </AdaptableCard>
        </Container>
    )
}

export default SystemLogs

