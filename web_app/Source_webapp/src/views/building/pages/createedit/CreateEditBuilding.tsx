import { Button, Dropdown, Input, Notification, toast } from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './style.css'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { useGetDevices } from '@/utils/hooks/useGetDevices'
import { Loading } from '@/components/shared'
import { useAppSelector } from '@/store'
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
    const [buildData, setBuildData] = useState<any>({
        name: 'Apartment 1',
        details: {
            floor_1: {
                name: 'Floor 1',
                units: {
                    unit_1: {
                        name: 'Unit 1',
                        device: '',
                    },
                },
            },
        },
    })
    const [apiLoading, setApiLoading] = useState(false)
    const [mainLoading, setMainLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const { type } = useParams<{ type: string }>()
    const { status, devices } = useGetDevices()
    const deviceLoading = status === 'pending'
    const deviceDatas = devices?.data.data as Array<DeviceDatas>
    const navigateTo = useNavigate()

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
        const floorCount = Object.keys(buildData.details).length + 1
        const newFloorKey = `floor_${floorCount}`
        const newFloor = {
            name: `Floor ${floorCount}`,
            units: {
                unit_1: {
                    name: 'Unit 1',
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
    }

    const deleteFloor = (floorKey: string) => {
        setBuildData((prevData: any) => {
            const updatedDetails = { ...prevData.details }
            const units = updatedDetails[floorKey].units
            for (const unitKey in units) {
                delete units[unitKey]
            }
            delete updatedDetails[floorKey]
            return {
                ...prevData,
                details: updatedDetails,
            }
        })
    }

    const createNewUnit = (floorKey: string) => {
        setBuildData((prevData: any) => {
            const floor = prevData.details[floorKey]
            if (!floor) return prevData

            const unitCount = Object.keys(floor.units).length + 1
            const newUnitKey = `unit_${unitCount}`
            const newUnit = {
                name: 'Unit ' + unitCount,
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

    const floorEntries = Object.entries(buildData.details).sort().reverse()
    const lastFloorKey = floorEntries[0]?.[0]

    if (deviceLoading == true || mainLoading == true) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-4 w-full">
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
                    onClick={() => {
                        console.log(buildData)
                        console.log(deviceDatas)
                    }}
                >
                    Log
                </Button> */}
            </div>
            <div className="flex w-full">
                <div className="flex flex-row">
                    <div className="flex flex-col flex-1 items-center border-r border-black p-4">
                        <Button
                            size="md"
                            className="mb-4"
                            onClick={createNewFloor}
                            loading={apiLoading}
                        >
                            Add New Floor
                        </Button>
                        {floorEntries?.map(([floorKey, floor]: any) => {
                            // Add reverse() here to render new floors at the top
                            return (
                                <div key={floorKey} className="mb-4">
                                    <div className="flex items-center">
                                        <div className="flex flex-col rounded-xl items-center gap-4 mr-4 p-4 border border-black flex-grow">
                                            <p className="text-lg">
                                                <strong>
                                                    {utils.formatBuildingStrings(
                                                        floorKey
                                                    )}
                                                </strong>
                                            </p>
                                            <Input
                                                placeholder="Name"
                                                type="text"
                                                value={floor.name}
                                                disabled={apiLoading}
                                                onChange={(e) =>
                                                    handleFloorNameChange(
                                                        floorKey,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {floorKey === lastFloorKey && (
                                                <Button
                                                    color="red"
                                                    variant="solid"
                                                    className="!px-6"
                                                    size="sm"
                                                    loading={apiLoading}
                                                    onClick={() =>
                                                        deleteFloor(floorKey)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex-2 p-4">
                        {floorEntries?.map(([floorKey, floor]: any) => {
                            const unitKeys = Object.keys(floor.units)

                            return (
                                <div key={floorKey} className="mb-8">
                                    <h3 className="mb-4 text-lg font-semibold">
                                        {utils.formatBuildingStrings(floorKey)}
                                    </h3>
                                    <div className="w-full flex flex-wrap gap-4">
                                        {unitKeys?.map((unitKey, index) => {
                                            const unit = floor.units[unitKey]
                                            const isLastUnit =
                                                index === unitKeys.length - 1
                                            const availableDevices =
                                                getAvailableDevices(unit.device)
                                            return (
                                                <div
                                                    key={unitKey}
                                                    className="flex flex-col rounded-xl gap-3 items-center mb-4 p-4 border border-black flex-2"
                                                >
                                                    <h3>
                                                        {utils.formatBuildingStrings(
                                                            unitKey
                                                        )}
                                                    </h3>
                                                    <Input
                                                        disabled={apiLoading}
                                                        type="text"
                                                        value={unit.name}
                                                        onChange={(e) =>
                                                            handleUnitChange(
                                                                floorKey,
                                                                unitKey,
                                                                'name',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Name"
                                                    />
                                                    <Dropdown
                                                        trigger="click"
                                                        toggleClassName={`rounded-lg px-6 py-2 text-white bg-${themeColor}-${primaryColorLevel}`}
                                                        placement="middle-start-top"
                                                        disabled={apiLoading}
                                                        title={
                                                            (unit.device &&
                                                                `${getDeviceNameById(
                                                                    unit.device
                                                                )}`) ||
                                                            `Select Device`
                                                        }
                                                        activeKey={unit.device}
                                                        onSelect={(eventKey) =>
                                                            handleDeviceSelect(
                                                                floorKey,
                                                                unitKey,
                                                                eventKey as string
                                                            )
                                                        }
                                                    >
                                                        <Dropdown.Item eventKey="">
                                                            Unselect Device
                                                        </Dropdown.Item>
                                                        {availableDevices?.map(
                                                            (item) => {
                                                                return (
                                                                    <Dropdown.Item
                                                                        eventKey={
                                                                            item.deviceEncryptedId
                                                                        }
                                                                    >
                                                                        {
                                                                            item.deviceName
                                                                        }{' '}
                                                                        (
                                                                        {
                                                                            item.mac
                                                                        }
                                                                        )
                                                                    </Dropdown.Item>
                                                                )
                                                            }
                                                        )}
                                                    </Dropdown>

                                                    {/* <Input
                                                        type="text"
                                                        value={unit.device}
                                                        onChange={(e) =>
                                                            handleUnitChange(
                                                                floorKey,
                                                                unitKey,
                                                                'device',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Device"
                                                    /> */}
                                                    {isLastUnit && (
                                                        <Button
                                                            variant="plain"
                                                            loading={apiLoading}
                                                            onClick={() =>
                                                                deleteUnit(
                                                                    floorKey,
                                                                    unitKey
                                                                )
                                                            }
                                                        >
                                                            <HiTrash className="text-2xl text-red-500" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        <button
                                            disabled={apiLoading}
                                            className="flex-2 p-4 rounded-xl"
                                            onClick={() =>
                                                createNewUnit(floorKey)
                                            }
                                        >
                                            <HiPlus className="text-3xl font-bold mx-12" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
