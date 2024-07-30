import AdaptableCard from '@/components/shared/AdaptableCard'
import { useState } from 'react'

import RequestsTable from './components/RequestTable'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'
import { Loading } from '@/components/shared'

const RequestsList = () => {
    const [dataCount, setDataCount] = useState(0)
    const navigateTo = useNavigate()
    const { loading, result } = useCheckPage('request')
    if (loading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {(loading == false && (
                <>
                    <div className="lg:flex items-center justify-between mb-4">
                        <h3 className="mb-4 lg:mb-0">
                            All Requests List ( {dataCount} )
                        </h3>
                    </div>
                    <RequestsTable setCount={setDataCount} />{' '}
                </>
            )) || <Loading loading={true} />}

            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default RequestsList
