import { useState, useMemo } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker,
} from 'react-simple-maps'
import { THEME_ENUM } from '@/constants/theme.constant'
import WorldMap from '@/assets/maps/world-countries-sans-antarctica.json'
import shadeColor from '@/utils/shadeColor'
import { useAppSelector } from '@/store'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { theme } from 'twin.macro'
import type { Dispatch, SetStateAction } from 'react'
import SvgLocation from './SvgLocation'
import { useGetSharedDevices } from '@/utils/hooks/useGetDevices'

type MapDataProp = {
    name: string
    value?: string | number
    color?: string
}[]

type RegionMapProps = {
    data: MapDataProp
    mapSource?: string | Record<string, unknown> | string[]
    valueSuffix?: string
    valuePrefix?: string
}

type MapProps = Omit<RegionMapProps, 'valueSuffix' | 'valuePrefix'> & {
    prefix?: string
    suffix?: string
}

type MapChartProps = MapProps & {
    setTooltipContent: Dispatch<SetStateAction<string>>
}

const twColor: Record<string, string> = theme`colors`
const geoUrl = WorldMap
const hoverPercentage = -10
const { MODE_DARK } = THEME_ENUM

const getHighlightedRegion = (
    name: string | undefined,
    data: MapDataProp,
    defaultMapColor: string
) => {
    const region = data.find((elm) => elm.name === name)
    return region ? region.color : defaultMapColor
}

const getRegionHoverColor = (
    name: string | undefined,
    data: MapDataProp,
    defaultMapColor = ''
) => {
    const region = data.find((elm) => elm.name === name)
    const color = region ? region.color : defaultMapColor
    return shadeColor(color || '', hoverPercentage)
}

const getRegionValue = (
    name: string | undefined,
    data: MapDataProp,
    suffix = '',
    prefix = ''
) => {
    const region = data.find((elm) => elm.name === name)
    return region ? `${region.name} - ${prefix}${region.value}${suffix}` : ''
}

const MapChart = ({
    setTooltipContent,
    data,
    mapSource,
    suffix,
    prefix,
}: MapChartProps) => {
    const mode = useAppSelector((state) => state.theme.mode)
    const [position, setPosition] = useState({ coordinates: [20, 0], zoom: 0.4 })

    const handleZoomIn = () => {
        setPosition((pos) => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 4) }))
    }

    const handleZoomOut = () => {
        console.log(Math.max(position.zoom / 1.5, 0.1))

        setPosition((pos) => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 0.4) }))
    }

    const handleMoveEnd = (position: {
        coordinates: [number, number]
        zoom: number
    }) => {
        setPosition(position)
    }

    const { devices } = useGetSharedDevices()

    const devicesData = devices?.data.data

    const defaultColor =
        mode === MODE_DARK ? twColor.gray['500'] : twColor.gray['100']
    const strokeColor =
        mode === MODE_DARK ? twColor.gray['600'] : twColor.gray['300']

    const geographies = useMemo(() => {
        return (
            <Geographies geography={mapSource}>
                {({ geographies }) =>
                    geographies.map((geo) => {
                        const geoName = geo.properties.name

                        const fill = getHighlightedRegion(
                            geoName,
                            data,
                            defaultColor
                        )
                        const hoverFill = getRegionHoverColor(
                            geoName,
                            data,
                            defaultColor
                        )
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                strokeWidth={2}
                                fill={fill}
                                stroke={strokeColor}
                                style={{
                                    hover: { fill: hoverFill, outline: 'none' },
                                }}
                                onMouseEnter={() => {
                                    setTooltipContent(
                                        getRegionValue(
                                            geoName,
                                            data,
                                            suffix,
                                            prefix
                                        )
                                    )
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent('')
                                }}
                            />
                        )
                    })
                }
            </Geographies>
        )
    }, [
        mapSource,
        data,
        defaultColor,
        strokeColor,
        suffix,
        prefix,
        setTooltipContent,
    ])

    return (
        <>
            <ComposableMap
                style={{ transform: 'translateY(20px)' }}
                data-tip=""
                height={380}
                projectionConfig={{ scale: 345 }}
            >
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates as [number, number]}
                    onMoveEnd={handleMoveEnd}
                    minZoom={0.4}
                >
                    {geographies}
                    {devicesData?.map((item: any, index) => {
                        if (item.location.coordinates) {
                            return (
                                <Marker
                                    onMouseEnter={() =>
                                        console.log(item.deviceName)
                                    }
                                    key={index}
                                    coordinates={[
                                        item.location.coordinates[1] - 1.5,
                                        item.location.coordinates[0] + 2,
                                    ]}
                                >
                                    <SvgLocation />
                                </Marker>
                            )
                        }
                    })}
                </ZoomableGroup>
            </ComposableMap>
            <div className="absolute">
                <button onClick={handleZoomIn} aria-label="Zoom in">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                <button onClick={handleZoomOut} aria-label="Zoom out">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
            <div className="h-8" />
        </>
    )
}

const Map = (props: MapProps) => {
    const [content, setContent] = useState('')
    return (
        <>
            <MapChart {...props} setTooltipContent={setContent} />
            <ReactTooltip>{content}</ReactTooltip>
        </>
    )
}

const RegionMap = (props: RegionMapProps) => {
    const { data = [], mapSource = geoUrl, valueSuffix, valuePrefix } = props

    return (
        <Map
            data={data}
            mapSource={mapSource}
            prefix={valuePrefix}
            suffix={valueSuffix}
        />
    )
}

export default RegionMap
