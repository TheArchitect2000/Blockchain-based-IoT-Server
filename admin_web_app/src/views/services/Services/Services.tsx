import { useGetServices } from '@/utils/hooks/useGetServices'
import ServiceCard from './components/Card'
import { Button } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useGetService } from '@/utils/hooks/useGetService'
import Statistic from '@/views/crm/CrmDashboard/components/Statistic'
import { apiGetService } from '@/services/ServiceAPI'
import { useEffect, useState } from 'react'

function Services() {
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [data, setData] = useState(null)

    useEffect(() => {
        async function getServiceDatas() {
            const res = await apiGetService(userId?.toString() || '') as any
            setData(res.data.data)
        }
        getServiceDatas()
    }, [])

    return (
        <div>
            <h3 className="mb-4">My Services</h3>
            <Statistic />

            <div className="grid xl:grid-cols-3">
                {data &&
                    data?.map((service) => (
                        <ServiceCard
                            serviceId={service._id}
                            key={service._id}
                            className="mt-8 mx-auto"
                            name={service.serviceName}
                            description={service.description}
                            serviceImage={service.serviceImage}
                            type={service.serviceType}
                            installationPrice={service.installationPrice}
                        />
                    ))}
            </div>
        </div>
    )
}

export default Services
