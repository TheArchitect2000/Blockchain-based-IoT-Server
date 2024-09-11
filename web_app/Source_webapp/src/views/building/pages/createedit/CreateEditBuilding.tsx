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
import { Loading } from '@/components/shared'
import { setSideNavCollapse, useAppDispatch, useAppSelector } from '@/store'
import {
    apiCreateNewBuilding,
    apiEditBuildingByBuildId,
    apiGetBuildingByBuildId,
} from '@/services/UserApi'
import { apiGetAllSharedDevices, apiGetDevices } from '@/services/DeviceApi'

interface DeviceData {
    deviceEncryptedId: string
    deviceName: string
    deviceType: string
    mac: string
    _id: string
    nodeDeviceId: string
    nodeId: string
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
    const [deviceListIsOpen, setDeviceListIsOpen] = useState<number>(0)
    const [mainLoading, setMainLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [scroll, setScroll] = useState<number>(0)
    const [selectedFloor, setSelectedFloor] = useState<number>(1)
    const [lastSavedData, setLastSavedData] = useState<any>()
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [myDevices, setMyDevices] = useState<DeviceData[]>([])
    const [unitRefs, setUnitRefs] = useState<React.RefObject<any>[]>(
        [1, 2, 3, 4].map(() => React.createRef())
    )
    const [buildingView, setBuildingView] = useState<string>('tower')
    const { type } = useParams<{ type: string }>()
    const scrollToPilotRef = useRef<HTMLImageElement | null>(null)
    const scrollToUnitsRef = useRef<HTMLImageElement | null>(null)
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const navigateTo = useNavigate()
    const dispatch = useAppDispatch()

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel
    )

    const getTotalFloors = (): number => {
        return Object.keys(buildData.details).length
    }

    const getLastUnitKeyByFloor = (floor: string): number => {
        const units = buildData.details[floor]?.units
        if (!units) return 0 // Return empty string if floor does not exist

        const unitKeys = Object.keys(units)
        return unitKeys.length > 0
            ? Number(unitKeys[unitKeys.length - 1].split('_')[1])
            : 1
    }

    function saveAllLastData(buildingData = buildData) {
        const allFloorsData = Object.entries(buildingData.details).reduce(
            (acc, [floorKey, floorData]: any) => {
                acc[floorKey] = {
                    name: floorData.name || '', // Include the floor name
                    units: Object.entries(floorData.units || {}).reduce(
                        (unitsAcc, [unitKey, unitData]: any) => {
                            unitsAcc[unitKey] = {
                                name: unitData.name || '', // Include the unit name
                                device: unitData.device || '', // Include the device
                            }
                            return unitsAcc
                        },
                        {} as {
                            [key: string]: { name: string; device: string }
                        }
                    ),
                }
                return acc
            },
            {} as {
                [key: string]: {
                    name: string
                    units: { [key: string]: { name: string; device: string } }
                }
            }
        )

        setLastSavedData(allFloorsData)

        //alert('All datas saved')
    }

    const handleSave = () => {
        saveAllLastData()
        setUnsavedChanges(false) // Clear the unsaved changes
        toast.push(
            <Notification type="success">
                Changes saved successfully!
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    // Handle Back Function
    const handleBack = () => {
        if (unsavedChanges) {
            // Revert changes to the last saved state
            setBuildData({
                ...buildData,
                details: lastSavedData,
            })
            setUnsavedChanges(false)
        }

        setBuildingView('tower')
        scrollToView()
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

    const getTotalUnitsByFloor = (floor: string): number => {
        const units = buildData.details[floor]?.units
        return units ? Object.keys(units).length : 0 // Return 0 if floor does not exist
    }

    const createNewUnit = (floorKey: string, unitKey: string) => {
        if (unsavedChanges == false) {
            saveAllLastData()
            setUnsavedChanges(true)
        }
        setBuildData((prevData: any) => {
            const floor = prevData.details[floorKey]
            if (!floor) return prevData

            const unitCount = Object.keys(floor.units).length

            // Check if the unit to be created follows the sequence

            if (unitCount >= 4) {
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

    const deleteUnit = (floorKey: string, unitKey: string) => {
        if (unsavedChanges == false) {
            saveAllLastData()
            setUnsavedChanges(true)
        }

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
            const selectedDevice = myDevices.find(
                (device) => device._id === deviceId
            )

            return selectedDevice?.deviceName || 'Select Device'
        }

        return 'Select Device'
    }

    useEffect(() => {
        dispatch(setSideNavCollapse(true))
        async function fetchData() {
            try {
                let sharedDevices = (await apiGetAllSharedDevices()) as any
                const deviceRes = (await apiGetDevices(userId || '')) as any

                // Extract _id values from deviceRes
                const _ids = new Set(
                    deviceRes.data.data.map((device: any) => device._id)
                )

                // Filter sharedDevices to exclude devices that are already in deviceRes
                const filteredSharedDevices = sharedDevices.data.data.filter(
                    (device: any) => !_ids.has(device._id)
                )

                console.log('deviceRes', deviceRes.data.data)
                console.log('filteredSharedDevices', filteredSharedDevices)

                // Combine the filtered sharedDevices with deviceRes
                setMyDevices([...deviceRes.data.data, ...filteredSharedDevices])
            } catch (error) {
                navigateTo('/buildings')
            }
            if (type === 'new') {
                setMainLoading(false)
                saveAllLastData()
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

                        saveAllLastData({
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
        device: string
    ) => {
        if (unsavedChanges == false) {
            saveAllLastData()
            setUnsavedChanges(true)
        }

        setTimeout(() => {
            const updatedUnits = {
                ...buildData.details[floorKey].units,
                [unitKey]: {
                    ...buildData.details[floorKey].units[unitKey],
                    device: device, // Update the selected device for the unit
                },
            }

            setBuildData({
                ...buildData,
                details: {
                    ...buildData.details,
                    [floorKey]: {
                        ...buildData.details[floorKey],
                        units: updatedUnits,
                    },
                },
            })
        }, 200)
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
        return myDevices.filter((device) => !selectedDeviceIds.has(device._id))
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

    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse
    )

    function getFloorDistance() {
        const floors = Object.entries(buildData.details).length
        return [sideNavCollapse == true ? 1.85 : 1.6, 5.6]
    }

    const floorEntries = Object.entries(buildData.details).sort(([a], [b]) => {
        // Extract the numeric part from the floor name strings
        const floorNumberA = parseInt(a.replace('floor_', ''), 10)
        const floorNumberB = parseInt(b.replace('floor_', ''), 10)

        // Compare the extracted numeric values
        return floorNumberB - floorNumberA
    })

    const lastFloorKey = floorEntries[0]?.[0]

    if (mainLoading == true) {
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

    const handleUnitNameChange = (
        unitKey: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (unsavedChanges == false) {
            saveAllLastData()
            setUnsavedChanges(true)
        }

        const updatedUnits = {
            ...buildData.details[`floor_${selectedFloor}`].units,
            [unitKey]: {
                ...buildData.details[`floor_${selectedFloor}`].units[unitKey],
                name: e.target.value,
            },
        }
        setBuildData({
            ...buildData,
            details: {
                ...buildData.details,
                [`floor_${selectedFloor}`]: {
                    ...buildData.details[`floor_${selectedFloor}`],
                    units: updatedUnits,
                },
            },
        })
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
                {(buildingView == 'tower' &&
                    'Building Configuration Dashboard') ||
                    `Unit Configuration for Floor ${selectedFloor} of building "${buildData.name}"`}
            </h3>
            <p className="text-justify w-8/12">
                {(buildingView == 'tower' &&
                    `In this section, you can specify the number of floors for your
                building and configure the floor units using the 'Enter Floor'
                option from the panel on the right`) ||
                    `In this section, you can
                specify the details for each unit on the selected floor Use the
                'Select Device' option to assign devices to the unit, and
                customize the unit name as needed . To delete a unit, click the
                trash icon at the bottom of the unit's door`}
            </p>
            {buildingView == 'tower' && (
                <div className="flex gap-4 w-full lg:w-2/3 xl:w-5/12 items-center">
                    <p className="build-p">Building name: </p>
                    <Input
                        disabled={apiLoading}
                        maxLength={30}
                        type="text"
                        value={buildData.name}
                        onChange={handleInputChange}
                    />
                    {/* <Button
                    onClick={() => console.log(buildData.details)}
                    variant="default"
                >
                    log
                </Button> */}
                </div>
            )}

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
                        className="roof no-select"
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
                        className="pilot no-select"
                    />
                </section>
            )}

            {buildingView == 'floor' && (
                <section className="relative w-full">
                    <img
                        ref={scrollToUnitsRef}
                        className="w-full h-full no-select"
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

                        return (
                            <React.Fragment key={unitNumber}>
                                <img
                                    className={`door left-pos-${unitNumber} no-select`}
                                    src={`/img/building/floor-door-${
                                        unitExists ? 'opacity' : 'low-opacity'
                                    }.png`}
                                    alt={`Unit ${unitNumber}`}
                                />
                                <h3
                                    className={`door-num left-pos-${unitNumber}`}
                                >
                                    {`${selectedFloor}0${unitNumber}`}
                                </h3>

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
                                            onChange={(e) =>
                                                handleUnitNameChange(unitKey, e)
                                            }
                                            placeholder={`Unit Name`}
                                            style={{ background: '#1F1B21' }}
                                            className={`unit-name left-pos-${unitNumber}`}
                                        />

                                        {/* Dropdown for Device Selection */}
                                        <div
                                            style={{
                                                zIndex:
                                                    deviceListIsOpen ==
                                                    unitNumber
                                                        ? 50
                                                        : 25,
                                            }}
                                            className={`flex items-center justify-end unit-dropdown left-pos-${unitNumber}`}
                                            onClick={() => {
                                                unitRefs[
                                                    unitNumber - 1
                                                ].current?.children[0]?.click()
                                            }}
                                        >
                                            <p>
                                                {getSelectedDeviceName(
                                                    selectedFloor,
                                                    unitNumber
                                                )}
                                            </p>
                                            <Dropdown
                                                ref={unitRefs[unitNumber - 1]}
                                                trigger="click"
                                                onSelect={(device) =>
                                                    handleDeviceSelect(
                                                        `floor_${selectedFloor}`,
                                                        unitKey,
                                                        device
                                                    )
                                                }
                                                onOpen={() =>
                                                    setDeviceListIsOpen(
                                                        unitNumber
                                                    )
                                                }
                                                onClose={() =>
                                                    setDeviceListIsOpen(0)
                                                }
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
                                                        eventKey={device._id}
                                                        key={device._id}
                                                    >
                                                        {device.deviceName} (
                                                        {(device.nodeDeviceId &&
                                                            ` IoT Server: ${
                                                                device.nodeId.split(
                                                                    '.'
                                                                )[0]
                                                            } `) ||
                                                            ` Your Device `}
                                                        )
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown>
                                        </div>
                                    </>
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
                                Sensors on this floor:{' '}
                                <span className="text-white font-bold">
                                    {getTotalUnits(selectedFloor)}
                                </span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={createNewFloor}
                                icon={<HiPlus />}
                                size="sm"
                                color="green"
                                variant="solid"
                                disabled={getTotalFloors() == maxFloor}
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
                                Delete Last Floor
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

                        <Button
                            onClick={handleSubmit}
                            loading={apiLoading}
                            className="w-full"
                            size="sm"
                            variant="solid"
                        >
                            {editing ? 'Submit Changes' : 'Submit New Entry'}
                        </Button>
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

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                icon={<HiPlus />}
                                size="sm"
                                color="green"
                                variant="solid"
                                className="col-span-1 w-full"
                                onClick={() =>
                                    createNewUnit(
                                        `floor_${selectedFloor}`,
                                        `unit_${
                                            getLastUnitKeyByFloor(
                                                `floor_${selectedFloor}`
                                            ) + 1
                                        }`
                                    )
                                }
                                disabled={
                                    getTotalUnitsByFloor(
                                        `floor_${selectedFloor}`
                                    ) == 4
                                }
                            >
                                Add Unit
                            </Button>

                            <Button
                                icon={<HiMinus />}
                                size="sm"
                                color="red"
                                variant="solid"
                                className="col-span-1 w-full"
                                onClick={() =>
                                    deleteUnit(
                                        `floor_${selectedFloor}`,
                                        `unit_${getLastUnitKeyByFloor(
                                            `floor_${selectedFloor}`
                                        )}`
                                    )
                                }
                                disabled={
                                    getTotalUnitsByFloor(
                                        `floor_${selectedFloor}`
                                    ) == 0
                                }
                            >
                                Delete Last Unit
                            </Button>
                        </div>

                        <Button
                            onClick={handleSave}
                            size="sm"
                            variant="solid"
                            className="w-full"
                            disabled={!unsavedChanges}
                        >
                            Save
                        </Button>

                        <Button
                            onClick={handleBack}
                            size="sm"
                            color={unsavedChanges ? 'yellow' : themeColor}
                            variant="solid"
                            className="w-full"
                        >
                            {unsavedChanges
                                ? 'Back without Saving'
                                : 'Back Safely'}
                        </Button>
                    </>
                )}
            </div>
        </section>
    )
}
