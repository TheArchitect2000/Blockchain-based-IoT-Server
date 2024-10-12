import { useGetServices } from '@/utils/hooks/useGetServices'
import ServiceCard from './components/Card'
import Statistic from '../crm/CrmDashboard/components/Statistic'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'
import {
    apiGetAllPublishedServices,
    apiGetAllRequestPublishServices,
    apiGetAllServices,
} from '@/services/ServiceAPI'
import CardHolder from '@/components/ui/CardHolder'

function Market() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>([])

    useEffect(() => {
        async function getDatas() {
            const res = (await apiGetAllPublishedServices()) as any
            setData(res?.data?.data)
            setLoading(false)
        }
        getDatas()
    }, [])

    return (
        <div>
            <h3 className="pb-4">Service Market</h3>
            <Statistic />
            {(loading === false && (
                <CardHolder>
                    {data?.map((service: any) => (
                        <ServiceCard
                            key={service._id}
                            className=""
                            node={service.nodeId || ''}
                            name={service.serviceName}
                            description={service.description}
                            type={service.serviceType}
                            installationPrice={service.installationPrice}
                            serviceImage={service.serviceImage || ''}
                            serviceData={service}
                        />
                    ))}
                </CardHolder>
            )) || (
                <div className="w-full h-[65vh] flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}

            {loading === false && data.length === 0 && (
                <div className="w-full h-[65vh] flex justify-center items-center">
                    <h1>Data not found !</h1>
                </div>
            )}
        </div>
    )
}

export default Market
