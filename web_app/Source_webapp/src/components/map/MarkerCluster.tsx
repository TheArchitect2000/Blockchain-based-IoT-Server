import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'

interface MarkerClusterProps {
    positions: [number, number, number, number][]
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({ positions }) => {
    const map = useMap()

    useEffect(() => {
        // Create an array to hold the markers
        const markers = positions.map(([lat, lng, temp, humidity]) => {
            const marker = L.marker([lat, lng])/* .bindTooltip(
                `Temperature: ${temp}°C | Humidity: ${humidity}%`,
                {
                    direction: 'top',
                    offset: L.point(0, -10),
                    permanent: false,
                }
            ) */
            marker.addTo(map)
            return marker
        })

        // Clean up markers on component unmount
        return () => {
            markers.forEach(marker => map.removeLayer(marker))
        }
    }, [map, positions])

    return null
}

export default MarkerCluster
