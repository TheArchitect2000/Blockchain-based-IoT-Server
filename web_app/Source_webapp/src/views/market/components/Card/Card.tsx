import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { BsCoin } from 'react-icons/bs'
import './style.css'
import ImageWithFallBack from '@/utils/components/ImageWithFallBack'
import { Button, Dialog, Dropdown, Notification, toast } from '@/components/ui'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { apiGetAllSharedDevices, apiGetDevices } from '@/services/DeviceApi'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import {
    apiGetAllInstalledServices,
    apiGetInstalledServices,
    apiInstallNewService,
} from '@/services/ServiceAPI'
import { ServiceData } from '@/utils/hooks/useGetServices'
import { useNavigate } from 'react-router-dom'
import { SyntaxHighlighter } from '@/components/shared'
import CardBlockly from './blockly'
import { useAppSelector } from '@/store'
import Tabs from '@/components/custom/Tab'

const ServiceCard = ({
    sharedDevices,
    myDevices,
    className,
    serviceData,
}: {
    sharedDevices: Array<DeviceData>
    myDevices: Array<DeviceData>
    className: string
    serviceData?: ServiceData
}) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [deviceModal, setDeviceModal] = useState(false)
    const [installModal, setInstallModal] = useState(false)
    const [installLoading, setInstallLoading] = useState(false)
    const [codeModal, setCodeModal] = useState(false)
    const [blocklyModal, setBlocklyModal] = useState(false)
    const [deviceListIsOpen, setDeviceListIsOpen] = useState<string>('')
    const [selectedDevices, setSelectedDevices] = useState<
        Record<string, string>
    >({})
    const [deviceRefs, setDeviceRefs] = useState<{
        [key: string]: MutableRefObject<any>
    }>({})
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const navigateTo = useNavigate()

    function getSelectedDevicesObjectWithEncryptedId(): Record<string, string> {
        const transformedObject: any = {}
        Object.keys(selectedDevices).forEach((key: string) => {
            const theDevice = getDeviceInfoWithDeviceId(selectedDevices[key])
            transformedObject[key] = theDevice?.deviceEncryptedId
        })

        return transformedObject
    }

    function getSelectedDevicesEncryptedId(): Array<string | undefined> {
        const transformedObject = Object.keys(selectedDevices).map(
            (key: string) =>
                getDeviceInfoWithDeviceId(selectedDevices[key])
                    ?.deviceEncryptedId
        )
        return transformedObject
    }

    function selectedDevicesCount(): number {
        let count = 0
        Object.values(selectedDevices).forEach((value: string) => {
            if (value.length > 0) {
                count++
            }
        })

        return count
    }

    function getDeviceInfoWithDeviceId(deviceId: string): DeviceData | null {
        const allDevices = [...sharedDevices, ...myDevices]
        const selectedDevice = allDevices.filter(
            (device: DeviceData) =>
                String(device._id) === deviceId ||
                device.nodeDeviceId === deviceId
        )
        return selectedDevice.length > 0 ? selectedDevice[0] : null
    }

    function getSelectedDeviceName(deviceName: string) {
        const allDevices = [...sharedDevices, ...myDevices]

        const selectedDevice = allDevices.filter(
            (device: DeviceData) =>
                String(device._id) === selectedDevices[deviceName] ||
                String(device.nodeDeviceId) === selectedDevices[deviceName]
        )
        return selectedDevice.length > 0
            ? selectedDevice[0].deviceName
            : 'Select'
    }

    function getAvailableDevices(type: 'shared' | 'my', nowDevice: string) {
        const selecteId = selectedDevices[nowDevice]
        let deviceList: Array<DeviceData>
        if (type == 'my') {
            deviceList = myDevices
        } else {
            deviceList = sharedDevices
        }

        const filteredDevices = Object.values(selectedDevices).filter(
            (value: string) => value !== selecteId
        )

        filteredDevices.map((value: string) => {
            deviceList = deviceList.filter(
                (device) =>
                    device.nodeDeviceId !== value && device._id !== value
            )
        })

        return deviceList
    }

    function handleDeviceSelect(deviceName: string, deviceId: string) {
        setSelectedDevices({ ...selectedDevices, [deviceName]: deviceId })
    }

    const cardFooter = (
        <section className="flex flex-col w-full gap-3">
            <div className="flex items-center gap-3">
                <BsCoin size="32" />
                <span>
                    <h6 className="text-sm">Installation Price</h6>
                    <span className="text-xs">
                        {serviceData?.installationPrice} FDS
                    </span>
                </span>
            </div>
            <Button
                variant="solid"
                size="sm"
                onClick={() => setModalOpen(true)}
            >
                Install Service
            </Button>
            <div className="flex gap-2 w-full">
                <Button
                    className="w-full"
                    variant="default"
                    size="sm"
                    onClick={() => setCodeModal(true)}
                >
                    View Code
                </Button>
                {serviceData?.blocklyJson && (
                    <Button
                        className="w-full"
                        variant="default"
                        size="sm"
                        onClick={() => setBlocklyModal(true)}
                    >
                        View Blockly
                    </Button>
                )}
            </div>
        </section>
    )

    const cardHeader = (
        <div className="flex card-header-svg items-center justify-center rounded-tl-lg rounded-tr-lg overflow-hidden">
            <ImageWithFallBack
                src={
                    (serviceData?.serviceImage && serviceData?.serviceImage) ||
                    '/img/others/img-1.jpg'
                }
                alt="card header"
            />
        </div>
    )

    useEffect(() => {
        let theObject: { [key: string]: React.RefObject<any> } = {}
        serviceData?.devices.forEach((device: any) => {
            theObject[String(device?.name)] = React.createRef()
        })
        setDeviceRefs(theObject)
    }, [serviceData])

    useEffect(() => {
        if (modalOpen == false) {
            setDeviceModal(false)
            setSelectedDevices({})
        }
    }, [modalOpen])

    async function handleInstallService() {
        try {
            setInstallLoading(true)

            const res = (await apiInstallNewService({
                userId: userId,
                serviceId: serviceData?._id,
                installedServiceName: serviceData?.serviceName,
                installedServiceImage: serviceData?.serviceImage,
                description: serviceData?.description,
                code: serviceData?.code,
                deviceMap: {
                    ...getSelectedDevicesObjectWithEncryptedId(),
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
            setSelectedDevices({})
        } catch (error) {
            console.log('Error while installing service, error: ', error)
        }
    }

    return (
        <div className={`max-w-xs ${className}`}>
            <Dialog
                width={'50%'}
                contentClassName="flex flex-col gap-4"
                isOpen={blocklyModal}
                onClose={() => setBlocklyModal(false)}
            >
                <h5>'{serviceData?.serviceName}' Blockly</h5>
                <CardBlockly
                    xmlText={serviceData?.blocklyJson || ''}
                    devices={serviceData?.devices || ''}
                />
                <div className="flex justify-center gap-4">
                    <Button
                        variant="solid"
                        size="sm"
                        color="red-500"
                        className="w-fit px-8"
                        onClick={() => {
                            setBlocklyModal(false)
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        className="w-fit px-8"
                        onClick={() => {
                            toast.push(
                                <Notification
                                    title={'XML copied successfully'}
                                    type="success"
                                />,
                                {
                                    placement: 'top-center',
                                }
                            )
                            navigator.clipboard.writeText(
                                serviceData?.blocklyJson || ''
                            )
                        }}
                    >
                        Copy XML
                    </Button>
                </div>
            </Dialog>
            <Dialog
                width={'40%'}
                className={''}
                isOpen={codeModal}
                onClose={() => setCodeModal(false)}
            >
                <h5 className="mb-4">'{serviceData?.serviceName}' Code</h5>
                <div className="">
                    <SyntaxHighlighter language="javascript">
                        {serviceData?.code || ''}
                    </SyntaxHighlighter>
                </div>
                <Button
                    variant="solid"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                        toast.push(
                            <Notification
                                title={'Code copied successfully'}
                                type="success"
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                        navigator.clipboard.writeText(serviceData?.code || '')
                    }}
                >
                    Copy
                </Button>
            </Dialog>
            <Dialog isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h3 className="mb-8">Install Service</h3>
                <div className="flex mb-4 items-center justify-center">
                    <ImageWithFallBack
                        className="w-[300px] h-[175px] rounded-xl"
                        src={
                            (serviceData?.serviceImage &&
                                serviceData?.serviceImage) ||
                            '/img/others/img-1.jpg'
                        }
                        alt="card header"
                    />
                </div>
                <section className="flex flex-col gap-2 items-center text-[1rem]">
                    <p>
                        <strong>Name:</strong> {serviceData?.serviceName}
                    </p>
                    <p>
                        <strong>IoT Server:</strong>{' '}
                        {(serviceData?.nodeId || '').split('.')[0]}
                    </p>
                    <p>
                        <strong>Type:</strong> {serviceData?.serviceType}
                    </p>
                    <p>
                        <strong>Description:</strong> {serviceData?.description}
                    </p>
                    <p>
                        <strong>Installation Price:</strong>{' '}
                        {serviceData?.installationPrice} FDS
                    </p>
                    <p>
                        <strong>Execution Price:</strong>{' '}
                        {serviceData?.installationPrice} FDS
                    </p>

                    {serviceData?.devices &&
                        serviceData?.devices.length > 0 &&
                        serviceData?.devices.map(
                            (device: { name: string; type: string }, index) => {
                                return (
                                    <div className="flex items-center gap-2">
                                        <p>
                                            Device {index + 1} (
                                            <strong>
                                                {device?.name?.replace(
                                                    'device_',
                                                    ''
                                                )}
                                            </strong>
                                            ):
                                        </p>
                                        <Button
                                            className="flex items-center !h-8"
                                            size="sm"
                                            onClick={() => {
                                                const ref =
                                                    deviceRefs[
                                                        String(device?.name)
                                                    ]
                                                ref?.current?.children[0]?.click()
                                            }}
                                        >
                                            {getSelectedDeviceName(
                                                device?.name
                                            )}
                                            <Dropdown
                                                ref={
                                                    deviceRefs[
                                                        String(device?.name)
                                                    ]
                                                }
                                                trigger="click"
                                                onSelect={(key) =>
                                                    handleDeviceSelect(
                                                        device.name,
                                                        String(key)
                                                    )
                                                }
                                                onOpen={() =>
                                                    setDeviceListIsOpen(
                                                        String(device?.name)
                                                    )
                                                }
                                                onClose={() =>
                                                    setDeviceListIsOpen('')
                                                }
                                                menuClass="max-h-[250px] overflow-auto"
                                                placement="middle-start-bottom"
                                                activeKey={
                                                    selectedDevices[
                                                        device?.name
                                                    ]
                                                }
                                            >
                                                <Tabs
                                                    tabs={[
                                                        {
                                                            label: 'My Devices',
                                                            content: (
                                                                <>
                                                                    {getAvailableDevices(
                                                                        'my',
                                                                        device?.name
                                                                    ).map(
                                                                        (
                                                                            device,
                                                                            index
                                                                        ) => (
                                                                            <Dropdown.Item
                                                                                eventKey={
                                                                                    device._id
                                                                                }
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    device.deviceName
                                                                                }
                                                                            </Dropdown.Item>
                                                                        )
                                                                    )}
                                                                </>
                                                            ),
                                                        },
                                                        {
                                                            label: 'Global Devices',
                                                            content: (
                                                                <>
                                                                    {getAvailableDevices(
                                                                        'shared',
                                                                        device?.name
                                                                    ).map(
                                                                        (
                                                                            device,
                                                                            index
                                                                        ) => (
                                                                            <Dropdown.Item
                                                                                eventKey={
                                                                                    device.nodeDeviceId
                                                                                }
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    device.deviceName
                                                                                }{' '}
                                                                                {`(IoT Server: ${
                                                                                    device.nodeId.split(
                                                                                        '.'
                                                                                    )[0]
                                                                                })`}
                                                                            </Dropdown.Item>
                                                                        )
                                                                    )}
                                                                </>
                                                            ),
                                                        },
                                                    ]}
                                                />

                                                {/* Unselect Option */}
                                                <Dropdown.Item eventKey="">
                                                    Unselect Device
                                                </Dropdown.Item>
                                            </Dropdown>
                                        </Button>
                                    </div>
                                )
                            }
                        )}

                    <div className="w-full gap-4 mt-2 flex justify-center">
                        {serviceData?.devices.length ==
                            selectedDevicesCount() && (
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
                        {serviceData?.devices.length ==
                            selectedDevicesCount() && (
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
                className="flex flex-col w-[300px] h-full hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                header={cardHeader}
                footer={cardFooter}
                footerClass="mt-auto"
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <span className="text-emerald-600 font-semibold">
                    {serviceData?.serviceType}
                </span>
                <h4 className="font-bold my-3">{serviceData?.serviceName}</h4>
                <p className="mb-2 text-[1rem]">
                    IoT Server:{' '}
                    <strong className="text-white">
                        {(serviceData?.nodeId || '').split('.')[0]}
                    </strong>
                </p>
                <div
                    className="h-16 line-clamp-4"
                    style={{ textOverflow: 'ellipsis' }}
                >
                    {serviceData?.description}
                </div>
            </Card>
        </div>
    )
}

export default ServiceCard
