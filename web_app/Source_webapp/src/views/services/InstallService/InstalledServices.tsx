import React, { useState, useEffect } from 'react'
import { apiGetInstalledServices } from '@/services/ServiceAPI'
import { useAppSelector } from '@/store'
import { DoubleSidedImage, Loading } from '@/components/shared'
import ServiceCard from '@/views/demo/component'
import { apiGetDevices } from '@/services/DeviceApi'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import CardHolder from '@/components/ui/CardHolder'

const CollapseMenuItemView1: React.FC = () => {
    const [installedServices, setInstalledServices] = useState<any[]>([]) // State to hold the fetched services
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(0)

    const navigateTo = useNavigate()

    function refreshPage() {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        const fetchInstalledServices = async () => {
            try {
                const response = await apiGetInstalledServices<any>(
                    userId || ''
                ) // Fetch installed services
                let data = response.data // Extract data from AxiosResponse
                const deviceRes = (await apiGetDevices(userId || '')) as any

                setInstalledServices(
                    data.data.map((element: any) => {
                        deviceRes.data.data.forEach((device: any) => {
                            if (
                                element &&
                                element.deviceMap &&
                                device.deviceEncryptedId ==
                                    element.deviceMap.MULTI_SENSOR_1
                            ) {
                                element.deviceName = device.deviceName
                                element.mac = device.mac
                            }
                        })
                        return element
                    })
                ) // Update state with fetched services data
            } catch (error) {
                console.error('Error fetching installed services:', error)
            }
            setLoading(false)
        }

        fetchInstalledServices() // Call the function to fetch services when the component mounts
    }, [refresh])

    return (
        <div>
            <div className="w-full flex justify-between pb-4">
                <h3 className="">Installed Services</h3>
            </div>

            <CardHolder>
                {loading === false &&
                    installedServices?.map((service) => (
                        <ServiceCard
                            serviceId={service._id}
                            className="mt-8 mx-auto"
                            name={service.installedServiceName}
                            description={service.description}
                            type={service.activationStatus}
                            installationPrice={service.installationPrice}
                            serviceImage={service.installedServiceImage}
                            deviceName={service.deviceName}
                            deviceMac={service.mac}
                            refresh={refreshPage}
                        />
                    ))}
            </CardHolder>

            {loading === true && (
                <div className="w-full h-[80vh] flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}

            {loading === false && installedServices.length === 0 && (
                <section className="w-full h-[75dvh] flex flex-col gap-3 items-center justify-center">
                    <DoubleSidedImage
                        className="w-2/12 max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3>No services installed!</h3>
                    <Button
                        onClick={() => {
                            navigateTo('/market')
                        }}
                        variant="solid"
                        color="green-600"
                    >
                        Explore Service Market
                    </Button>
                </section>
            )}
        </div>
    )
}

export default CollapseMenuItemView1
