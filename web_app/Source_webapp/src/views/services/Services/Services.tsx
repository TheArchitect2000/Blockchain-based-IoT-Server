import ServiceCard from './components/Card'
import { Button } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useGetService } from '@/utils/hooks/useGetService'
import Statistic from '@/views/crm/CrmDashboard/components/Statistic'
import { apiGetService } from '@/services/ServiceAPI'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/shared'

function Services() {
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(0)

    function refreshContent() {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        async function getServiceDatas() {
            const res = (await apiGetService(userId?.toString() || '')) as any
            setData(res.data.data)
            setLoading(false)
        }
        getServiceDatas()
    }, [refresh, ])

    return (
        <div>
            <h3 className="mb-4">My Services</h3>
            <Statistic />
            <div className="grid xl:grid-cols-3">
                {data &&
                    data?.map((service) => (
                        <ServiceCard
                            refresh={refreshContent}
                            serviceId={service._id}
                            key={service._id}
                            className="mt-8 mx-auto"
                            name={service.serviceName}
                            description={service.description}
                            serviceImage={service.serviceImage}
                            type={service.serviceType}
                            installationPrice={service.installationPrice}
                            serviceData={service}
                        />
                    ))}
            </div>

            {loading === true && (
                <div className="w-full h-[80vh] flex justify-center items-center">
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

export default Services
