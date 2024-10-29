import { Loading } from '@/components/shared'
import { apiGetBuildingByBuildId } from '@/services/UserApi'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import utils from '../../scripts/utils'
import { HiUser } from 'react-icons/hi'
import {
    apiGetDevices,
    apiGetLocalShareUsersWithDeviceId,
    apiGetSharedWithMeDevices,
} from '@/services/DeviceApi'
import { useAppSelector } from '@/store'
import { DeviceData } from '@/utils/hooks/useGetDevices'
import useThemeClass from '@/utils/hooks/useThemeClass'

export default function BuildingDetails() {
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [buildData, setBuildData] = useState<any>({})
    const [devicesData, setDevicesData] = useState<Array<DeviceData>>([])
    const navigateTo = useNavigate()
    const { _id: userId } = useAppSelector((state) => state.auth.user)

    const themeColor = useAppSelector((state) => state.theme.themeColor)

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
                                            className={`flex flex-col items-start justify-center hover:cursor-pointer hover:bg-gray-700 bg-opacity-30 p-3 w-[175px] border flex-shrink-0`}
                                        >
                                            <h4 className="text-[1.1rem]">
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

                                            <p>
                                                {(unit.device &&
                                                    device?.deviceName) ||
                                                    'Device not selected'}
                                                :
                                            </p>
                                            <p>Data not received</p>
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
