export const generateParisData = (
    numDevices: number,
    gridSize: number
): {}[] => {
    const latMin = 43.815 // Minimum latitude for Paris
    const latMax = 49 // Maximum latitude for Paris
    const lonMin = 0 // Minimum longitude for Paris
    const lonMax = 6 // Maximum longitude for Paris

    // Calculate grid cell dimensions
    const latStep = (latMax - latMin) / gridSize
    const lonStep = (lonMax - lonMin) / gridSize

    const data: {}[] = []

    // To avoid overfilling cells and to ensure dispersion
    const usedCells = new Set<string>()

    const getCellId = (latIndex: number, lonIndex: number) =>
        `${latIndex}-${lonIndex}`

    for (let i = 0; i < numDevices; i++) {
        // Ensure unique cell usage
        let cellX: number, cellY: number, cellId: string
        do {
            cellX = Math.floor(Math.random() * gridSize)
            cellY = Math.floor(Math.random() * gridSize)
            cellId = getCellId(cellX, cellY)
        } while (usedCells.has(cellId) && usedCells.size < gridSize * gridSize)

        usedCells.add(cellId)

        // Calculate cell boundaries
        const cellLatMin = latMin + cellX * latStep
        const cellLatMax = cellLatMin + latStep
        const cellLonMin = lonMin + cellY * lonStep
        const cellLonMax = cellLonMin + lonStep

        // Randomly place device within cell with some offset for better distribution
        const lat = cellLatMin + Math.random() * (latStep - latStep * 0.1)
        const lon = cellLonMin + Math.random() * (lonStep - lonStep * 0.1)

        // Add a slight random offset to ensure more varied positioning
        const offsetLat = (Math.random() - 0.5) * (latStep * 0.05)
        const offsetLon = (Math.random() - 0.5) * (lonStep * 0.05)

        const finalLat = Math.min(Math.max(lat + offsetLat, latMin), latMax)
        const finalLon = Math.min(Math.max(lon + offsetLon, lonMin), lonMax)

        // Random temperature and humidity
        const temperature = 15 + Math.random() * 10 // Temperature between 15 and 25
        const humidity = 50 + Math.random() * 20 // Humidity between 50 and 70

        /* deviceEncryptedId: 'QTA6NzY6NEU6NTg6MUI6QzQ='
        deviceName: 'NewDevice433'
        deviceType: 'E-CARD'
        firmwareVersion: 0
        geometry: null
        hardwareVersion: 0
        insertDate: '2025-01-12T08:15:18.004Z'
        insertedBy: '65f1b32649e1750d2c4b470d'
        location: {
            coordinates: Array(2)
        }
        mac: 'A0:76:4E:58:1B:C4'
        nodeDeviceId: '67820fd2c06cec117e1c3549'
        nodeId: 'zksensor.tech'
        _id: '67837a160e3cb5f5b94801fe' */

        data.push({
            location: {
                coordinates: [finalLat, finalLon],
            },
            nodeId: 'Sample',
        })
    }

    return data
}
