import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface CirclesLayerProps {
    data: [number, number, number, number][];
    type: 'temperature' | 'humidity';
}

const getColorFromTemperature = (temperature: number) => {
    if (temperature <= 0) return '#0000FF';
    if (temperature <= 15) return '#00FF00';
    if (temperature <= 30) return '#FFFF00';
    return '#FF0000';
}

const getColorFromHumidity = (humidity: number) => {
    if (humidity <= 20) return '#F44336';
    if (humidity <= 40) return '#FF9800';
    if (humidity <= 60) return '#FFC107';
    if (humidity <= 80) return '#FFEB3B';
    return '#00BFFF';
}

const CirclesLayer: React.FC<CirclesLayerProps> = ({ data, type }) => {
    const map = useMap();

    useEffect(() => {
        const getColor = type === 'temperature' ? getColorFromTemperature : getColorFromHumidity;

        const elements = data?.map(([lat, lng, temp, humid]) => {
            const value = type === 'temperature' ? temp : humid
            const text = type === 'temperature' ? `${temp}°C` : `${humid}%`
            const color = getColor(value);
            const circle = L.circle([lat, lng], {
                radius: 100,
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
            });

            const icon = L.divIcon({
                html: `<div style="text-align: center; color: black; font-weight: bold;">${text}</div>`,
                className: '',
            });

            const emptyIcon = L.divIcon({
                html: `<div></div>`,
                className: '',
            });

            const marker = L.marker([lat, lng], { icon: emptyIcon }).bindTooltip(
                `${text}`,
                {
                    direction: 'top',
                    offset: L.point(0, -10),
                    permanent: false,
                }
            );

            circle.addTo(map);
            marker.addTo(map);

            return { circle, marker };
        });

        return () => {
            elements?.forEach(({ circle, marker }) => {
                map.removeLayer(circle);
                map.removeLayer(marker);
            });
        };
    }, [map, data, type]);

    return null;
}

export default CirclesLayer;
