import AdaptableCard from '@/components/shared/AdaptableCard'
import { useState } from 'react'

import RequestsTable from './components/RequestTable'

const RequestsList = () => {
    const [dataCount, setDataCount] = useState(0)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">
                    All Requests List ( {dataCount} )
                </h3>
            </div>
            <RequestsTable setCount={setDataCount} />
            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default RequestsList
