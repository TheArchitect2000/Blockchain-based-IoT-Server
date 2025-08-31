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

    const [positions, setPositions] = useState<
        [number, number, number, number][]
    >([])

    useEffect(() => {
        if (devices?.data.data) {
            const newPositions: [number, number, number, number][] =
                devices.data.data
                    .filter(
                        (item) =>
                            Array.isArray(item.location.coordinates) &&
                            item.location.coordinates.length === 2 &&
                            typeof item.location.coordinates[0] === 'number' &&
                            typeof item.location.coordinates[1] === 'number' &&
                            item.location.coordinates[0] !== null &&
                            item.location.coordinates[1] !== null
                    )
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
                            ] as [number, number, number, number]
                    )
            setPositions(newPositions)
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

                <MapComponent positions={positions} />

                {/* <Leads data={recentLeadsData} /> */}
            </Loading>
        </div>
    )
}

export default CrmDashboard
