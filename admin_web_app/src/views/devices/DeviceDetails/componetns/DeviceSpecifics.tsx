import { useEffect, useState } from 'react'
//import { useMQTT } from 'mqtt-vue-hook'
//import mqtt from 'mqtt'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { Card } from '@/components/ui'

const DeviceField = ({
    title,
    value,
}: {
    title: string
    value: string | number
}) => {
    return (
        <div className="flex flex-col justify-end">
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {value}
            </p>
        </div>
    )
}

function DeviceSpecifics({ data }: { data: DeviceData }) {
    return (
        <Card
            className="h-full"
            bodyClass="flex flex-col p-6 gap-[24px] h-full justify-between"
        >
            <h2>Device Details</h2>

            <div className="w-full h-full grid grid-cols-2 gap-y-7 gap-x-4">
                <DeviceField title="Device Name" value={data.deviceName} />
                <DeviceField title="Device Type" value={data.deviceType} />

                <DeviceField title="Mac Address" value={data.mac} />
                <DeviceField
                    title="Device Encrypted Id"
                    value={data.deviceEncryptedId}
                />

                <DeviceField
                    title="Hardware Version"
                    value={data.hardwareVersion}
                />
                <DeviceField
                    title="Firmware Version"
                    value={data.firmwareVersion}
                />
            </div>
        </Card>
    )
}

export default DeviceSpecifics
