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

    const [positions, setPositions] = useState<[number, number][]>([])

    useEffect(() => {
        if (devices?.data.data) {
            const newPositions = devices.data.data
                .filter((item) => item.location.coordinates)
                .map((item) => item.location.coordinates as [number, number])
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
