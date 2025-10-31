import { Loading } from '@/components/shared'
import mqtt, { MqttClient } from 'mqtt'
import { useState } from 'react'
import { HiCheckCircle, HiQuestionMarkCircle, HiXCircle } from 'react-icons/hi'

const clients: Record<string, MqttClient> = {}

function convertToWebSocketUrl(url: string): string {
    const parsedUrl = new URL(url)
    const host = parsedUrl.host
    const port = import.meta.env.VITE_MQTT_WEBSOCKET_PORT || '8081' // Default WebSocket port
    return `wss://${host}:${port}`
}

export const useMQTT = () => {
    let messageHandlers: Record<
        string,
        Record<string, ((message: string) => void)[]>
    > = {}
    const [status, setStatus] = useState<JSX.Element | null>(null)

    const statusIcon = {
        error: <HiQuestionMarkCircle className="text-[1.2rem]" />,
        connecting: <Loading size={20} loading={true} />,
        connected: <HiCheckCircle className="text-[1.2rem] text-[#00ff00]" />,
        subscribed: <HiCheckCircle className="text-[1.2rem]" />,
        disconnected: <HiXCircle className="text-[1.2rem]" />,
    }

    const getOrCreateClient = (
        mqttUrl = convertToWebSocketUrl(import.meta.env.VITE_URL),
        autoReconnect: boolean = true
    ): MqttClient => {
        if (!clients[mqttUrl]) {
            const options = {
                connectTimeout: 4000,
                reconnectPeriod: 1000,
                clean: true,
                reconnect: autoReconnect,
            }

            const client = mqtt.connect(mqttUrl, options)
            clients[mqttUrl] = client

            client.on('connect', () => {
                updateStatus(mqttUrl, 'connected')
            })

            client.on('message', (topic, payload) => {
                let message = payload.toString()

                try {
                    message = JSON.parse(message)
                    if (messageHandlers[mqttUrl]?.[topic]) {
                        messageHandlers[mqttUrl][topic].forEach((handler) =>
                            handler(message)
                        )
                    }
                } catch (error) {
                    console.error(`Received payload is not JSON parsable`)
                }
            })

            client.on('error', (err) => {
                console.error(`Connection error (${mqttUrl}):`, err)
                updateStatus(mqttUrl, 'error')
                client.end()
                delete clients[mqttUrl]
            })

            client.on('close', () => {
                updateStatus(mqttUrl, 'disconnected')
                delete clients[mqttUrl]
            })

            updateStatus(mqttUrl, 'connecting')
        } else {
            updateStatus(mqttUrl, 'connecting') // connected  ( connecting is for user knowledge)
        }

        return clients[mqttUrl]
    }

    const updateStatus = (mqttUrl: string, status: string) => {
        setStatus(
            <p className="flex gap-2 items-center text-[1.05rem]">
                {status} {statusIcon[status]}
            </p>
        )
    }

    const subscribe = (
        mqttUrl = convertToWebSocketUrl(import.meta.env.VITE_URL),
        topic: string,
        onMessage: (message: string) => void,
        autoSubscribe: boolean = true
    ) => {
        const client = getOrCreateClient(mqttUrl)

        if (!messageHandlers[mqttUrl]) {
            messageHandlers[mqttUrl] = {}
        }

        if (!messageHandlers[mqttUrl][topic]) {
            messageHandlers[mqttUrl][topic] = []

            if (autoSubscribe) {
                client.subscribe(topic, (err) => {
                    if (err) {
                        console.error(
                            `Subscription error for topic "${topic}" at ${mqttUrl}:`,
                            err
                        )
                        updateStatus(mqttUrl, 'error')
                    } else {
                        updateStatus(mqttUrl, 'connected')
                    }
                })
            }
        }

        messageHandlers[mqttUrl][topic].push(onMessage)

        return () => {
            // Unsubscribe the specific handler
            messageHandlers[mqttUrl][topic] = messageHandlers[mqttUrl][
                topic
            ].filter((handler) => handler !== onMessage)
            if (messageHandlers[mqttUrl][topic].length === 0) {
                // Unsubscribe from the topic if no handlers are left
                client.unsubscribe(topic)
                delete messageHandlers[mqttUrl][topic]
            }

            // Clean up MQTT client if no topics are subscribed for this URL
            if (Object.keys(messageHandlers[mqttUrl]).length === 0) {
                client.end()
                delete clients[mqttUrl]
                delete messageHandlers[mqttUrl]
            }
        }
    }

    return { subscribe, status }
}
