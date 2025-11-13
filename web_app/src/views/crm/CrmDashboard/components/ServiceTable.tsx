import { Button, Card } from '@/components/ui'
import Table from '@/components/ui/Table'
import { ServiceData } from '@/utils/hooks/useGetServices'
import { useNavigate } from 'react-router-dom'
import './style.css'
import { apiGetAllPublishedServices } from '@/services/ServiceAPI'
import { useEffect, useState } from 'react'
import { useConfig } from '@/components/ui/ConfigProvider'
import useColorLevel from '@/components/ui/hooks/useColorLevel'
import { ColorLevel } from '@/components/ui/@types/common'

const { Tr, Th, Td, THead, TBody } = Table

const ServiceTable = () => {
    const navigate = useNavigate()
    const [allServices, setAllServices] = useState([])

    const { themeColor, controlSize, primaryColorLevel } = useConfig()
    const [increaseLevel, decreaseLevel] = useColorLevel(primaryColorLevel as any)

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
                            ?.slice(0, 4)
                            .map((service: ServiceData, i) => (
                                <Tr key={i}>
                                    <Td>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex ${
                                                    !service.serviceImage &&
                                                    `bg-${themeColor}-${increaseLevel}`
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
                                    <Td>{service.installationPrice} FDS</Td>
                                </Tr>
                            ))}
                    </TBody>
                </Table>
            </div>
        </Card>
    )
}

export default ServiceTable
