import { DoubleSidedImage, Loading } from '@/components/shared'
import { Avatar, Button, Dialog } from '@/components/ui'
import { apiGetDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { FiPackage } from 'react-icons/fi'

export default function SelectDeviceForNFT() {
    const [step, setStep] = useState<number>(0)
    const [selectedDevice, setSelectedDevice] = useState<string | null>()
    const [devices, setDevices] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)
    const { _id: userId } = useAppSelector((state) => state.auth.user)

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
                            Firmware Version:{' '}
                            <span className="text-white">
                                {' '}
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .firmwareVersion
                                }
                            </span>
                        </p>
                        <p>
                            Hardware Version:{' '}
                            <span className="text-white">
                                {
                                    getDeviceByEncryptedId(selectedDevice)
                                        .hardwareVersion
                                }
                            </span>
                        </p>
                        <Button size="sm" variant="solid" className="mt-4">
                            Create Digital Twin
                        </Button>
                    </section>
                </>
            )}
        </div>
    )
}
