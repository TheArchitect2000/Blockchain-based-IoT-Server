import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTComponent: React.FC = () => {
    const [mqttUrl, setMqttUrl] = useState('wss://developer.fidesinnova.io:8083'); // default URL
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = () => {
        setError(null);
        setIsConnecting(true);
        
        const options = {
            connectTimeout: 4000,
            reconnectPeriod: 1000,
            clean: true,
            rejectUnauthorized: false, // For self-signed certificates, if applicable
        };

        const newClient = mqtt.connect(mqttUrl, options);

        newClient.on('connect', () => {
            console.log('Connected to MQTT broker');
            setIsConnecting(false);
            const topic = 'your/topic'; // Replace with your topic
            newClient.subscribe(topic, (err) => {
                if (err) {
                    console.error('Subscribe error: ', err);
                } else {
                    console.log(`Subscribed to topic: ${topic}`);
                }
            });
        });

        newClient.on('error', (err) => {
            console.error('Connection error: ', err);
            setError('Connection error, check URL or broker.');
            setIsConnecting(false);
            newClient.end();
        });

        newClient.on('message', (topic, message) => {
            console.log('Received Message:', topic, message.toString());
        });

        newClient.on('close', () => {
            console.log('Disconnected from MQTT broker');
        });

        setClient(newClient);
    };

    const handleCancel = () => {
        if (client) {
            client.end();
            setClient(null);
            console.log('Connection attempt canceled.');
        }
        setIsConnecting(false);
    };

    return (
        <div>
            <input
                type="text"
                value={mqttUrl}
                onChange={(e) => setMqttUrl(e.target.value)}
                placeholder="Enter MQTT URL"
                disabled={isConnecting}
            />
            <button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
            <button onClick={handleCancel} disabled={!isConnecting}>
                Cancel
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default MQTTComponent;
