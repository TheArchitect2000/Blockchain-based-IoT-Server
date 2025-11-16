import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { BsCoin } from 'react-icons/bs'
import './style.css'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'
import { Button, Dialog, Dropdown, Notification, toast } from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/views/devices/DeviceList/store'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { ServiceData } from '@/utils/hooks/useGetServices'
import { useNavigate } from 'react-router-dom'

const ServiceCard = ({
    className,
    name,
    installationPrice,
    type,
    description,
    serviceImage,
    serviceData,
    node,
}: {
    serviceImage: string
    node: string
    className: string
    name: string
    installationPrice: number
    type: string
    description: string
    serviceData?: ServiceData
}) => {
    const cardFooter = (
        <section className="flex flex-col w-full gap-3">
            <div className="flex items-center gap-3">
                <BsCoin size="32" />
                <span>
                    <h6 className="text-sm">Installation Price</h6>
                    <span className="text-xs">{installationPrice} FDS</span>
                </span>
            </div>
        </section>
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
                className="flex flex-col w-[300px] h-full hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                header={cardHeader}
                footer={cardFooter}
                footerClass='mt-auto'
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <span className="text-emerald-600 font-semibold">{type}</span>
                <h4 className="font-bold my-3">{name}</h4>
                <p className="mb-2 text-[1rem]">
                    IoT Server:{' '}
                    <strong className="text-white">{node.split('.')[0]}</strong>
                </p>
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
