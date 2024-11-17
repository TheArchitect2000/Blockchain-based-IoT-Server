import { Button, Card, Dialog } from '@/components/ui'
import { apiUninstalleServiceById } from '@/services/ServiceAPI'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'
import { useState } from 'react'

const ServiceCard = ({
    serviceId,
    className,
    name,
    type,
    description,
    serviceImage,
    refresh,
    devices,
}: {
    serviceImage: string
    serviceId: string
    className: string
    name: string
    installationPrice: number
    type: string
    description: string
    refresh: Function
    devices: Object
}) => {
    const [loading, setLoading] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const onDelete = async () => {
        setLoading(true)
        const res = await apiUninstalleServiceById(serviceId)
        refresh()
    }

    const cardFooter = (
        <div className="flex items-center gap-2 justify-center">
            <Button
                loading={loading}
                variant="solid"
                size="sm"
                onClick={() => setDeleteModal(true)}
            >
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
            <Dialog
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                contentClassName="w-1/3 h-1/3"
                closable={false}
            >
                <h3 className="mb-8">Delete Confirm</h3>
                <h4 className="mb-6 text-center">
                    Are you sure you want to delete the "{name}" Service ?
                </h4>
                <div className="flex justify-center w-3/5 justify-between mx-auto">
                    <Button
                        className="px-6"
                        variant="solid"
                        color="red"
                        size="sm"
                        onClick={onDelete}
                        loading={loading}
                    >
                        Delete
                    </Button>
                    <Button
                        className="px-6"
                        variant="default"
                        size="sm"
                        onClick={() => setDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
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
                {Object.values(devices).map((value: any, index: number) => (
                    <div className="flex flex-col">
                        <p>
                            Device Name: <strong>{value.name}</strong>
                        </p>
                        <p>
                            Device Mac: <strong>{value.mac}</strong>
                        </p>
                        {Object.values(devices).length > 1 &&
                            index !== Object.values(devices).length - 1 && (
                                <p className="my-1">
                                    -------------------------
                                </p>
                            )}
                    </div>
                ))}

                <div className="h-16 pt-4 line-clamp-4">{description}</div>
            </Card>
        </div>
    )
}

export default ServiceCard
