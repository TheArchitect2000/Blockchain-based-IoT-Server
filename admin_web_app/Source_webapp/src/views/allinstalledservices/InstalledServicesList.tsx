import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTableTools from './components/ProductTableTools'
import { useGetDevices } from '@/utils/hooks/useGetDevices'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Loading } from '@/components/shared'
import { useEffect, useState } from 'react'

import InstalledServicesTable from './components/InstalledServicesTable'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    const [dataCount, setDataCount] = useState(0)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">All Installed Services List ( { dataCount } )</h3>
            </div>
            <InstalledServicesTable setCount={setDataCount} />
            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default ProductList
