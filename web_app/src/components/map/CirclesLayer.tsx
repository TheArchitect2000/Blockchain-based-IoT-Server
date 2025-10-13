import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { DeviceData } from '@/utils/hooks/useGetDevices'

interface CirclesLayerProps {
    data: Record<string, any>
    devices: Array<DeviceData>
    type: 'temperature' | 'humidity'
}

const getColorFromTemperature = (temperature: number) => {
    if (temperature <= 0) return '#0000FF'
    if (temperature <= 15) return '#00FF00'
    if (temperature <= 30) return '#FFFF00'
    return '#FF0000'
}

const getColorFromHumidity = (humidity: number) => {
    if (humidity <= 20) return '#F44336'
    if (humidity <= 40) return '#FF9800'
    if (humidity <= 60) return '#FFC107'
    if (humidity <= 80) return '#FFEB3B'
    return '#00BFFF'
}

const isValidCoordinate = (coord: any[]): boolean =>
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === 'number' &&
    typeof coord[1] === 'number' &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1])

const CirclesLayer: React.FC<CirclesLayerProps> = ({ devices, data, type }) => {
    const map = useMap()

    useEffect(() => {
        const getColor =
            type === 'temperature'
                ? getColorFromTemperature
                : getColorFromHumidity

        const elements = devices?.map((item) => {
            let liveData: any = {}
            if (data[String(item?.deviceEncryptedId)]) {
                liveData = data[String(item?.deviceEncryptedId)]
            }

            const coords = item.location?.coordinates
            if (Object.keys(liveData).length > 0 && isValidCoordinate(coords)) {
                const temp = liveData.data.Temperature
                const humid = liveData.data.Humidity
                const value = type === 'temperature' ? temp : humid
                const text = type === 'temperature' ? `${temp}°C` : `${humid}%`
                const color = getColor(value)

                const latlng = [coords[0], coords[1]] as [number, number]

                const circle = L.circle(latlng, {
                    radius: 100,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                })

                const marker = L.marker(latlng, {
                    icon: L.divIcon({ html: `<div></div>`, className: '' }),
                }).bindTooltip(`${text}`, {
                    direction: 'top',
                    offset: L.point(0, -10),
                    permanent: false,
                })

                circle.addTo(map)
                marker.addTo(map)

                return { circle, marker }
            } else {
                return null
            }
        })

        return () => {
            elements?.forEach((data) => {
                if (data !== null) {
                    const { circle, marker } = data
                    circle && map.removeLayer(circle)
                    marker && map.removeLayer(marker)
                }
            })
        }
    }, [map, data, type])

    return null
}

export default CirclesLayer
