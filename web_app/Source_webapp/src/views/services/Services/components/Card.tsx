import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { BsCoin } from 'react-icons/bs'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import {
    apiDeleteService,
    apiSendServicePublishRequest,
} from '@/services/ServiceAPI'
import './style.css'
import { useEffect, useState } from 'react'
import { SyntaxHighlighter } from '@/components/shared'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'

export function formatISODate(isoDate: string) {
    // Create a new Date object from the ISO string
    const date = new Date(isoDate)

    // Extract date components
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0')

    // Extract time components
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    // Format the date and time
    const formattedDate = `${year}-${month}-${day}`
    const formattedTime = `${hours}:${minutes}:${seconds}`

    // Combine date and time with a comma
    return `${formattedDate} , ${formattedTime}`
}

const ServiceCard = ({
    refresh,
    serviceId,
    className,
    name,
    type,
    description,
    serviceImage,
    serviceData,
}: {
    serviceData: any
    refresh: Function
    serviceId: string
    className: string
    name: string
    installationPrice: number
    type: string
    serviceImage: string
    description: string
}) => {
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [codeModal, setCodeModal] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [disableAll, setDisableAll] = useState(false)
    const navigate = useNavigate()
    const onView = () => {
        navigate(`/services/${serviceId}`)
    }

    useEffect(() => {
        if (
            serviceData.published === true ||
            serviceData.publishRejected === true ||
            serviceData.publishRequested === true
        ) {
            setDisableAll(true)
        }
    }, [serviceData])

    const onCode = () => {
        navigate(`/services/code/${serviceId}`)
    }
    const onDelete = async () => {
        setDeleteLoading(true)
        const res = (await apiDeleteService(serviceId)) as any
        refresh()
        if (res?.data?.data?.success === false) {
            toast.push(
                <Notification
                    title={'Error while deleting service'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            toast.push(
                <Notification title={'Service Saved'} type="success" />,
                {
                    placement: 'top-center',
                }
            )
        }
    }
    const cardFooter = (
        <div className="flex flex-col w-full gap-2">
            <div className="flex items-center gap-2 justify-center">
                <Button
                    disabled={disableAll}
                    variant="plain"
                    size="xs"
                    onClick={onView}
                    loading={deleteLoading}
                >
                    View / Edit
                </Button>
                <Button
                    disabled={disableAll}
                    variant="plain"
                    size="xs"
                    onClick={onCode}
                    loading={deleteLoading}
                >
                    Code
                </Button>
                <Button
                    disabled={disableAll}
                    className="text-red-600"
                    variant="plain"
                    size="xs"
                    onClick={() => setDeleteModal(true)}
                    loading={deleteLoading}
                >
                    delete
                </Button>
            </div>
            <Button
                disabled={disableAll}
                variant="solid"
                size="xs"
                onClick={() => setModalIsOpen(true)}
                loading={deleteLoading}
            >
                publish
            </Button>
        </div>
    )

    interface PublishInfo {
        color: string
        text: string
    }

    let servicePublishInfo: PublishInfo = {
        color: '',
        text: '',
    }

    if (serviceData.publishRequested === true) {
        servicePublishInfo = {
            color: 'yellow',
            text: 'Is processing for service market',
        }
    } else if (serviceData.published === true) {
        servicePublishInfo = {
            color: '#00ff00',
            text: 'Service successfully published on service market',
        }
    } else if (serviceData.publishRejected === true) {
        servicePublishInfo = {
            color: 'red',
            text: 'Your publish request was rejected',
        }
    }

    const cardHeader = (
        <div className="text-center relative rounded-tl-lg rounded-tr-lg overflow-hidden">
            {disableAll === true && (
                <div
                    className="is-processing"
                    style={{ color: servicePublishInfo?.color }}
                >
                    <p>{servicePublishInfo?.text}</p>
                </div>
            )}
            {
                <div className="flex card-header-svg items-center justify-center rounded-tl-lg rounded-tr-lg overflow-hidden">
                    <ImageWithFallBack
                        src={
                            (serviceImage && serviceImage) ||
                            '/img/others/img-1.jpg'
                        }
                        alt="card header"
                    />
                </div>
            }
        </div>
    )

    async function handlePublishRequest() {
        setRequesting(true)
        const res = (await apiSendServicePublishRequest(serviceId)) as any
        setRequesting(false)
        if (res?.data?.data?.success === false) {
            toast.push(
                <Notification
                    title={'Error while sending publish request'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
        } else {
            setModalIsOpen(false)
            setCodeModal(false)
            refresh()
            toast.push(
                <Notification
                    title={'publish request sent successfully'}
                    type="success"
                />,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <>
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
                        loading={deleteLoading}
                    >
                        Delete
                    </Button>
                    <Button
                        className="px-6"
                        variant="solid"
                        color="green"
                        size="sm"
                        onClick={() => setDeleteModal(false)}
                        loading={deleteLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
            <Dialog
                width={'40%'}
                className={'flex flex-col'}
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(false)}
            >
                <h4 className="mb-8 text-[1.5rem]">Service data</h4>
                <figure className="rounded-xl overflow-hidden w-fit mx-auto mb-8">
                    {cardHeader}
                </figure>
                <div className="w-10/12 mx-auto flex flex-col modal-infos gap-3">
                    <h6>
                        Name: <strong>{name}</strong>
                    </h6>
                    <h6>
                        Description: <strong>{description}</strong>
                    </h6>
                    <h6>
                        Type: <strong>{type}</strong>
                    </h6>

                    <div className="flex w-full my-4 gap-2">
                        <Button
                            disabled={disableAll}
                            variant="solid"
                            color='yellow'
                            size="sm"
                            onClick={() => setCodeModal(true)}
                            className="w-1/2"
                        >
                            See Code
                        </Button>

                        <Button
                            disabled={disableAll}
                            variant="solid"
                            color='green'
                            size="sm"
                            className="w-1/2"
                            onClick={handlePublishRequest}
                            loading={requesting}
                        >
                            {requesting ? 'Sending Request' : 'Send Request'}
                        </Button>
                    </div>

                    <Dialog
                        width={'40%'}
                        className={''}
                        isOpen={codeModal}
                        onClose={() => setCodeModal(false)}
                    >
                        <h5 className="mb-4">Code</h5>
                        <SyntaxHighlighter language="javascript">
                            {serviceData.code}
                        </SyntaxHighlighter>
                    </Dialog>
                </div>
            </Dialog>
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
                    <span className="text-emerald-600 font-semibold">
                        {type}
                    </span>
                    <h4 className="font-bold my-3">{name}</h4>
                    <div className="h-16">{description}</div>
                    {/* <p>Published: {serviceData.published.toString()}</p>
                    <p>Rejected: {serviceData.publishRejected.toString()}</p>
                    <p>Requested: {serviceData.publishRequested.toString()}</p> */}
                </Card>
            </div>
        </>
    )
}

export default ServiceCard
