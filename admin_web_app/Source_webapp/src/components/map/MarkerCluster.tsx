import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { useMap } from 'react-leaflet'

interface MarkerClusterProps {
    positions: [number, number/* , number */][]
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({ positions }) => {
    const map = useMap()

    useEffect(() => {
        const markers = L.markerClusterGroup()

        positions.forEach(([lat, lng/* , temp */]) => {
            const marker = L.marker([lat, lng])/* .bindTooltip(
                `Temperature: ${temp}°C`,
                {
                    direction: 'top',
                    offset: L.point(0, -10),
                    permanent: false,
                }
            ) */
            markers.addLayer(marker)
        })

        map.addLayer(markers)

        return () => {
            map.removeLayer(markers)
        }
    }, [map, positions])

    return null
}

export default MarkerCluster
