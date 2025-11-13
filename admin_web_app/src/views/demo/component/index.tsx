import { Button, Card } from '@/components/ui'
import { apiUninstalleServiceById } from '@/services/ServiceAPI'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'

const ServiceCard = ({
    serviceId,
    className,
    name,
    type,
    description,
    serviceImage,
}: {
    serviceImage: string
    serviceId: string
    className: string
    name: string
    installationPrice: number
    type: string
    description: string
}) => {
    const onDelete = () => {
        const isConfirmed = window.confirm(
            `Are you sure you want to delete the ${name} Service ?`
        )
        if (isConfirmed) {
            apiUninstalleServiceById(serviceId)
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }

    const cardFooter = (
        <div className="flex items-center gap-2 justify-center">
            <Button variant="solid" size="sm" onClick={onDelete}>
                Uninstall
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
                <div className="h-16 line-clamp-4">{description}</div>
            </Card>
        </div>
    )
}

export default ServiceCard
