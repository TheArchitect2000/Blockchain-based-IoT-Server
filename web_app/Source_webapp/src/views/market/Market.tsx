import { ServiceData } from '@/utils/hooks/useGetServices'
import ServiceCard from './components/Card/Card'
import Statistic from '../crm/CrmDashboard/components/Statistic'
import { useEffect, useState } from 'react'
import { apiGetAllPublishedServices } from '@/services/ServiceAPI'
import { Loading } from '@/components/shared'
import { Button } from '@/components/ui'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { apiGetAllSharedDevices, apiGetDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import CardHolder from '@/components/ui/CardHolder'

function Market() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<ServiceData[]>([])
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [myDevices, setMyDevices] = useState<DeviceData[]>([])
    const [sharedDevices, setSharedDevices] = useState<DeviceData[]>([])

    const { _id: userId } = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        async function getDatas() {
            const res = (await apiGetAllPublishedServices()) as any
            setData(res?.data?.data)
            const myRes = (await apiGetDevices(userId || '')) as any
            setMyDevices(myRes?.data.data!)
            const sharedRes = (await apiGetAllSharedDevices()) as any
            setSharedDevices(sharedRes?.data.data!)
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

            <h4 className="mt-8">
                Available IoT Servers in FidesInnova Network
            </h4>
            <div className="flex items-center justify-start gap-6 p-4">
                {nodeIds.map((nodeId) => (
                    <Button
                        key={nodeId}
                        onClick={() => setSelectedNodeId(nodeId)}
                        variant={
                            selectedNodeId === nodeId ? 'solid' : 'default'
                        }
                    >
                        {nodeId.split('.')[0]}
                    </Button>
                ))}
                <Button
                    onClick={() => setSelectedNodeId(null)}
                    variant={selectedNodeId === null ? 'solid' : 'default'}
                >
                    All
                </Button>
            </div>

            <h4 className="mt-6">Available Service Contracts</h4>

            {(loading === false && (
                <CardHolder>
                    {sortedData.map((service: ServiceData) => (
                        <ServiceCard
                            sharedDevices={sharedDevices}
                            myDevices={myDevices}
                            key={service._id}
                            className=""
                            serviceData={service}
                        />
                    ))}
                </CardHolder>
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
