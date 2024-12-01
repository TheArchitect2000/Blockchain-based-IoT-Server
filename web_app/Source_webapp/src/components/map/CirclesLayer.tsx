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

            if (
                Object.keys(liveData).length > 0 &&
                (type === 'temperature' || type === 'humidity')
            ) {
                const temp = liveData.data.Temperature
                const humid = liveData.data.Humidity
                const value = type === 'temperature' ? temp : humid
                const text = type === 'temperature' ? `${temp}°C` : `${humid}%`
                const color = getColor(value)
                const circle = L.circle(
                    [
                        item.location.coordinates[0],
                        item.location.coordinates[1],
                    ],
                    {
                        radius: 100,
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.5,
                    }
                )

                const icon = L.divIcon({
                    html: `<div style="text-align: center; color: black; font-weight: bold;">${text}</div>`,
                    className: '',
                })

                const emptyIcon = L.divIcon({
                    html: `<div></div>`,
                    className: '',
                })

                const marker = L.marker(
                    [
                        item.location.coordinates[0],
                        item.location.coordinates[1],
                    ],
                    {
                        icon: emptyIcon,
                    }
                ).bindTooltip(`${text}`, {
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
                    if (circle) {
                        map.removeLayer(circle)
                    }
                    if (marker) {
                        map.removeLayer(marker)
                    }
                }
            })
        }
    }, [map, data, type])

    return null
}

export default CirclesLayer
