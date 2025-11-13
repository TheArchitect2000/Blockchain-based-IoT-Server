import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui'
import ServiceCard from './component'
import { apiGetInstalledServices } from '@/services/ServiceAPI'
import { useAppSelector } from '@/store'


const CollapseMenuItemView1: React.FC = () => {
    const [installedServices, setInstalledServices] = useState<any[]>([]) // State to hold the fetched services
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    useEffect(() => {
        const fetchInstalledServices = async () => {
            try {
                const response = await apiGetInstalledServices<any>(userId) // Fetch installed services
                const data = response.data // Extract data from AxiosResponse
                setInstalledServices(data.data) // Update state with fetched services data
            } catch (error) {
                console.error('Error fetching installed services:', error)
            }
        }

        fetchInstalledServices() // Call the function to fetch services when the component mounts
    }, [])

    return (
        <div>
            <h3 className="pb-4">Installed Services</h3>
            <div className="grid xl:grid-cols-3">
                {installedServices?.map((service) => (
                    <ServiceCard
                        serviceId={service._id}
                        className="mt-8 mx-auto"
                        name={service.installedServiceName}
                        description={service.description}
                        type={service.activationStatus}
                        installationPrice={service.installationPrice}
                        serviceImage={service.installedServiceImage}
                    />
                ))}
            </div>
            
        </div>
    )
}

export default CollapseMenuItemView1
