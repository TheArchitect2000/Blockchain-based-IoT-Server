import ServiceCard from './components/Card'
import { Button } from '@/components/ui'
import { useAppSelector } from '@/store'
import { useGetService } from '@/utils/hooks/useGetService'
import Statistic from '@/views/crm/CrmDashboard/components/Statistic'
import { apiGetService } from '@/services/ServiceAPI'
import { useEffect, useState } from 'react'
import { DoubleSidedImage, Loading } from '@/components/shared'
import { useNavigate } from 'react-router-dom'
import CardHolder from '@/components/ui/CardHolder'

function Services() {
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(0)

    const navigateTo = useNavigate()

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
    }, [refresh])

    return (
        <div>
            <h3 className="mb-4">My Services</h3>
            <Statistic />

            <CardHolder>
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
            </CardHolder>

            {loading === true && (
                <div className="w-full h-[80vh] flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}

            {loading === false && data.length === 0 && (
                <section className="w-full h-[75dvh] flex flex-col gap-3 items-center justify-center">
                    <DoubleSidedImage
                        className="w-2/12 min-w-[125px] max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3>No services created!</h3>
                    <Button
                        onClick={() => {
                            navigateTo('/services/new')
                        }}
                        variant="solid"
                        color="green-600"
                    >
                        Create New Service
                    </Button>
                </section>
            )}
        </div>
    )
}

export default Services
