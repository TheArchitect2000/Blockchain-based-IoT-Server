import { Loading } from '@/components/shared'
import { apiGetBuildingByBuildId } from '@/services/UserApi'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import utils from '../../scripts/utils'
import { HiUser } from 'react-icons/hi'
import { apiGetDevices } from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { DeviceData } from '@/utils/hooks/useGetDevices'

export default function BuildingDetails() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [buildData, setBuildData] = useState<any>({})
    const [devicesData, setDevicesData] = useState<Array<DeviceData>>([])
    const navigateTo = useNavigate()
    const { _id: userId } = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const buildingRes = (await apiGetBuildingByBuildId(
                    id || ''
                )) as any
                const deviceRes = (await apiGetDevices(userId || '')) as any
                const deviceResData = deviceRes.data.data as Array<DeviceData>
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

    if (loading === true) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    const floorEntries = Object.entries(buildData.details).sort().reverse()

    return (
        <main className="flex flex-col gap-8 w-full">
            <h3>"{buildData?.name}" building details</h3>
            <section className="w-full border">
                {floorEntries?.map(([floorKey, floor]: any) => {
                    const unitKeys = Object.keys(floor.units)

                    return (
                        <div key={floorKey} className="flex border w-full">
                            <div className="flex flex-col py-6 gap-2 justify-center items-center w-3/12 border">
                                <h4>{utils.formatBuildingStrings(floorKey)}</h4>
                                <p>
                                    Name: <strong>{floor.name}</strong>
                                </p>
                            </div>
                            <div className="flex flex-wrap w-9/12 border">
                                {unitKeys?.map((unitKey, index) => {
                                    const unit = floor.units[unitKey]
                                    const device = devicesData.find(
                                        (device) =>
                                            device.deviceEncryptedId.toString() ===
                                            unit.device.toString()
                                    )

                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col p-6 gap-2 flex-1 min-w-[250px] items-center justify-center border"
                                        >
                                            <h4>
                                                {utils.formatBuildingStrings(
                                                    unitKey
                                                )}
                                            </h4>
                                            <p>
                                                Name:{' '}
                                                <strong>{unit.name}</strong>
                                            </p>
                                            <p>
                                                Device:{' '}
                                                <strong>
                                                    {device?.deviceName ||
                                                        'Not Selected'}
                                                </strong>
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
