import { Button, Dropdown, Input, Notification, toast } from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './style.css'
import {
    HiChevronDown,
    HiChevronUp,
    HiEye,
    HiMinus,
    HiPlus,
    HiTrash,
} from 'react-icons/hi'
import { useGetDevices } from '@/utils/hooks/useGetDevices'
import { Loading } from '@/components/shared'
import { setSideNavCollapse, useAppDispatch, useAppSelector } from '@/store'
import {
    apiCreateNewBuilding,
    apiEditBuildingByBuildId,
    apiGetBuildingByBuildId,
} from '@/services/UserApi'
import utils from '../../scripts/utils'

interface DeviceDatas {
    deviceEncryptedId: string
    deviceName: string
    deviceType: string
    mac: string
    _id: string
}

export function CreateEditBuilding() {
    const maxFloor = 10
    const [buildData, setBuildData] = useState<any>({
        name: 'Tower 1',
        details: {
            floor_1: {
                name: '',
                units: {
                    unit_1: {
                        name: '',
                        device: '',
                    },
                },
            },
        },
    })
    const [apiLoading, setApiLoading] = useState(false)
    const [mainLoading, setMainLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [selectedFloor, setSelectedFloor] = useState<number | null>(1)
    const [buildingView, setBuildingView] = useState<string>('tower')
    const { type } = useParams<{ type: string }>()
    const { status, devices } = useGetDevices()
    const scrollToRef = useRef<HTMLDivElement | null>(null)
    const deviceLoading = status === 'pending'
    const deviceDatas = devices?.data.data as Array<DeviceDatas>
    const navigateTo = useNavigate()
    const dispatch = useAppDispatch()

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel
    )

    const getDeviceNameById = (deviceEncryptedId: string) => {
        const device = deviceDatas.find(
            (device) => device.deviceEncryptedId === deviceEncryptedId
        )
        return device ? device.deviceName : ''
    }

    const createNewFloor = () => {
        const floorCount = Object.keys(buildData.details).length

        if (floorCount >= maxFloor) {
            toast.push(
                <Notification type="warning">
                    Maximum of {maxFloor} floors allowed
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            return
        }

        const newFloorCount = floorCount + 1
        const newFloorKey = `floor_${newFloorCount}`
        const newFloor = {
            name: ``,
            units: {
                unit_1: {
                    name: '',
                    device: '',
                },
            },
        }

        setBuildData((prevData: any) => {
            const updatedDetails = {
                [newFloorKey]: newFloor,
                ...prevData.details,
            }
            return {
                ...prevData,
                details: updatedDetails,
            }
        })

        toast.push(
            <Notification type="info">
                Floor <span className="text-green-400">created</span>{' '}
                successfully
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const deleteFloor = (floorKey: string) => {
        setBuildData((prevData: any) => {
            // Ensure there's at least one floor left
            if (Object.keys(prevData.details).length <= 1) {
                toast.push(
                    <Notification type="warning">
                        At least one floor must be present
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                return prevData
            }

            const updatedDetails = { ...prevData.details }
            const units = updatedDetails[floorKey].units
            for (const unitKey in units) {
                delete units[unitKey]
            }
            delete updatedDetails[floorKey]

            if (Object.entries(buildData.details).length == selectedFloor) {
                setSelectedFloor(Object.entries(buildData.details).length - 1)
            }

            return {
                ...prevData,
                details: updatedDetails,
            }
        })

        toast.push(
            <Notification type="info">
                Floor <span className="text-red-400">deleted</span> successfully
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const createNewUnit = (floorKey: string, unitKey: string) => {
        setBuildData((prevData: any) => {
            const floor = prevData.details[floorKey]
            if (!floor) return prevData

            const unitCount = Object.keys(floor.units).length

            // Check if the unit to be created follows the sequence
            if (unitKey !== `unit_${unitCount + 1}`) {
                toast.push(
                    <Notification type="warning">
                        You can only create the next unit in sequence.
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                return prevData
            }

            if (unitCount >= 6) {
                toast.push(
                    <Notification type="warning">
                        Maximum of 6 units per floor allowed
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                return prevData
            }

            const newUnitKey = `unit_${unitCount + 1}`
            const newUnit = {
                name: '',
                device: '',
            }

            return {
                ...prevData,
                details: {
                    ...prevData.details,
                    [floorKey]: {
                        ...floor,
                        units: {
                            ...floor.units,
                            [newUnitKey]: newUnit,
                        },
                    },
                },
            }
        })
    }

    const handleCreateUnit = (unitKey: string) => {
        const units = buildData.details[`floor_${selectedFloor}`]?.units || {}
        const unitExists = Object.keys(units).some((key) => key === unitKey)

        if (!unitExists) {
            createNewUnit(`floor_${selectedFloor}`, unitKey)
        }
    }

    const deleteUnit = (floorKey: string, unitKey: string) => {
        setBuildData((prevData: any) => {
            const updatedFloor = { ...prevData.details[floorKey] }
            delete updatedFloor.units[unitKey]
            return {
                ...prevData,
                details: {
                    ...prevData.details,
                    [floorKey]: updatedFloor,
                },
            }
        })
    }

    const handleUnitChange = (
        floorKey: string,
        unitKey: string,
        field: 'name' | 'device',
        value: string
    ) => {
        setBuildData((prevData: any) => {
            const floor = prevData.details[floorKey]
            if (!floor) return prevData

            const unit = floor.units[unitKey]
            if (!unit) return prevData

            return {
                ...prevData,
                details: {
                    ...prevData.details,
                    [floorKey]: {
                        ...floor,
                        units: {
                            ...floor.units,
                            [unitKey]: {
                                ...unit,
                                [field]: value,
                            },
                        },
                    },
                },
            }
        })
    }

    const handleFloorNameChange = (floorKey: string, value: string) => {
        setBuildData((prevData: any) => {
            return {
                ...prevData,
                details: {
                    ...prevData.details,
                    [floorKey]: {
                        ...prevData.details[floorKey],
                        name: value,
                    },
                },
            }
        })
    }

    useEffect(() => {
        dispatch(setSideNavCollapse(true))
        setTimeout(() => {
            if (scrollToRef.current) {
                scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }, 100)

        async function fetchData() {
            if (type === 'new') {
                setMainLoading(false)
            } else {
                setEditing(true)
                try {
                    const res = (await apiGetBuildingByBuildId(
                        type || ''
                    )) as any
                    const resData = res.data.data
                    setMainLoading(false)
                    if (resData) {
                        const updatedDetails = Object.fromEntries(
                            Object.entries(resData.details).map(
                                ([floorKey, floor]: any) => [
                                    floorKey,
                                    {
                                        ...floor,
                                        units: floor.units || {},
                                    },
                                ]
                            )
                        )
                        setBuildData({
                            name: resData.name,
                            details: updatedDetails,
                            _id: resData._id,
                        })
                    } else {
                        navigateTo('/buildings')
                    }
                } catch (error) {
                    navigateTo('/buildings')
                    setMainLoading(false)
                }
            }
        }
        fetchData()
    }, [type, navigateTo])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuildData({ ...buildData, name: e.target.value })
    }

    const handleDeviceSelect = (
        floorKey: string,
        unitKey: string,
        value: string
    ) => {
        const selectedDevice = deviceDatas.find(
            (device) =>
                device.deviceEncryptedId === value ||
                device.deviceName === value
        )
        handleUnitChange(
            floorKey,
            unitKey,
            'device',
            selectedDevice ? selectedDevice.deviceEncryptedId : ''
        )
    }

    const getAvailableDevices = (selectedDeviceId: string) => {
        const selectedDeviceIds = new Set<string>()
        for (const floor of Object.values(buildData.details)) {
            for (const unit of Object.values((floor as any).units) as any) {
                if (unit.device && unit.device !== selectedDeviceId) {
                    selectedDeviceIds.add(unit.device)
                }
            }
        }
        return deviceDatas.filter(
            (device) => !selectedDeviceIds.has(device.deviceEncryptedId)
        )
    }

    async function handleSubmit() {
        setApiLoading(true)

        try {
            let res
            if (editing) {
                res = await apiEditBuildingByBuildId(buildData._id, buildData)
            } else {
                res = await apiCreateNewBuilding(buildData)
            }

            toast.push(
                <Notification type="success">
                    {`Building ${
                        (editing && 'edited') || 'created'
                    } successfully`}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigateTo('/buildings')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {`Error while ${
                        (editing && 'editing') || 'creating'
                    } new building!`}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
        setApiLoading(false)
    }

    const floorEntries = Object.entries(buildData.details).sort(([a], [b]) => {
        // Extract the numeric part from the floor name strings
        const floorNumberA = parseInt(a.replace('floor_', ''), 10)
        const floorNumberB = parseInt(b.replace('floor_', ''), 10)

        // Compare the extracted numeric values
        return floorNumberB - floorNumberA
    })

    const lastFloorKey = floorEntries[0]?.[0]

    if (deviceLoading == true || mainLoading == true) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    const handleFloorNavigation = (direction: 'up' | 'down') => {
        if (!selectedFloor) return

        const currentIndex = floorEntries.findIndex(
            ([key]) => key === `floor_${selectedFloor}`
        )

        if (direction === 'up' && currentIndex > 0) {
            setSelectedFloor(
                Number(floorEntries[currentIndex - 1][0].split('_')[1])
            )
        } else if (
            direction === 'down' &&
            currentIndex < floorEntries.length - 1
        ) {
            setSelectedFloor(
                Number(floorEntries[currentIndex + 1][0].split('_')[1])
            )
        }
    }

    return (
        <section className="flex flex-col gap-6 w-full building-section">
            <h3 className="text-xl font-semibold">
                Complete your building data
            </h3>
            <div className="flex gap-4 w-full lg:w-2/3 xl:w-5/12 items-center">
                <p className="build-p">Building name: </p>
                <Input
                    disabled={apiLoading}
                    maxLength={30}
                    type="text"
                    value={buildData.name}
                    onChange={handleInputChange}
                />
                <Button
                    onClick={handleSubmit}
                    loading={apiLoading}
                    color="green"
                    variant="solid"
                >
                    {(editing && 'Edit Building') || 'Create Building'}
                </Button>
            </div>

            {buildingView == 'tower' && (
                <section
                    ref={scrollToRef}
                    className={`w-full min-h-[100dvh] relative`}
                >
                    <img
                        src="/img/building/roof.png"
                        alt="roof pic"
                        style={{
                            bottom: `${
                                (Object.entries(buildData.details).length - 1) *
                                    5 +
                                15.5
                            }%`,
                        }}
                        className="roof"
                    />

                    {Object.entries(buildData.details)
                        .reverse()
                        .map(([floorKey, floor], index) => {
                            return (
                                <img
                                    key={floorKey}
                                    src={`/img/building/middle${
                                        index % 2 == 0 ? 2 : 1
                                    }.png`} // Adjust path for different floors
                                    alt={`Floor ${index + 1}`}
                                    style={{ bottom: `${index * 5 + 15}%` }}
                                    className={`floor ${
                                        `floor_${selectedFloor}` == floorKey &&
                                        'selected'
                                    }`}
                                />
                            )
                        })}
                    <img
                        src="/img/building/pilot.png"
                        alt="pilot pic"
                        className="pilot"
                    />
                </section>
            )}

            {buildingView == 'floor' && (
                <section className="relative w-full">
                    <img
                        className="w-full"
                        src="/img/building/floor-background.png"
                        alt=""
                    />

                    <>
                        <img
                            className="door door-1"
                            src={`/img/building/floor-door-${
                                buildData.details[`floor_${selectedFloor}`]
                                    ?.units['unit_1']
                                    ? 'opacity'
                                    : 'low-opacity'
                            }.png`}
                            alt=""
                        />
                        <h3 className="door-num door-num-1">
                            {selectedFloor}01
                        </h3>
                    </>

                    <>
                        <img
                            className="door door-2"
                            src={`/img/building/floor-door-${
                                buildData.details[`floor_${selectedFloor}`]
                                    ?.units['unit_2']
                                    ? 'opacity'
                                    : 'low-opacity'
                            }.png`}
                            alt=""
                            onClick={() =>
                                createNewUnit(
                                    `floor_${selectedFloor}`,
                                    'unit_2'
                                )
                            }
                        />
                        {/* Show plus button if unit_1 exists and unit_2 does not */}
                        {buildData.details[`floor_${selectedFloor}`]?.units[
                            'unit_1'
                        ] &&
                            !buildData.details[`floor_${selectedFloor}`]?.units[
                                'unit_2'
                            ] && (
                                <img
                                    className="door-button button-1"
                                    src="/img/building/floor-plus-icon.png"
                                    alt=""
                                    onClick={() =>
                                        createNewUnit(
                                            `floor_${selectedFloor}`,
                                            'unit_2'
                                        )
                                    }
                                />
                            )}
                        <h3 className="door-num door-num-2">
                            {selectedFloor}02
                        </h3>
                    </>

                    <>
                        <img
                            className="door door-3"
                            src={`/img/building/floor-door-${
                                buildData.details[`floor_${selectedFloor}`]
                                    ?.units['unit_3']
                                    ? 'opacity'
                                    : 'low-opacity'
                            }.png`}
                            alt=""
                            onClick={() =>
                                createNewUnit(
                                    `floor_${selectedFloor}`,
                                    'unit_3'
                                )
                            }
                        />
                        {/* Show plus button if unit_2 exists and unit_3 does not */}
                        {buildData.details[`floor_${selectedFloor}`]?.units[
                            'unit_2'
                        ] &&
                            !buildData.details[`floor_${selectedFloor}`]?.units[
                                'unit_3'
                            ] && (
                                <img
                                    className="door-button button-2"
                                    src="/img/building/floor-plus-icon.png"
                                    alt=""
                                    onClick={() =>
                                        createNewUnit(
                                            `floor_${selectedFloor}`,
                                            'unit_3'
                                        )
                                    }
                                />
                            )}
                        <h3 className="door-num door-num-3">
                            {selectedFloor}03
                        </h3>
                    </>

                    <>
                        <img
                            className="door door-4"
                            src={`/img/building/floor-door-${
                                buildData.details[`floor_${selectedFloor}`]
                                    ?.units['unit_4']
                                    ? 'opacity'
                                    : 'low-opacity'
                            }.png`}
                            alt=""
                            onClick={() =>
                                createNewUnit(
                                    `floor_${selectedFloor}`,
                                    'unit_4'
                                )
                            }
                        />
                        {/* Show plus button if unit_3 exists and unit_4 does not */}
                        {buildData.details[`floor_${selectedFloor}`]?.units[
                            'unit_3'
                        ] &&
                            !buildData.details[`floor_${selectedFloor}`]?.units[
                                'unit_4'
                            ] && (
                                <img
                                    className="door-button button-3"
                                    src="/img/building/floor-plus-icon.png"
                                    alt=""
                                    onClick={() =>
                                        createNewUnit(
                                            `floor_${selectedFloor}`,
                                            'unit_4'
                                        )
                                    }
                                />
                            )}
                        <h3 className="door-num door-num-4">
                            {selectedFloor}04
                        </h3>
                    </>
                </section>
            )}

            {/* Building control section */}
            <div className="build-setup flex flex-col gap-3">
                {buildingView == 'tower' && (
                    <>
                        <div className="grid grid-cols-2 text-center">
                            <p className="col-span-1 text-[1.1rem]">
                                Selected floor:{' '}
                                <span className="text-white font-bold">
                                    {selectedFloor}
                                </span>
                            </p>
                            <p className="col-span-1 text-[1.1rem]">
                                Total floors:{' '}
                                <span className="text-white font-bold">
                                    {Object.entries(buildData.details).length}
                                </span>
                            </p>
                        </div>
                        <Button
                            icon={<HiEye />}
                            size="md"
                            className="w-full"
                            variant="solid"
                            color="yellow"
                            onClick={() => setBuildingView('floor')}
                        >
                            Enter Floor
                        </Button>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={createNewFloor}
                                icon={<HiPlus />}
                                size="md"
                                color="green"
                                variant="solid"
                                className="col-span-1 w-full"
                            >
                                Add Floor
                            </Button>
                            <Button
                                onClick={() => {
                                    if (lastFloorKey) {
                                        deleteFloor(lastFloorKey)
                                    }
                                }}
                                icon={<HiMinus />}
                                size="md"
                                color="red"
                                variant="solid"
                                className="col-span-1 w-full"
                            >
                                Delete Floor
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => handleFloorNavigation('up')}
                                icon={<HiChevronUp />}
                                size="md"
                                className="col-span-1 w-full"
                                variant="solid"
                                disabled={
                                    !selectedFloor ||
                                    floorEntries.findIndex(
                                        ([key]) =>
                                            key === `floor_${selectedFloor}`
                                    ) === 0
                                }
                            >
                                Go Up
                            </Button>
                            <Button
                                onClick={() => handleFloorNavigation('down')}
                                icon={<HiChevronDown />}
                                size="md"
                                className="col-span-1 w-full"
                                variant="solid"
                                disabled={
                                    !selectedFloor ||
                                    floorEntries.findIndex(
                                        ([key]) =>
                                            key === `floor_${selectedFloor}`
                                    ) ===
                                        floorEntries.length - 1
                                }
                            >
                                Go Down
                            </Button>
                        </div>
                    </>
                )}
                {buildingView == 'floor' && (
                    <>
                        <h4 className="text-center font-bold">
                            Floor {selectedFloor}
                        </h4>
                        <div className="grid grid-cols-2 text-center">
                            <p className="col-span-1 text-[1.1rem]">
                                Total devices:{' '}
                                <span className="text-white font-bold">
                                    ???
                                </span>
                            </p>
                            <p className="col-span-1 text-[1.1rem]">
                                Total units:{' '}
                                <span className="text-white font-bold">
                                    ???
                                </span>
                            </p>
                        </div>
                        <Button
                            onClick={() => setBuildingView('tower')}
                            size="md"
                            color="red"
                            variant="solid"
                            className="w-full"
                        >
                            Back
                        </Button>
                    </>
                )}
            </div>
        </section>
    )
}
