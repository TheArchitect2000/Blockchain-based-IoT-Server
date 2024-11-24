import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTTComponent: React.FC = () => {
    const [mqttUrl, setMqttUrl] = useState('wss://developer.fidesinnova.io:8083'); // default URL
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

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
            const msg = `${topic}: ${message.toString()}`;
            console.log('Received Message:', msg);
            setMessages((prev) => [...prev, msg]);
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

    useEffect(() => {
        return () => {
            if (client) {
                client.end();
                console.log('MQTT client disconnected');
            }
        };
    }, [client]);

    return (
        <div>
            <input
                type="text"
                value={mqttUrl}
                onChange={(e) => setMqttUrl(e.target.value)}
                placeholder="Enter MQTT URL"
                disabled={isConnecting}
            />
            <button onClick={handleConnect} disabled={isConnecting || !mqttUrl}>
                {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
            <button onClick={handleCancel} disabled={!isConnecting}>
                Cancel
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h3>Messages:</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MQTTComponent;
