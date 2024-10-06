import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt'

const MQTTComponent: React.FC = () => {
    useEffect(() => {
        const mqttUrl = 'wss://developer.fidesinnova.io:8083' // Change to your broker URL
        const options = {
            connectTimeout: 4000,
            reconnectPeriod: 1000,
            clean: true,
            rejectUnauthorized: false, // For self-signed certificates, if applicable
        }

        // Create a client instance
        const client = mqtt.connect(mqttUrl, options)

        client.on('connect', () => {
            console.log('Connected to MQTT broker')

            // Subscribe to a topic
            const topic = 'your/topic' // Replace with the topic you want to subscribe to
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error('Subscribe error: ', err)
                } else {
                    console.log(`Subscribed to topic: ${topic}`)
                }
            })
        })

        client.on('error', (err) => {
            console.error('Connection error: ', err)
            client.end()
        })

        client.on('message', (topic, message) => {
            console.log('Received Message:', topic, message.toString())
        })

        // Optional: handle disconnection
        client.on('close', () => {
            console.log('Disconnected from MQTT broker')
        })
    }, [])

    return <div></div>
}

export default MQTTComponent
