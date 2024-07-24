import { useEffect } from 'react'
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
import { useGetServices } from '@/utils/hooks/useGetServices'
import ServiceTable from './components/ServiceTable'

injectReducer('crmDashboard', reducer)

//mock data

const leadByRegionDataMock = [
    {
        name: 'Canada',
        value: "#1",
    },
    {
        name: 'United States of America',
        value: "#2",
    },
    {
        name: 'France',
        value: "#3",
    },
    {
        name: 'Hong Kong',
        value: "#4",
    },
    {
        name: 'United Arab Emirates',
        value: "#5",
    },
    {
        name: 'Germany',
        value: "#6",
    },
]

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

    //TODO:
    return (
        <div className="flex flex-col gap-4 h-full">
            <Loading loading={false}>
                <Statistic />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <EmailSent className="xl:col-span-1" data={emailSentData} />

                    <ServiceTable />
                </div>

                <LeadByCountries
                    className="xl:col-span-5"
                    data={leadByRegionDataMock}
                />
                {/* <Leads data={recentLeadsData} /> */}
            </Loading>
        </div>
    )
}

export default CrmDashboard
