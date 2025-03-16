import { DoubleSidedImage } from '@/components/shared'
import { Avatar, Button, Dialog } from '@/components/ui'
import { apiGetDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { FiPackage } from 'react-icons/fi'

export default function SelectDeviceForNFT() {
    const [step, setStep] = useState<number>(0)
    const [selectedDevice, setSelectedDevice] = useState<string | null>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [devices, setDevices] = useState<any>()
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
                className={`flex flex-col w-fit gap-3 py-4 px-6 border rounded-lg cursor-pointer ${
                    selectedDevice == device.deviceEncryptedId
                        ? '!bg-gray-600'
                        : ''
                } hover:bg-gray-900`}
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
            </div>
        )
    }

    async function fetchData() {
        const deviceRes = (await apiGetDevices(userId || '')) as any
        console.log('deviceRes.data.data:', deviceRes.data.data)
        setDevices(deviceRes.data.data)
    }

    function closeModal() {
        setIsOpen(false)
        setStep(0)
        setSelectedDevice(null)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <Dialog
                contentClassName="flex flex-col gap-4 !w-fit"
                isOpen={isOpen}
                onClose={closeModal}
            >
                {step <= 1 && (
                    <>
                        <h4>Select Device</h4>
                        <section className="flex flex-wrap justify-center gap-6">
                            {(devices &&
                                devices.length > 0 &&
                                devices.map((device: any) => {
                                    return <DeviceItem device={device} />
                                })) || (
                                <div className="flex flex-col gap-4 items-center justify-center min-w-[210px] w-full h-[35dvh]">
                                    <DoubleSidedImage
                                        className="w-full max-w-[120px]"
                                        src="/img/others/img-2.png"
                                        darkModeSrc="/img/others/img-2-dark.png"
                                        alt="No product found!"
                                    />
                                    <h6>No devices were found.</h6>
                                </div>
                            )}
                        </section>
                    </>
                )}
                {selectedDevice && step == 1 && (
                    <Button
                        onClick={() => setStep(2)}
                        size="sm"
                        variant="solid"
                    >
                        Next
                    </Button>
                )}
                {step == 2 && (
                    <>
                        <h4>Digital Twin</h4>
                        <section className="flex flex-col gap-2">
                            <Avatar
                                imgClass="!object-contain p-1"
                                className={`!w-[70px] !h-[70px] overflow-hidden border-2 shadow-lg mx-auto`}
                                style={{
                                    borderColor: '#1f2937',
                                }}
                                size={60}
                                shape="circle"
                                src={
                                    getDeviceByEncryptedId(selectedDevice).image
                                }
                            >
                                {!getDeviceByEncryptedId(selectedDevice)
                                    .image && (
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
            </Dialog>
            <Button
                onClick={() => setIsOpen(true)}
                size="sm"
                variant="solid"
                className="w-fit"
            >
                Your Physical Devices
            </Button>
        </div>
    )
}
