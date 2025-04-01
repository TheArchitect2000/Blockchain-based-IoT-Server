import { useEffect, useState } from 'react'
//import { useMQTT } from 'mqtt-vue-hook'
//import mqtt from 'mqtt'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { Avatar, Card } from '@/components/ui'
import { FiPackage } from 'react-icons/fi'
import { useMQTT } from '@/components/ui/MqttComp'

const DeviceField = ({ title, value }: { title: string; value: any }) => {
    return (
        <div className={`flex flex-col justify-center `}>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {value}
            </p>
        </div>
    )
}

function DeviceSpecifics({
    data,
    status,
}: {
    data: DeviceData
    status: JSX.Element | null
}) {
    return (
        <Card
            className="h-full"
            bodyClass="flex flex-col p-6 gap-[24px] h-full justify-between"
        >
            <h2>Device Details</h2>

            <div className="w-full h-full grid grid-cols-2 gap-y-7 gap-x-4">
                <Avatar
                    imgClass="!object-contain p-1"
                    className="!w-[90px] !h-[90px] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg"
                    size={90}
                    shape="circle"
                    src={data.image}
                >
                    {!data.image && (
                        <span className="text-3xl">
                            <FiPackage />
                        </span>
                    )}
                </Avatar>

                <DeviceField title="Device Status" value={status} />
                <DeviceField title="Device Name" value={data.deviceName} />
                <DeviceField title="Device Type" value={data.deviceType} />
                <DeviceField title="Mac Address" value={data.mac} />
                <DeviceField
                    title="Device Encrypted Id"
                    value={data.deviceEncryptedId}
                />

                <DeviceField
                    title="Device Model"
                    value={data.hardwareVersion}
                />
                <DeviceField
                    title="Software Version"
                    value={data.firmwareVersion}
                />
            </div>
        </Card>
    )
}

export default DeviceSpecifics
