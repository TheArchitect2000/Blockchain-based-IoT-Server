import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerCluster from './MarkerCluster' // Adjust the import as needed
import { Card } from '../ui'
import MapBoundsControl from './MapBounds'

interface MapComponentProps {
    positions: [number, number /* , number */][]
}

const MapComponent: React.FC<MapComponentProps> = ({ positions }) => {
    return (
        <Card className="p-4">
            <MapContainer
                center={[51.505, -0.09]}
                zoom={3}
                minZoom={3} // Set minimum zoom level
                maxZoom={18} // Optional: set maximum zoom level
                style={{ height: '75vh', width: '100%' }}
                
                maxBounds={[
                    [-90, -180],
                    [90, 180],
                ]} // Restrict the map's panning
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerCluster positions={positions} />
            </MapContainer>
        </Card>
    )
}

export default MapComponent
