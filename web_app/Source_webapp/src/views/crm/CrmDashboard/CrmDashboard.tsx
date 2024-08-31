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
import { useGetSharedDevices } from '@/utils/hooks/useGetDevices'
import { generateParisData } from '@/components/map/ParisDeviceGen'

injectReducer('crmDashboard', reducer)

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
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

    const { devices } = useGetSharedDevices()
    const [mapLoading, setMapLoading] = useState(true)
    const [positions, setPositions] = useState<
        [number, number, number, number, string][]
    >([])

    useEffect(() => {
        if (devices?.data.data) {
            const newPositions: [number, number, number, number, string][] =
                devices.data.data
                    .filter((item) => item.location.coordinates)
                    .map(
                        (item: any) =>
                            [
                                ...item.location.coordinates,
                                (item.lastLog &&
                                    item.lastLog?.data?.Temperature) ||
                                    null,
                                (item.lastLog &&
                                    item.lastLog?.data?.Humidity) ||
                                    null,
                                String(item.nodeId),
                            ] as [number, number, number, number, string]
                    )

            setPositions([...newPositions, ...generateParisData(500, 500)])
            setMapLoading(false)
        }
    }, [devices])

    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={false}>
                <Statistic />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <EmailSent className="xl:col-span-1" data={emailSentData} />

                    <ServiceTable />
                </div>

                <MapComponent positions={positions} loading={mapLoading} />

                {/* <Leads data={recentLeadsData} /> */}
            </Loading>
        </div>
    )
}

export default CrmDashboard
