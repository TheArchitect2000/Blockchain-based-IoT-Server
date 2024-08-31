import { ServiceData } from '@/utils/hooks/useGetServices'
import ServiceCard from './components/Card'
import Statistic from '../crm/CrmDashboard/components/Statistic'
import { useEffect, useState } from 'react'
import { apiGetAllPublishedServices } from '@/services/ServiceAPI'
import { Loading } from '@/components/shared'
import { Button } from '@/components/ui'

function Market() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<ServiceData[]>([])
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

    useEffect(() => {
        async function getDatas() {
            const res = (await apiGetAllPublishedServices()) as any
            setData(res?.data?.data)
            setLoading(false)
        }
        getDatas()
    }, [])

    const nodeIds = Array.from(
        new Set(data.map((service: any) => service.nodeId))
    )

    const filteredData = selectedNodeId
        ? data.filter((service: any) => service.nodeId === selectedNodeId)
        : data

    const sortedData = [...filteredData].sort((a: any, b) =>
        a.nodeId === selectedNodeId ? -1 : 1
    )

    return (
        <div>
            <h3 className="pb-4">Service Market</h3>
            <Statistic />

            <div className="flex border-b  mt-6 items-center justify-start gap-6 p-4">
                {nodeIds.map((nodeId) => (
                    <Button
                        key={nodeId}
                        onClick={() => setSelectedNodeId(nodeId)}
                        variant={
                            selectedNodeId === nodeId ? 'solid' : 'default'
                        }
                    >
                        {nodeId.split(".")[0]}
                    </Button>
                ))}
                <Button
                    onClick={() => setSelectedNodeId(null)}
                    variant={selectedNodeId === null ? 'solid' : 'default'}
                >
                    All
                </Button>
            </div>

            {/* Render services */}
            {(loading === false && (
                <div className="grid xl:grid-cols-3 gap-4">
                    {sortedData.map((service: ServiceData) => (
                        <ServiceCard
                            key={service._id}
                            className="mt-8 mx-auto"
                            node={service.nodeId || ''}
                            name={service.serviceName}
                            description={service.description}
                            type={service.serviceType}
                            installationPrice={service.installationPrice}
                            serviceImage={service.serviceImage || ''}
                            serviceData={service}
                        />
                    ))}
                </div>
            )) || (
                <div className="w-full h-[65vh] flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}

            {loading === false && sortedData.length === 0 && (
                <div className="w-full h-[65vh] flex justify-center items-center">
                    <h1>Data not found!</h1>
                </div>
            )}
        </div>
    )
}

export default Market
