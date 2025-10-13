import React, { useState, useEffect } from 'react'
import { apiGetInstalledServices } from '@/services/ServiceAPI'
import { useAppSelector } from '@/store'
import { DoubleSidedImage, Loading } from '@/components/shared'
import ServiceCard from '@/views/demo/component'
import {
    apiGetAllSharedDevices,
    apiGetDevices,
    apiGetSharedWithMeDevices,
} from '@/services/DeviceApi'
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
                const myRes = (await apiGetDevices(userId || '')) as any
                const sharedRes = (await apiGetAllSharedDevices()) as any
                const localSharedRes =
                    (await apiGetSharedWithMeDevices()) as any

                const deviceRes_ids = new Set(
                    myRes.data.data.map((device: any) => device._id)
                )

                // Extract _id values from deviceRes
                const localDevices_ids = new Set(
                    localSharedRes.data.data.map((device: any) => device._id)
                )

                // Filter sharedDevices to exclude devices that are already in deviceRes
                const filteredSharedDevices = sharedRes.data.data
                    .filter(
                        (device: any) =>
                            !deviceRes_ids.has(device.nodeDeviceId) &&
                            !deviceRes_ids.has(device._id) &&
                            !localDevices_ids.has(device.nodeDeviceId) &&
                            !localDevices_ids.has(device._id)
                    )
                    .map((item: any) => {
                        return { ...item, isShared: true }
                    })

                const updatedFilteredmyLocalDevices = localSharedRes.data.data.map(
                    (item: any) => {
                        return { ...item, isLocal: true }
                    }
                )

                const updatedFilteredMyDevices = myRes.data.data.map((item: any) => {
                    return { ...item, myDevice: true }
                })

                const deviceRes = [
                    ...filteredSharedDevices,
                    ...updatedFilteredmyLocalDevices,
                    ...updatedFilteredMyDevices,
                ]

                const filteredInstalledServices = data.data.map(
                    (element: any) => {
                        if (!element?.devices) {
                            element.devices = {}
                        }
                        const installedServiceDevices = element.deviceMap

                        Object.keys(installedServiceDevices).map(
                            (key: string) => {
                                deviceRes.forEach((device: any) => {
                                    if (
                                        element &&
                                        element.deviceMap &&
                                        device.deviceEncryptedId ==
                                            installedServiceDevices[key]
                                    ) {
                                        element.devices[key] = {
                                            name: device.deviceName,
                                            mac: device.mac,
                                            encryptedId:
                                                device.deviceEncryptedId,
                                        }
                                    }
                                })
                            }
                        )

                        return element
                    }
                )

                setInstalledServices(filteredInstalledServices) // Update state with fetched services data
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
                    installedServices?.map((service, index) => (
                        <ServiceCard
                            key={index}
                            serviceId={service._id}
                            className="mt-8 mx-auto"
                            name={service.installedServiceName}
                            description={service.description}
                            type={service.activationStatus}
                            installationPrice={service.installationPrice}
                            serviceImage={service.installedServiceImage}
                            devices={service.devices}
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
                        className="w-2/12 min-w-[125px] max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <p className='text-center text-lg text-white'>No services were installed!</p>
                    <Button
                        onClick={() => {
                            navigateTo('/market')
                        }}
                        variant="solid"
                    >
                        Explore Service Market
                    </Button>
                </section>
            )}
        </div>
    )
}

export default CollapseMenuItemView1
