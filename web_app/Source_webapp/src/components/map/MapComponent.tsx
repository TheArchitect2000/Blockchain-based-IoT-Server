import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerCluster from './MarkerCluster'
import { Button, Card } from '../ui'
import CirclesLayer from './CirclesLayer'
import { Loading } from '../shared'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { useMQTT } from '../ui/MqttComp'
import LiveAnimation from '../animations/Heart/HeartAnimation'
import './mapStyle.scss'

interface MapComponentProps {
    positions: Array<DeviceData>
    loading: boolean
}

const MapComponent: React.FC<MapComponentProps> = ({ positions, loading }) => {
    const [selectedView, setSelectedView] = useState<
        'markers' | 'temperatures' | 'humidity'
    >('markers')
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [liveDevicesData, setLiveDevicesData] = useState<Record<string, any>>(
        {}
    )
    const { status, subscribe } = useMQTT()

    useEffect(() => {
        const unsubscribeFunctions: (() => void)[] = []

        positions.forEach((item) => {
            if (item?.deviceEncryptedId) {
                let deviceNodeId = ''

                if (item.nodeId == 'developer.fidesinnova.io') {
                    deviceNodeId = `wss://${item.nodeId}:8081`
                } else {
                    deviceNodeId = `wss://panel.${item.nodeId}:8081`
                }

                const unsubscribe = subscribe(
                    deviceNodeId,
                    item?.deviceEncryptedId,
                    (message: any) => {
                        let tempData = message.data
                        delete tempData.HV
                        delete tempData.FV
                        if (tempData.proof) {
                            delete tempData.proof
                        }
                        if (
                            String(message.from) ===
                            String(item.deviceEncryptedId)
                        ) {
                            setLiveDevicesData((prevData) => ({
                                ...prevData,
                                [String(message.from)]: {
                                    received: true,
                                    data: { ...tempData },
                                    date: new Date(),
                                },
                            }))
                            setTimeout(() => {
                                setLiveDevicesData((prevData) => ({
                                    ...prevData,
                                    [String(message.from)]: {
                                        ...prevData[String(message.from)],
                                        received: false,
                                    },
                                }))
                            }, 2000)
                        }
                    },
                    true
                )
                unsubscribeFunctions.push(unsubscribe)
            }
        })

        // Cleanup function to unsubscribe all
        return () => {
            unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
        }
    }, [positions])

    const nodeIds = Array.from(new Set(positions.map((item) => item.nodeId)))

    const handleNodeIdSelect = (nodeId: string) => {
        setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId)
    }

    // Filter positions based on selectedNodeId

    const filteredPositions =
        selectedNodeId !== null
            ? positions.filter((item) => item.nodeId === selectedNodeId)
            : positions.filter((item) => item.nodeId !== "Sample")

    // Custom component to zoom the map to Paris
    const ZoomToParis: React.FC = () => {
        const map = useMap()

        useEffect(() => {
            if (selectedNodeId === 'Sample') {
                map.setView([45.8566, 3], 8) // Coordinates of Paris with a zoom level of 12
            }
        }, [selectedNodeId, map])

        return null
    }

    return (
        <Card className="p-4">
            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        name="view"
                        value="markers"
                        checked={selectedView === 'markers'}
                        onChange={() => setSelectedView('markers')}
                        className="mr-2"
                    />
                    Markers
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        name="view"
                        value="temperatures"
                        checked={selectedView === 'temperatures'}
                        onChange={() => setSelectedView('temperatures')}
                        className="mr-2"
                    />
                    Temperatures
                </label>
                <label>
                    <input
                        type="radio"
                        name="view"
                        value="humidity"
                        checked={selectedView === 'humidity'}
                        onChange={() => setSelectedView('humidity')}
                        className="mr-2"
                    />
                    Humidity
                </label>
            </div>
            <div className="mb-4 gap-4 flex flex-wrap">
                <Button
                    variant={selectedNodeId === null ? 'solid' : 'default'}
                    onClick={() => setSelectedNodeId(null)}
                >
                    All
                </Button>
                {nodeIds.map((nodeId) => (
                    <Button
                        key={nodeId}
                        variant={
                            selectedNodeId === nodeId ? 'solid' : 'default'
                        }
                        onClick={() => handleNodeIdSelect(nodeId)}
                    >
                        {nodeId.split('.')[0]}
                    </Button>
                ))}
            </div>
            {(loading == false && (
                <MapContainer
                    center={[51.505, -0.09]} // Initial center
                    zoom={3} // Initial zoom level
                    minZoom={3}
                    maxZoom={18}
                    className="h-[40vh] xl:h-[75vh]"
                    style={{ width: '100%' }}
                    maxBounds={[
                        [-90, -180],
                        [90, 180],
                    ]}
                >
                    <div className="flex gap-2 live-holder">
                        <p>Live</p> <LiveAnimation className="live-component" />
                    </div>

                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {selectedView === 'markers' ? (
                        <MarkerCluster
                            devices={filteredPositions}
                            data={liveDevicesData}
                        />
                    ) : selectedView === 'temperatures' ? (
                        <CirclesLayer
                            devices={filteredPositions}
                            data={liveDevicesData}
                            type="temperature"
                        />
                    ) : (
                        <CirclesLayer
                            devices={filteredPositions}
                            data={liveDevicesData}
                            type="humidity"
                        />
                    )}
                    <ZoomToParis />
                </MapContainer>
            )) || <Loading loading={true} />}
        </Card>
    )
}

export default MapComponent
