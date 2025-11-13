import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { BsCoin } from 'react-icons/bs'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { apiDeleteService } from '@/services/ServiceAPI'
import './style.css'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'

const ServiceCard = ({
    serviceId,
    className,
    name,
    type,
    description,
    serviceImage,
}: {
    serviceId: string
    className: string
    name: string
    installationPrice: number
    type: string
    serviceImage: string
    description: string
}) => {
    const navigate = useNavigate()
    const onView = () => {
        navigate(`/services/${serviceId}`)
    }

    const onCode = () => {
        navigate(`/services/code/${serviceId}`)
    }
    const onDelete = () => {
        const isConfirmed = window.confirm(
            `Are you sure you want to delete the ${name} Service ?`
        )
        if (isConfirmed) {
            apiDeleteService(serviceId)
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }
    const cardFooter = (
        <div className="flex items-center gap-2 justify-center">
            <Button variant="plain" size="xs" onClick={onView}>
                View / Edit
            </Button>
            <Button variant="plain" size="xs" onClick={onCode}>
                Code
            </Button>
            <Button
                className="text-red-600"
                variant="plain"
                size="xs"
                onClick={onDelete}
            >
                delete
            </Button>
        </div>
    )

    const cardHeader = (
        <div className="flex card-header-svg items-center justify-center rounded-tl-lg rounded-tr-lg overflow-hidden">
            <ImageWithFallBack
                src={(serviceImage && serviceImage) || '/img/others/img-1.jpg'}
                alt="card header"
            />
        </div>
    )

    return (
        <div className={`max-w-xs ${className}`}>
            <Card
                clickable
                className="w-[300px] hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                header={cardHeader}
                footer={cardFooter}
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <span className="text-emerald-600 font-semibold">{type}</span>
                <h4 className="font-bold my-3">{name}</h4>
                <div className="h-16">{description}</div>
            </Card>
        </div>
    )
}

export default ServiceCard
