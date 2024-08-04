import React, { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import MarkerCluster from './MarkerCluster'
import { Card } from '../ui'
import CirclesLayer from './CirclesLayer'

interface MapComponentProps {
    positions: [number, number, number, number][]
}

const MapComponent: React.FC<MapComponentProps> = ({ positions }) => {
    const [selectedView, setSelectedView] = useState<
        'markers' | 'temperatures' | 'humidity'
    >('markers')

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
                {/* <label className="mr-4">
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
                </label> */}
            </div>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={3}
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
                    <MarkerCluster positions={positions} />
                ) : selectedView === 'temperatures' ? (
                    <CirclesLayer data={positions} type="temperature" />
                ) : (
                    <CirclesLayer data={positions} type="humidity" />
                )}
            </MapContainer>
        </Card>
    )
}

export default MapComponent
