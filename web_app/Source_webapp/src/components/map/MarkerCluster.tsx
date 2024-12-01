import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'
import { DeviceData } from '@/utils/hooks/useGetDevices'

interface MarkerClusterProps {
    data: Record<string, any>
    devices: Array<DeviceData>
}

const MarkerCluster: React.FC<MarkerClusterProps> = ({ data, devices }) => {
    const map = useMap()

    useEffect(() => {
        const markers = devices.map((item) => {
            let liveData: any = {}
            let temp, humid, received

            if (data[String(item?.deviceEncryptedId)]) {
                liveData = data[String(item?.deviceEncryptedId)]
                temp = liveData.data?.Temperature
                humid = liveData.data?.Humidity
                received = liveData.received
            }

            const tooltipContent =
                temp !== undefined || humid !== undefined
                    ? `
                        ${
                            temp !== undefined
                                ? `Temperature: ${temp}°C<br>`
                                : ''
                        }
                        ${humid !== undefined ? `Humidity: ${humid}%` : ''}
                    `.trim()
                    : null

            const svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="#00ad00" viewBox="0 0 24 24" width="30" height="62">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>`

            const customIcon = L.divIcon({
                className: `custom-icon`,
                html: svgIcon,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
            })

            const marker = L.marker(
                [item.location.coordinates[0], item.location.coordinates[1]],
                {
                    icon: customIcon,
                }
            )

            if (tooltipContent) {
                marker.bindTooltip(tooltipContent, {
                    direction: 'top',
                    offset: L.point(0, -10),
                    permanent: true,
                    className: 'custom-tooltip',
                })
            }

            marker.addTo(map)
            return marker
        })

        return () => {
            markers.forEach((marker) => map.removeLayer(marker))
        }
    }, [map, data, devices])

    return null
}

export default MarkerCluster
