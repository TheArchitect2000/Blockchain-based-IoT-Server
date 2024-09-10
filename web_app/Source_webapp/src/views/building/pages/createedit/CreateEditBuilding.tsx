import { Button, Dropdown, Input, Notification, toast } from '@/components/ui'
import React, { useEffect, useRef, useState } from 'react'
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

interface DeviceDatas {
    deviceEncryptedId: string
    deviceName: string
    deviceType: string
    mac: string
    _id: string
}

export function CreateEditBuilding() {
    const maxFloor = 15
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
    const [scroll, setScroll] = useState<number>(0)
    const [selectedFloor, setSelectedFloor] = useState<number>(1)
    const [unitRefs, setUnitRefs] = useState<React.RefObject<any>[]>(
        [1, 2, 3, 4].map(() => React.createRef())
    )

    const [buildingView, setBuildingView] = useState<string>('tower')
    const { type } = useParams<{ type: string }>()
    const { status, devices } = useGetDevices()
    const scrollToPilotRef = useRef<HTMLImageElement | null>(null)
    const scrollToUnitsRef = useRef<HTMLImageElement | null>(null)
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
            toast.push(
                <Notification type="info">
                    Floor <span className="text-red-400">deleted</span>{' '}
                    successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            if (Object.entries(buildData.details).length == selectedFloor) {
                setSelectedFloor(Object.entries(buildData.details).length - 1)
            }

            return {
                ...prevData,
                details: updatedDetails,
            }
        })
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

    const getSelectedDeviceName = (
        selectedFloor: number,
        unitNumber: number
    ) => {
        const unitKey = `unit_${unitNumber}`

        // Get the device ID assigned to the specified unit
        const deviceId =
            buildData.details[`floor_${selectedFloor}`]?.units[unitKey]?.device

        // If a device is assigned, find and return its data
        if (deviceId) {
            const selectedDevice = deviceDatas.find(
                (device) => device.deviceEncryptedId === deviceId
            )

            return selectedDevice?.deviceName || 'Device data not found'
        }

        return 'Select Device'
    }

    useEffect(() => {
        dispatch(setSideNavCollapse(true))
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

                        setTimeout(() => {
                            if (scrollToPilotRef.current) {
                                scrollToPilotRef.current.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                        }, 100)
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

    function scrollToView() {
        setScroll((perv) => perv + 1)
    }

    useEffect(() => {
        setTimeout(() => {
            if (scrollToPilotRef.current) {
                scrollToPilotRef.current.scrollIntoView({
                    behavior: 'smooth',
                })
            }
            if (scrollToUnitsRef.current) {
                scrollToUnitsRef.current.scrollIntoView({
                    behavior: 'smooth',
                })
            }
        }, 100)
    }, [scroll])

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

        // Loop through all units across all floors to find selected devices
        Object.values(buildData.details).forEach((floor: any) => {
            Object.values(floor.units).forEach((unit: any) => {
                if (unit.device && unit.device !== selectedDeviceId) {
                    selectedDeviceIds.add(unit.device)
                }
            })
        })

        // Filter devices that are not already selected
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

    /* function getFloorDistance() {
        const floors = Object.entries(buildData.details).length
        if (floors <= 4) {
            return [6.8, 12.5]
        } else if ( floors <= 6 ){
            return [5.9, 15]
        } else if ( floors <= 8 ){
            return [5.2, 16]
        } else {
            return [4.5, 16.5]
        }
    } */

    function getFloorDistance() {
        const floors = Object.entries(buildData.details).length
        return [1.91, 5.6]
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

    function getTotalUnits(floor: number): number {
        return Number(
            Object.keys(buildData.details[`floor_${floor}`]?.units || {}).length
        )
    }

    const getTotalDevicesForFloor = (floorNumber: number): number => {
        const floorKey = `floor_${floorNumber}`
        const floorUnits = buildData.details[floorKey]?.units || {}

        return Number(
            Object.values(floorUnits).reduce(
                (acc: any, unit: any) => acc + (unit.device ? 1 : 0),
                0
            )
        )
    }

    const getTotalDevicesForAllFloors = (): number => {
        return Number(
            Object.values(buildData.details).reduce(
                (acc: any, floor: any) =>
                    acc +
                    Object.values(floor.units || {}).reduce(
                        (unitAcc: any, unit: any) =>
                            unitAcc + (unit.device ? 1 : 0),
                        0
                    ),
                0
            )
        )
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
                {/* <Button
                    onClick={() => console.log(buildData)}
                    variant="default"
                >
                    log
                </Button> */}
            </div>

            {buildingView == 'tower' && (
                <section
                    style={{
                        height: `${
                            Object.entries(buildData.details).length * 2 + 21
                        }vw`,
                    }}
                    className={`w-full relative`}
                >
                    <img
                        src="/img/building/roof.png"
                        alt="roof pic"
                        style={{
                            bottom: `${
                                (Object.entries(buildData.details).length - 1) *
                                    getFloorDistance()[0] +
                                getFloorDistance()[1]
                            }vw`,
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
                                    style={{
                                        bottom: `${
                                            index * getFloorDistance()[0] +
                                            getFloorDistance()[1]
                                        }vw`,
                                    }}
                                    className={`floor ${
                                        `floor_${selectedFloor}` == floorKey &&
                                        'selected'
                                    }`}
                                />
                            )
                        })}
                    <img
                        ref={scrollToPilotRef}
                        src="/img/building/pilot.png"
                        alt="pilot pic"
                        className="pilot"
                    />
                </section>
            )}

            {buildingView == 'floor' && (
                <section className="relative w-full">
                    <img
                        ref={scrollToUnitsRef}
                        className="w-full"
                        src="/img/building/floor-background.png"
                        alt=""
                    />
                    {[1, 2, 3, 4].map((unitNumber) => {
                        const unitKey = `unit_${unitNumber}`
                        const unitExists =
                            buildData.details[`floor_${selectedFloor}`]?.units[
                                unitKey
                            ]
                        const prevUnitKey = `unit_${unitNumber - 1}`
                        const prevUnitExists =
                            buildData.details[`floor_${selectedFloor}`]?.units[
                                prevUnitKey
                            ]

                        const handleUnitNameChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            const updatedUnits = {
                                ...buildData.details[`floor_${selectedFloor}`]
                                    .units,
                                [unitKey]: {
                                    ...buildData.details[
                                        `floor_${selectedFloor}`
                                    ].units[unitKey],
                                    name: e.target.value,
                                },
                            }
                            setBuildData({
                                ...buildData,
                                details: {
                                    ...buildData.details,
                                    [`floor_${selectedFloor}`]: {
                                        ...buildData.details[
                                            `floor_${selectedFloor}`
                                        ],
                                        units: updatedUnits,
                                    },
                                },
                            })
                        }

                        const handleDeviceSelect = (eventKey: string) => {
                            const updatedUnits = {
                                ...buildData.details[`floor_${selectedFloor}`]
                                    .units,
                                [unitKey]: {
                                    ...buildData.details[
                                        `floor_${selectedFloor}`
                                    ].units[unitKey],
                                    device: eventKey,
                                },
                            }
                            setBuildData({
                                ...buildData,
                                details: {
                                    ...buildData.details,
                                    [`floor_${selectedFloor}`]: {
                                        ...buildData.details[
                                            `floor_${selectedFloor}`
                                        ],
                                        units: updatedUnits,
                                    },
                                },
                            })
                        }

                        return (
                            <React.Fragment key={unitNumber}>
                                <img
                                    className={`door ${
                                        !unitExists && 'cursor-pointer'
                                    } door-${unitNumber}`}
                                    src={`/img/building/floor-door-${
                                        unitExists ? 'opacity' : 'low-opacity'
                                    }.png`}
                                    alt={`Unit ${unitNumber}`}
                                    onClick={() =>
                                        unitExists ||
                                        createNewUnit(
                                            `floor_${selectedFloor}`,
                                            unitKey
                                        )
                                    }
                                />
                                <h3
                                    onClick={() =>
                                        unitExists ||
                                        createNewUnit(
                                            `floor_${selectedFloor}`,
                                            unitKey
                                        )
                                    }
                                    className={`door-num ${
                                        !unitExists && 'cursor-pointer'
                                    } door-num-${unitNumber}`}
                                >
                                    {`${selectedFloor}0${unitNumber}`}
                                </h3>

                                {!unitExists &&
                                    (unitNumber === 1 || prevUnitExists) && (
                                        <img
                                            className={`door-button ${
                                                !unitExists && 'cursor-pointer'
                                            } button-${unitNumber}`}
                                            src="/img/building/floor-plus-icon.png"
                                            alt={`Add Unit ${unitNumber}`}
                                            onClick={() =>
                                                createNewUnit(
                                                    `floor_${selectedFloor}`,
                                                    unitKey
                                                )
                                            }
                                        />
                                    )}

                                {unitExists && (
                                    <>
                                        {/* Input for Unit Name */}
                                        <Input
                                            type="text"
                                            value={
                                                buildData.details[
                                                    `floor_${selectedFloor}`
                                                ]?.units[unitKey].name || ''
                                            }
                                            onChange={handleUnitNameChange}
                                            placeholder={`Unit Name`}
                                            style={{ background: '#656565' }}
                                            className={`unit-name unit-name-${unitNumber}`}
                                        />

                                        {/* Dropdown for Device Selection */}
                                        <Button
                                            variant="default"
                                            style={{
                                                fontSize: '0.5vw',
                                                fontWeight: "500",
                                                background: '#656565',
                                            }}
                                            className={`flex items-center justify-center unit-dropdown unit-dropdown-${unitNumber}`}
                                            onClick={() => {
                                                unitRefs[
                                                    unitNumber - 1
                                                ].current?.children[0]?.click()
                                            }}
                                        >
                                            {getSelectedDeviceName(
                                                selectedFloor,
                                                unitNumber
                                            )}
                                            <Dropdown
                                                ref={unitRefs[unitNumber - 1]}
                                                trigger="click"
                                                onSelect={handleDeviceSelect}
                                                placement="middle-start-top"
                                                activeKey={
                                                    buildData.details[
                                                        `floor_${selectedFloor}`
                                                    ]?.units[unitKey]?.device ||
                                                    ''
                                                }
                                            >
                                                {/* Unselect Option */}
                                                <Dropdown.Item eventKey="">
                                                    Unselect Device
                                                </Dropdown.Item>

                                                {/* Available Devices */}
                                                {getAvailableDevices(
                                                    buildData.details[
                                                        `floor_${selectedFloor}`
                                                    ]?.units[unitKey]?.device
                                                ).map((device) => (
                                                    <Dropdown.Item
                                                        eventKey={
                                                            device.deviceEncryptedId
                                                        }
                                                        key={
                                                            device.deviceEncryptedId
                                                        }
                                                    >
                                                        {device.deviceName}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown>
                                        </Button>
                                    </>
                                )}

                                {unitExists &&
                                    !buildData.details[`floor_${selectedFloor}`]
                                        ?.units[`unit_${unitNumber + 1}`] && (
                                        <img
                                            src="/img/building/trash.png"
                                            onClick={() =>
                                                deleteUnit(
                                                    `floor_${selectedFloor}`,
                                                    unitKey
                                                )
                                            }
                                            className={`door-delete door-delete-${unitNumber}`}
                                            alt="trash image"
                                        />
                                    )}
                            </React.Fragment>
                        )
                    })}
                </section>
            )}

            {/* Building control section */}
            <div className="build-setup flex flex-col">
                {buildingView == 'tower' && (
                    <>
                        <div className="grid grid-cols-1 text-center">
                            <p className="col-span-1 text-white text-[1.35rem]">
                                Total floors:{' '}
                                <span className="font-bold">
                                    {Object.entries(buildData.details).length}
                                </span>
                            </p>
                            <p className="col-span-1 text-white text-[1.35rem]">
                                Selected floor:{' '}
                                <span className="font-bold">
                                    {selectedFloor}
                                </span>
                            </p>
                            <p className="col-span-1 text-[1.2rem]">
                                Devices on this floor:{' '}
                                <span className="text-white font-bold">
                                    {getTotalDevicesForFloor(selectedFloor)}
                                </span>
                            </p>
                            <p className="col-span-1 text-[1.2rem]">
                                Units on this floor:{' '}
                                <span className="text-white font-bold">
                                    {getTotalUnits(selectedFloor)}
                                </span>
                            </p>
                        </div>
                        <Button
                            icon={<HiEye />}
                            size="sm"
                            className="w-full"
                            variant="solid"
                            color="yellow"
                            onClick={() => {
                                setBuildingView('floor')
                                scrollToView()
                            }}
                        >
                            Enter Floor
                        </Button>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={createNewFloor}
                                icon={<HiPlus />}
                                size="sm"
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
                                size="sm"
                                color="red"
                                variant="solid"
                                className="col-span-1 w-full"
                                disabled={floorEntries.length == 1}
                            >
                                Delete Floor
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={() => handleFloorNavigation('up')}
                                icon={<HiChevronUp />}
                                size="sm"
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
                                size="sm"
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
                                    {getTotalDevicesForFloor(selectedFloor)}
                                </span>
                            </p>
                            <p className="col-span-1 text-[1.1rem]">
                                Total units:{' '}
                                <span className="text-white font-bold">
                                    {getTotalUnits(selectedFloor)}
                                </span>
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setBuildingView('tower')
                                scrollToView()
                            }}
                            size="sm"
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
