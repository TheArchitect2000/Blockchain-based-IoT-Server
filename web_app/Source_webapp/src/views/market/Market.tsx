import { ServiceData } from '@/utils/hooks/useGetServices'
import ServiceCard from './components/Card'
import Statistic from '../crm/CrmDashboard/components/Statistic'
import { useEffect, useState } from 'react'
import { apiGetAllPublishedServices } from '@/services/ServiceAPI'
import { Loading } from '@/components/shared'

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
                <div className="grid xl:grid-cols-3">
                    {data?.map((service: ServiceData) => (
                        <ServiceCard
                            key={service._id}
                            className="mt-8 mx-auto"
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

            {loading === false && data.length === 0 && (
                <div className="w-full h-[65vh] flex justify-center items-center">
                    <h1>Data not found !</h1>
                </div>
            )}
        </div>
    )
}

export default Market
