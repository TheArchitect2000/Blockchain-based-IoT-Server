
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
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {value}
            </p>
        </div>
    )
}

function DeviceSpecifics({ data }: { data: DeviceData }) {
    const connectUrl = `mqtts://${import.meta.env.VITE_HOST_NAME}:8883`
    //const mqttHook = useMQTT()
    let topic = data.deviceEncryptedId
    const [client, setClient] = useState<any>(null)
    const [connectStatus, setConnectStatus] = useState('')

    const mqttConnect = (host: string, mqttOption: any) => {
        setConnectStatus('Connecting')
        //setClient(mqtt.connect(host, mqttOption))
    }

    /* mqttConnect(connectUrl, {
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
    }) */

    useEffect(() => {
        if (client) {
            console.log(client)
            client.on('connect', () => {
                setConnectStatus('Connected')
            })
            client.on('error', (err: any) => {
                console.error('Connection error: ', err)
                client.end()
            })
            client.on('reconnect', () => {
                setConnectStatus('Reconnecting')
            })
            client.on('message', (topic: any, message: any) => {
                const payload = { topic, message: message.toString() }
                //setPayload(payload)
            })
        }
    }, [client])

    useEffect(() => {
        /* async function connect() {
            mqttHook.connect(connectUrl, {
                clean: true,
                connectTimeout: 4000,
                reconnectPeriod: 1000,
                clientId: `mqtt_client_${Math.random()
                    .toString(16)
                    .substring(2, 10)}`,
                protocolId: 'MQIsdp',
                protocolVersion: 3,
            })

            mqttHook.registerEvent(
                'on-connect', // mqtt status: on-connect, on-reconnect, on-disconnect, on-connect-fail
                (topic: string, message: string) => {
                    console.log('mqtt connected')
                },
                'string_key'
            )
        } */

        //connect()

        /* const client = mqtt.connect(connectUrl.toString(), {
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
            protocolId: 'MQIsdp',
            protocolVersion: 3,
        })

        client.on('connect', () => {
            client.subscribe(topic, (err) => {
                if (!err) {
                    console.log('Connected To :', topic)
                } else {
                    console.log('Error While Connecting To :', topic)
                }
            })
        }) */
    }, [])

    return (
        <Card className="p-6 h-full">
            <h2 className="mb-4">Device Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8">
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
