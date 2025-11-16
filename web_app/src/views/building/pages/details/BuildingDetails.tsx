import { Loading } from '@/components/shared'
import { apiGetBuildingByBuildId } from '@/services/UserApi'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import utils from '../../scripts/utils'
import { apiGetDevices, apiGetSharedWithMeDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import { useMQTT } from '@/components/ui/MqttComp'
import './style.scss'

export default function BuildingDetails() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [buildData, setBuildData] = useState<any>({})
    const [devicesData, setDevicesData] = useState<Array<DeviceData>>([])
    const [devicePayloads, setDevicePayloads] = useState<Record<string, any>>(
        {}
    ) // Store payloads by device id
    const navigateTo = useNavigate()
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { subscribe } = useMQTT()
    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const timersRef = useRef<Record<string, NodeJS.Timeout>>({})

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const buildingRes = (await apiGetBuildingByBuildId(
                    id || ''
                )) as any
                const localDevicesRes =
                    (await apiGetSharedWithMeDevices()) as any
                const deviceRes = (await apiGetDevices(userId || '')) as any
                const deviceResData = [
                    ...deviceRes.data.data,
                    ...localDevicesRes.data.data,
                ] as Array<DeviceData>
                const buildingResData = buildingRes.data.data
                setLoading(false)
                if (buildingResData) {
                    const updatedDetails = Object.fromEntries(
                        Object.entries(buildingResData.details).map(
                            ([floorKey, floor]: any) => [
                                floorKey,
                                {
                                    ...floor,
                                    units: floor.units || {},
                                },
                            ]
                        )
                    )
                    setDevicesData(deviceResData)
                    setBuildData({
                        ...buildingResData,
                        details: updatedDetails,
                    })
                } else {
                    navigateTo('/buildings')
                }
            } catch (error) {
                navigateTo('/buildings')
                setLoading(false)
            }
        }
        fetchData()
    }, [id, navigateTo])

    function formatDataObject(obj: Record<string, any>): JSX.Element[] {
        if (!obj || typeof obj.data !== 'object') return []
        return Object.entries(obj.data).map(([key, value]) => (
            <p key={key}>
                <strong>{key}</strong> = {String(value)}
            </p>
        ))
    }

    const floorEntries = Object.entries(buildData?.details || {})
        .sort()
        .reverse()

    useEffect(() => {
        const unsubscribeFunctions: (() => void)[] = []

        floorEntries?.forEach(([floorKey, floor]: any) => {
            const unitKeys = Object.keys(floor.units)

            unitKeys.forEach((unitKey) => {
                const unit = floor.units[unitKey]
                const device = devicesData.find(
                    (device) =>
                        device.deviceEncryptedId.toString() ===
                        unit.device.toString()
                )

                if (device?.deviceEncryptedId) {
                    const unsubscribe = subscribe(
                        undefined,
                        device.deviceEncryptedId,
                        (message: any) => {
                            let tempData = { ...message.data }
                            delete tempData.HV
                            delete tempData.FV
                            if (tempData.proof) {
                                delete tempData.proof
                            }

                            if (
                                String(message.from) ===
                                String(device.deviceEncryptedId)
                            ) {
                                setDevicePayloads((prevData) => ({
                                    ...prevData,
                                    [String(message.from)]: {
                                        received: true,
                                        data: { ...tempData },
                                        date: new Date(),
                                    },
                                }))

                                if (timersRef.current[String(message.from)]) {
                                    clearTimeout(
                                        timersRef.current[String(message.from)]
                                    )
                                }

                                timersRef.current[String(message.from)] =
                                    setTimeout(() => {
                                        setDevicePayloads((prevData) => ({
                                            ...prevData,
                                            [String(message.from)]: {
                                                ...prevData[
                                                    String(message.from)
                                                ],
                                                received: false,
                                            },
                                        }))
                                        delete timersRef.current[
                                            String(message.from)
                                        ]
                                    }, 1000)
                            }
                        },
                        true
                    )
                    unsubscribeFunctions.push(unsubscribe)
                }
            })
        })

        return () => {
            unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
        }
    }, [devicesData])

    if (loading === true) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    return (
        <main className="flex flex-col gap-8 w-full">
            <h3>"{buildData?.name}" building details</h3>
            <section className="w-full border overflow-x-auto">
                {floorEntries?.map(([floorKey, floor]: any, floorIndex) => {
                    const unitKeys = Object.keys(floor.units)

                    return (
                        <div key={floorKey} className="flex w-full">
                            <div
                                className={`flex justify-center items-center bg-${themeColor}-400 bg-opacity-40 w-[100px] border flex-shrink-0`}
                            >
                                <h4 className="text-[1.1rem]">
                                    {utils.formatBuildingStrings(floorKey)}
                                </h4>
                            </div>
                            <div className="flex w-full">
                                {unitKeys?.map((unitKey, index) => {
                                    const unit = floor.units[unitKey]
                                    const device = devicesData.find(
                                        (device) =>
                                            device.deviceEncryptedId.toString() ===
                                            unit.device.toString()
                                    )
                                    const payload =
                                        devicePayloads[
                                            String(device?.deviceEncryptedId)
                                        ]

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (device?._id) {
                                                    navigateTo(
                                                        `/devices/details/${device._id}?buildingId=${id}`
                                                    )
                                                }
                                            }}
                                            className={`flex flex-col items-start animation-border ${
                                                payload?.received &&
                                                'border-[#00ff00]'
                                            }  justify-start hover:cursor-pointer hover:bg-gray-700 border-[1.5px] bg-opacity-30 p-3 w-[175px] flex-shrink-0`}
                                        >
                                            <h4 className="text-[1.1rem] place-start">
                                                {`${
                                                    utils.sliceBuildingStrings(
                                                        unitKey
                                                    )[0]
                                                } ${
                                                    Number(
                                                        utils.sliceBuildingStrings(
                                                            floorKey
                                                        )[1]
                                                    ) *
                                                        100 +
                                                    Number(
                                                        utils.sliceBuildingStrings(
                                                            unitKey
                                                        )[1]
                                                    )
                                                }`}
                                            </h4>

                                            <p className="mb-4">
                                                {(unit.device &&
                                                    device?.deviceName) ||
                                                    'Device not selected'}
                                                :
                                            </p>

                                            <p>
                                                {payload
                                                    ? formatDataObject(payload)
                                                    : 'Data not received'}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </section>
        </main>
    )
}
