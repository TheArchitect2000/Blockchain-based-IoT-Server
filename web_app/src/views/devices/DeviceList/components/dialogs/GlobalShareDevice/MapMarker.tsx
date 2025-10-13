import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'

interface GlobalMapMarkerProps {
    positions: [number, number]
}

const GlobalMapMarker: React.FC<GlobalMapMarkerProps> = ({ positions }) => {
    const map = useMap()

    useEffect(() => {
        // Use the SVG path data directly
        const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="30" height="62">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>`

        // Create a custom icon using L.divIcon
        const customIcon = L.divIcon({
            className: 'custom-icon',
            html: svgIcon, // Inject the SVG string as HTML
            iconSize: [30, 42], // Size of the icon
            iconAnchor: [15, 42], // Set the anchor point to the bottom center
        })

        const marker = L.marker(positions, {
            icon: customIcon,
        })
        marker.addTo(map)

        return () => {
            map.removeLayer(marker)
        }
    }, [map, positions])

    return null
}

export default GlobalMapMarker
