import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { BsCoin } from 'react-icons/bs'
import './style.css'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'
import { Button, Dialog, Dropdown, Notification, toast } from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { apiGetAllSharedDevices, apiGetDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/views/devices/DeviceList/store'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import {
    apiGetAllInstalledServices,
    apiGetInstalledServices,
    apiInstallNewService,
} from '@/services/ServiceAPI'
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
    const [modalOpen, setModalOpen] = useState(false)
    const [deviceModal, setDeviceModal] = useState(false)
    const [installModal, setInstallModal] = useState(false)
    const [installLoading, setInstallLoading] = useState(false)
    const [deviceOwner, setDeviceOwner] = useState('')
    const [selectedDevice, setSelectedDevice] = useState({
        name: '',
        mac: '',
        encryptedId: '',
    })
    const devicesRef = useRef<any>()
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const [myDevices, setMyDevices] = useState<DeviceData[]>([])
    const [sharedDevices, setSharedDevices] = useState<DeviceData[]>([])
    const navigateTo = useNavigate()

    useEffect(() => {
        async function getDevices() {
            const res = (await apiGetDevices(userId || '')) as any
            setMyDevices(res?.data.data!)
            const sharedRes = (await apiGetAllSharedDevices()) as any
            setSharedDevices(sharedRes?.data.data!)
        }
        getDevices()
    }, [])

    const cardFooter = (
        <section className="flex flex-col w-full gap-3">
            <div className="flex items-center gap-3">
                <BsCoin size="32" />
                <span>
                    <h6 className="text-sm">Installation Price</h6>
                    <span className="text-xs">${installationPrice}</span>
                </span>
            </div>
            <Button
                variant="solid"
                size="sm"
                onClick={() => setModalOpen(true)}
            >
                Install Service
            </Button>
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

    function handleDeviceOwnerSelect(name: any) {
        setDeviceOwner(name)
    }

    function DeviceItem({ data }: { data: DeviceData }) {
        return (
            <div
                onClick={() => {
                    setSelectedDevice({
                        name: data.deviceName,
                        mac: data.mac,
                        encryptedId: data.deviceEncryptedId,
                    })
                    setDeviceModal(false)
                }}
                className="w-full text-center cursor-pointer py-1 hover:bg-[#374151] rounded-lg"
            >
                <p>
                    {data.deviceName} ( {data.mac} )
                </p>
            </div>
        )
    }

    useEffect(() => {
        if (modalOpen == false) {
            setDeviceModal(false)
            setDeviceOwner('')
            setSelectedDevice({
                name: '',
                mac: '',
                encryptedId: '',
            })
        }
    }, [modalOpen])

    async function handleInstallService() {
        try {
            setInstallLoading(true)
            let isInstalled: boolean = false
            const allRes = (await apiGetAllInstalledServices(
                userId?.toString() || ''
            )) as any

            allRes?.data?.data.map((service: any, index: number) => {
                if (
                    service.serviceId == serviceData?._id &&
                    service.insertedBy.toString() == userId?.toString() &&
                    service.deviceMap?.MULTI_SENSOR_1.toString() ==
                        selectedDevice?.encryptedId.toString()
                ) {
                    isInstalled = true
                }
            })

            if (isInstalled == (true as any)) {
                setDeviceModal(false)
                setModalOpen(false)
                setInstallModal(false)
                setDeviceOwner('')
                setSelectedDevice({
                    name: '',
                    mac: '',
                    encryptedId: '',
                })
                return toast.push(
                    <Notification
                        title="This service is already installed for this device."
                        type="danger"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }

            const res = (await apiInstallNewService({
                userId: userId,
                serviceId: serviceData?._id,
                installedServiceName: serviceData?.serviceName,
                installedServiceImage: serviceData?.serviceImage,
                description: serviceData?.description,
                code: serviceData?.code,
                deviceMap: {
                    MULTI_SENSOR_1: selectedDevice?.encryptedId || '',
                },
            })) as any

            setInstallLoading(false)

            if (res?.data.success) {
                navigateTo('/installed')
                toast.push(
                    <Notification
                        title="Service installed successfully"
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            } else {
                toast.push(
                    <Notification
                        title="There was an error while installing service"
                        type="success"
                    />,
                    {
                        placement: 'top-center',
                    }
                )
            }
            setDeviceModal(false)
            setModalOpen(false)
            setInstallModal(false)
            setDeviceOwner('')
            setSelectedDevice({
                name: '',
                mac: '',
                encryptedId: '',
            })
        } catch (error) {
            console.log('Error while installing service, error: ', error)
        }
    }

    return (
        <div className={`max-w-xs ${className}`}>
            <Dialog isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h3 className="mb-8">Install Service</h3>
                <div className="flex mb-4 items-center justify-center">
                    <ImageWithFallBack
                        className="w-[300px] h-[175px] rounded-xl"
                        src={
                            (serviceImage && serviceImage) ||
                            '/img/others/img-1.jpg'
                        }
                        alt="card header"
                    />
                </div>
                <section className="flex flex-col gap-2 items-center text-[1rem]">
                    <p>
                        <strong>Name:</strong> {name}
                    </p>
                    <p>
                        <strong>Node:</strong> {node}
                    </p>
                    <p>
                        <strong>Type:</strong> {type}
                    </p>
                    <p>
                        <strong>Description:</strong> {description}
                    </p>
                    <p>
                        <strong>Installation Price:</strong> {installationPrice}{' '}
                        FDS
                    </p>
                    <p>
                        <strong>Execution Price:</strong> {installationPrice}{' '}
                        FDS
                    </p>
                    <p>
                        <strong>-------------------------------------</strong>
                    </p>
                    <p className="flex items-center">
                        <strong>Devices: </strong>&nbsp;&nbsp;
                        {deviceOwner}
                        &nbsp;&nbsp;
                        <Button
                            className="flex items-center justify-center"
                            variant="solid"
                            size="xs"
                            onClick={() => {
                                devicesRef?.current?.children[0]?.click()
                            }}
                        >
                            <Dropdown
                                trigger="click"
                                onSelect={handleDeviceOwnerSelect}
                                placement="middle-start-top"
                                activeKey={deviceOwner}
                                ref={devicesRef}
                            >
                                <Dropdown.Item eventKey="My Devices">
                                    My Devices
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="Shared Devices">
                                    Shared Devices
                                </Dropdown.Item>
                            </Dropdown>
                        </Button>
                    </p>
                    <p className="flex items-center">
                        <strong>Device: </strong>&nbsp;&nbsp;
                        {selectedDevice.name &&
                            `${selectedDevice.name} ( ${selectedDevice.mac} )`}
                        {!selectedDevice.name && (
                            <Button
                                className="flex items-center justify-center"
                                variant="solid"
                                size="xs"
                                onClick={() => setDeviceModal(true)}
                            >
                                Select
                            </Button>
                        )}
                        <Dialog
                            isOpen={deviceModal}
                            onClose={() => setDeviceModal(false)}
                        >
                            <h3 className="mb-8">{deviceOwner}</h3>
                            {deviceOwner === 'My Devices' &&
                                myDevices.length > 0 &&
                                myDevices.map((item, index) => (
                                    <DeviceItem data={item} key={index} />
                                ))}
                            {deviceOwner === 'My Devices' &&
                                myDevices.length == 0 && (
                                    <h5 className="text-center">
                                        You don't have any devices
                                    </h5>
                                )}
                            {deviceOwner === 'Shared Devices' &&
                                sharedDevices.length > 0 &&
                                sharedDevices.map((item, index) => (
                                    <DeviceItem data={item} key={index} />
                                ))}
                            {deviceOwner === 'Shared Devices' &&
                                sharedDevices.length == 0 && (
                                    <h5 className="text-center">
                                        No shared devices found !
                                    </h5>
                                )}
                        </Dialog>
                    </p>
                    <p>
                        <strong>-------------------------------------</strong>
                    </p>
                    <div className="w-full gap-4 mt-2 flex justify-center">
                        {selectedDevice.name && (
                            <Button
                                className=""
                                variant="solid"
                                color="green"
                                size="sm"
                                onClick={() => setInstallModal(true)}
                            >
                                Install Service
                            </Button>
                        )}
                        <Dialog
                            isOpen={installModal}
                            onClose={() => setInstallModal(false)}
                            contentClassName="w-1/3 h-1/3"
                            closable={false}
                        >
                            <h3 className="mb-8">Install Confirm</h3>
                            <h4 className="mb-6 text-center">
                                Are you sure about installing this service?
                            </h4>
                            <div className="flex justify-center w-2/5 justify-between mx-auto">
                                <Button
                                    className="px-6"
                                    variant="solid"
                                    color="green"
                                    size="sm"
                                    loading={installLoading}
                                    onClick={handleInstallService}
                                >
                                    Yes
                                </Button>
                                <Button
                                    className="px-6"
                                    variant="solid"
                                    color="red"
                                    size="sm"
                                    onClick={() => setInstallModal(false)}
                                >
                                    No
                                </Button>
                            </div>
                        </Dialog>
                        {selectedDevice.name && (
                            <Button
                                className=""
                                variant="solid"
                                color="yellow"
                                size="sm"
                                onClick={() => setDeviceModal(true)}
                            >
                                Change Device
                            </Button>
                        )}
                    </div>
                </section>
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
                <p className="mb-2 text-[1rem]">
                    Node: <strong className="text-white">{node}</strong>
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
