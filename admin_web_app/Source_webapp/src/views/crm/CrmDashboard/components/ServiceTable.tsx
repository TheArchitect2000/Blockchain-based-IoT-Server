import { Loading } from '@/components/shared'
import { Button, Card } from '@/components/ui'
import Avatar from '@/components/ui/Avatar/Avatar'
import Table from '@/components/ui/Table'
import { ServiceData, useGetServices } from '@/utils/hooks/useGetServices'
import { useNavigate } from 'react-router-dom'
import './style.css'
import { useEffect, useState } from 'react'
import { apiGetAllPublishedServices } from '@/services/ServiceAPI'
import { apiReadNotificationsByNotifIdList } from '@/services/NotificationService'

const { Tr, Th, Td, THead, TBody } = Table

const ServiceTable = () => {
    const navigate = useNavigate()
    const [allServices, setAllServices] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const datas = (await apiGetAllPublishedServices()) as any
                setAllServices(datas.data.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <Card className="col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h4>Latest Service Market</h4>
                <Button
                    size="sm"
                    onClick={() => {
                        navigate('/market')
                    }}
                >
                    View All
                </Button>
            </div>
            <div>
                <Table>
                    <THead>
                        <Tr>
                            <Th>Service Name</Th>
                            <Th>Service Type</Th>
                            <Th>Price</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {allServices
                            ?.slice(0, 5)
                            .map((service: ServiceData, i) => (
                                <Tr key={i}>
                                    <Td>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex ${
                                                    !service.serviceImage &&
                                                    'bg-[#4F46E5]'
                                                } w-[40px] h-[30px] rounded-md overflow-hidden`}
                                            >
                                                <img
                                                    src={
                                                        service.serviceImage ||
                                                        ''
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            {service.serviceName}
                                        </div>
                                    </Td>
                                    <Td>{service.serviceType}</Td>
                                    <Td>{service.installationPrice}</Td>
                                </Tr>
                            ))}
                    </TBody>
                </Table>
            </div>
        </Card>
    )
}

export default ServiceTable
