import { useEffect, useState } from 'react'
import reducer, {
    getCrmDashboardData,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store/'

import Loading from '@/components/shared/Loading'
import Statistic from './components/Statistic'
import LeadByCountries from './components/LeadByCountries'
import EmailSent from './components/UserRatio'
import Leads from './components/Leads'
import ServiceTable from './components/ServiceTable'
import MapComponent from '@/components/map/MapComponent'
import { DeviceData, useGetSharedDevices } from '@/utils/hooks/useGetDevices'
import { generateParisData } from '@/components/map/ParisDeviceGen'
import { apiGetAllSharedDevices } from '@/services/DeviceApi'

injectReducer('crmDashboard', reducer)

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

function isValidCoordinate(coord: any[]): coord is [number, number] {
    return (
        Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number' &&
        !isNaN(coord[0]) &&
        !isNaN(coord[1])
    )
}

const CrmDashboard = () => {
    const dispatch = useAppDispatch()

    const { statisticData, leadByRegionData, recentLeadsData, emailSentData } =
        useAppSelector((state) => state.crmDashboard.data.dashboardData)
    const loading = useAppSelector((state) => state.crmDashboard.data.loading)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getCrmDashboardData())
    }

    const [mapLoading, setMapLoading] = useState(true)
    const [positions, setPositions] = useState<any>([])

    useEffect(() => {
        async function fetchDeviceDatas() {
            setMapLoading(true)
            const res = (await apiGetAllSharedDevices()) as any
            if (res?.data.data) {
                const newPositions: DeviceData[] = res.data.data.filter(
                    (item: DeviceData) =>
                        isValidCoordinate(item?.location?.coordinates)
                )

                console.log('newPositions:', newPositions)

                setPositions([...newPositions, ...generateParisData(200, 200)])
                setMapLoading(false)
            }
        }
        fetchDeviceDatas()
    }, [])

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={false}>
                <Statistic />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <EmailSent
                        className="col-span-2 xl:col-span-1"
                        data={emailSentData}
                    />

                    <ServiceTable />
                </div>

                <MapComponent positions={positions} loading={mapLoading} />

                {/* <Leads data={recentLeadsData} /> */}
            </Loading>
        </div>
    )
}

export default CrmDashboard
