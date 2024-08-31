import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerCluster from './MarkerCluster'
import { Button, Card } from '../ui'
import CirclesLayer from './CirclesLayer'
import { Loading } from '../shared'

interface MapComponentProps {
    positions: [number, number, number, number, string][]
    loading: boolean
}

const MapComponent: React.FC<MapComponentProps> = ({ positions, loading }) => {
    const [selectedView, setSelectedView] = useState<
        'markers' | 'temperatures' | 'humidity'
    >('markers')
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

    const nodeIds = Array.from(new Set(positions.map((pos) => pos[4])))

    const handleNodeIdSelect = (nodeId: string) => {
        setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId)
    }

    // Filter positions based on selectedNodeId
    const filteredPositions =
        selectedNodeId === 'Sample'
            ? positions.filter((pos) => pos[4] === 'Sample')
            : positions.filter((pos) =>
                  selectedNodeId
                      ? pos[4] === selectedNodeId
                      : pos[4] !== 'Sample'
              )

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
                        {nodeId}
                    </Button>
                ))}
            </div>
            {(loading == false && (
                <MapContainer
                    center={[51.505, -0.09]} // Initial center
                    zoom={3} // Initial zoom level
                    minZoom={3}
                    maxZoom={18}
                    style={{ height: '75vh', width: '100%' }}
                    maxBounds={[
                        [-90, -180],
                        [90, 180],
                    ]}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selectedView === 'markers' ? (
                        <MarkerCluster positions={filteredPositions} />
                    ) : selectedView === 'temperatures' ? (
                        <CirclesLayer
                            data={filteredPositions}
                            type="temperature"
                        />
                    ) : (
                        <CirclesLayer
                            data={filteredPositions}
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
