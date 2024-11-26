import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt'

const MQTTComponent: React.FC = () => {
    const mqttUrl = 'wss://developer.fidesinnova.io:8081' // Static URL
    const [client, setClient] = useState<mqtt.MqttClient | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleConnect = () => {
        setError(null)
        setIsConnecting(true)

        const options = {
            connectTimeout: 4000, // Timeout for the connection
            reconnectPeriod: 1000, // Reconnect interval
            clean: true, // Clean session
            rejectUnauthorized: false,
        }

        const newClient = mqtt.connect(mqttUrl, options)

        newClient.on('connect', () => {
            console.log('Connected to MQTT broker')
            setIsConnecting(false)
        })

        newClient.on('error', (err) => {
            console.error('Connection error: ', err)
            setError('Connection error, check URL or broker.')
            setIsConnecting(false)
            newClient.end()
        })

        newClient.on('close', () => {
            console.log('Disconnected from MQTT broker')
        })

        setClient(newClient)
    }

    const handleCancel = () => {
        if (client) {
            client.end()
            setClient(null)
            console.log('Connection attempt canceled.')
        }
        setIsConnecting(false)
    }

    useEffect(() => {
        return () => {
            if (client) {
                client.end()
                console.log('MQTT client disconnected')
            }
        }
    }, [client])

    return (
        <div>
            <button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
            <button onClick={handleCancel} disabled={!isConnecting}>
                Cancel
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

export default MQTTComponent
