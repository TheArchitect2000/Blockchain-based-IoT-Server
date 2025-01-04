type Unit = {
    name: string
    device: string
}

type Floor = {
    name: string
    units: Record<string, Unit>
}

type Details = Record<string, Floor>

interface Building {
    _id: string
    name: string
    details: Details
    createdBy: string
    insertDate: string
    updateDate: string
    __v: number
}

interface CountResult {
    floorCount: number
    unitCount: number
    deviceCount: number
}

function sliceBuildingStrings(input: string) {
    let formatted = input.replace('_', ' ')
    const slices = formatted
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    return slices
}

function formatBuildingStrings(input: string) {
    let formatted = input.replace('_', ' ')
    formatted = formatted
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    return formatted
}

function countBuildingDetails(building: Building): CountResult {
    let floorCount = 0
    let unitCount = 0
    let deviceCount = 0

    const floors = Object.keys(building.details)
    floorCount = floors.length

    floors?.forEach((floorKey) => {
        const floor = building.details[floorKey]
        if (floor.units) {
            const units = Object.keys(floor?.units)
            unitCount += units.length || 0

            units?.forEach((unitKey) => {
                const unit = floor.units[unitKey]
                if (unit.device) {
                    deviceCount += 1
                }
            })
        }
    })

    return { floorCount, unitCount, deviceCount }
}

export default {
    formatBuildingStrings,
    countBuildingDetails,
    sliceBuildingStrings,
}
