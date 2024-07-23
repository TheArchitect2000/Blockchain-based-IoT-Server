import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { BsCoin } from 'react-icons/bs'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'
import "./style.css"

const ServiceCard = ({
    className,
    name,
    installationPrice,
    type,
    description,
    serviceImage,
}: {
    serviceImage: string
    className: string
    name: string
    installationPrice: number
    type: string
    description: string
}) => {
    const cardFooter = (
        <div className="flex items-center gap-2">
            <BsCoin size="32" />
            <span>
                <h6 className="text-sm">Installation Price</h6>
                <span className="text-xs">${installationPrice}</span>
            </span>
        </div>
    )

    const cardHeader = (
        <div className="flex card-header-image !rounded-none items-center justify-center overflow-hidden">
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
                <div
                    className="h-16 line-clamp-4"
                    style={{ textOverflow: 'ellipsis' }}
                >
                    {description}
                </div>
            </Card>
        </div>
    )
}

export default ServiceCard
