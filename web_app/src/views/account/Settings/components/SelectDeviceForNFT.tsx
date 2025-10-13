import { DoubleSidedImage, Loading } from '@/components/shared'
import { Avatar, Button, Dialog, Notification, toast } from '@/components/ui'
import { apiGetDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { FiPackage } from 'react-icons/fi'
import { useContractStore } from '@/provider/contract-provider'
import { addTextToImage } from '@/utils/imageUtils'
import { uploadNFTToIPFS } from '@/utils/ipfsUtils'

export default function SelectDeviceForNFT() {
    const [step, setStep] = useState<number>(0)
    const [selectedDevice, setSelectedDevice] = useState<string | null>()
    const [devices, setDevices] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const [isCreatingNFT, setIsCreatingNFT] = useState(false)
    const [processedImagePreview, setProcessedImagePreview] = useState<
        string | null
    >(null)
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const contractStore = useContractStore()
    const { CreateDeviceNFT } = contractStore((state) => state)

    const handleCreateDigitalTwin = async (device: any) => {
        if (!device) return

        try {
            setIsCreatingNFT(true)

            // Step 1: Process the image with device ID
            const processedImage = await addTextToImage(
                device.image || '/img/others/default-device.png',
                atob(device.deviceEncryptedId)
            )

            // Convert File to URL for preview
            const imageUrl = URL.createObjectURL(processedImage)
            setProcessedImagePreview(imageUrl)


            // Step 2: Upload metadata to IPFS
            const ipfsMetadataURL = await uploadNFTToIPFS({
                name: String(atob(device.deviceEncryptedId)),
                image: processedImage,
                attributes: [
                    {
                        trait_type: 'Device ID',
                        value: atob(device.deviceEncryptedId),
                    },
                    {
                        trait_type: 'Device ID Type',
                        value: 'MAC',
                    },
                    {
                        trait_type: 'Device Type',
                        value: device.deviceType,
                    },
                    {
                        trait_type: 'Manufacturer',
                        value: device.manufacturer || 'Unknown',
                    },
                    {
                        trait_type: 'Device Model',
                        value: device.hardwareVersion,
                    },
                ],
            })

            // Step 3: Create NFT with metadata URL
            const result = await CreateDeviceNFT(
                atob(device.deviceEncryptedId),
                'MAC',
                device.deviceType,
                device.manufacturer || 'Unknown',
                device.hardwareVersion,
                ipfsMetadataURL
            )

            if (result.status) {
                toast.push(
                    <Notification type="success">
                        Digital Twin created successfully!
                    </Notification>,
                    { placement: 'top-center' }
                )
                // Reset all states
                setStep(0)
                setSelectedDevice(null)
                setDevices([])
                fetchData() // Refresh the devices list
            } else {
                toast.push(
                    <Notification type="danger">
                        {result.error || 'Failed to create Digital Twin'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    An error occurred while creating Digital Twin
                </Notification>,
                { placement: 'top-center' }
            )
            console.error('Error creating digital twin:', error)
        } finally {
            setIsCreatingNFT(false)
        }
    }

    function getDeviceByEncryptedId(encryptedId: any): any | undefined {
        for (const device of devices) {
            if (device.deviceEncryptedId === encryptedId) {
                return device
            }
        }
        return undefined
    }

    const DeviceItem = ({ device }: { device: any }) => {
        return (
            <div
                onClick={() => {
                    setStep(1)
                    setSelectedDevice(device.deviceEncryptedId)
                }}
                className={`flex flex-col w-fit gap-3 py-4 px-6 border rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedDevice == device.deviceEncryptedId
                        ? '!bg-gray-800'
                        : ''
                } hover:bg-gray-700`}
            >
                <Avatar
                    imgClass="!object-contain p-1"
                    className={`!w-[70px] !h-[70px] overflow-hidden border-2 shadow-lg mx-auto`}
                    style={{
                        borderColor: '#1f2937',
                    }}
                    size={60}
                    shape="circle"
                    src={device.image}
                >
                    {!device.image && (
                        <span className="text-3xl">
                            <FiPackage />
                        </span>
                    )}
                </Avatar>
                <p>
                    Name:{' '}
                    <span className="text-white">{device.deviceName}</span>
                </p>
                <p>
                    Type:{' '}
                    <span className="text-white">{device.deviceType}</span>
                </p>
                <p>
                    Mac: <span className="text-white">{device.mac}</span>
                </p>
                {selectedDevice == device.deviceEncryptedId && (
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            setStep(2)
                        }}
                        size="sm"
                        variant="solid"
                    >
                        Next
                    </Button>
                )}
            </div>
        )
    }

    async function fetchData() {
        try {
            setIsLoading(true)
            const deviceRes = (await apiGetDevices(userId || '')) as any
            console.log('deviceRes.data.data:', deviceRes.data.data)
            setDevices(deviceRes.data.data)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="flex flex-col gap-4 !w-full">
            <h4>Your Physical Devices</h4>
            {step <= 1 && (
                <>
                    <section className="flex flex-wrap justify-start gap-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center min-w-[210px] w-full h-[25dvh]">
                                <Loading loading={true} />
                            </div>
                        ) : (
                            (devices &&
                                devices.length > 0 &&
                                devices.map((device: any) => {
                                    return <DeviceItem device={device} />
                                })) || (
                                <div className="flex flex-col gap-4 items-center justify-center min-w-[210px] w-full h-[25dvh]">
                                    <DoubleSidedImage
                                        className="w-full max-w-[150px]"
                                        src="/img/others/img-2.png"
                                        darkModeSrc="/img/others/img-2-dark.png"
                                        alt="No product found!"
                                    />
                                    <h5>No devices were found.</h5>
                                </div>
                            )
                        )}
                    </section>
                </>
            )}

            {step == 2 && (
                <>
                    <section className="flex flex-col w-fit gap-3 py-4 px-6 border rounded-lg bg-gray-800">
                        {/* {processedImagePreview && (
                            <div className="mb-4">
                                <h6 className="mb-2">
                                    Processed Device Image:
                                </h6>
                                <img
                                    src={processedImagePreview}
                                    alt="Processed Device"
                                    className="max-w-[200px] rounded-lg border-2 border-gray-700"
                                />
                            </div>
                        )} */}
                        <Avatar
                            imgClass="!object-contain p-1"
                            className={`!w-[90px] !h-[90px] overflow-hidden border-2 shadow-lg mx-auto`}
                            style={{
                                borderColor: '#1f2937',
                            }}
                            size={60}
                            shape="circle"
                            src={getDeviceByEncryptedId(selectedDevice).image}
                        >
                            {!getDeviceByEncryptedId(selectedDevice).image && (
                                <span className="text-3xl">
                                    <FiPackage />
                                </span>
                            )}
                        </Avatar>

                        <p>
                            Name:{' '}
                            <span className="text-white">
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .deviceName
                                }
                            </span>
                        </p>
                        <p>
                            Type:{' '}
                            <span className="text-white">
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .deviceType
                                }
                            </span>
                        </p>
                        <p>
                            Mac:{' '}
                            <span className="text-white">
                                {' '}
                                {getDeviceByEncryptedId(selectedDevice).mac}
                            </span>
                        </p>
                        <p>
                            Encrypted Id:{' '}
                            <span className="text-white">
                                {' '}
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .deviceEncryptedId
                                }
                            </span>
                        </p>
                        <p>
                            Software Version:{' '}
                            <span className="text-white">
                                {' '}
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .firmwareVersion
                                }
                            </span>
                        </p>
                        <p>
                            Device Model:{' '}
                            <span className="text-white">
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .hardwareVersion
                                }
                            </span>
                        </p>
                        <Button
                            size="sm"
                            variant="solid"
                            className="mt-4"
                            loading={isCreatingNFT}
                            onClick={() => {
                                if (!selectedDevice) return
                                const device =
                                    getDeviceByEncryptedId(selectedDevice)
                                handleCreateDigitalTwin(device)
                            }}
                        >
                            Create Digital Twin
                        </Button>
                    </section>
                </>
            )}
        </div>
    )
}
