import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTableTools from './components/ProductTableTools'
import { useGetDevices } from '@/utils/hooks/useGetDevices'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Loading } from '@/components/shared'
import { useEffect, useState } from 'react'

import InstalledServicesTable from './components/InstalledServicesTable'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    const [dataCount, setDataCount] = useState(0)
    const navigateTo = useNavigate()
    const { loading, result } = useCheckPage('service')
    if (loading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }

    return (
        <AdaptableCard className="h-full p-6" bodyClass="h-full">
            {(loading == false && (
                <>
                    <div className="lg:flex items-center justify-between mb-4">
                        <h3 className="mb-4 lg:mb-0">
                            All Installed Services List ( {dataCount} )
                        </h3>
                    </div>
                    <InstalledServicesTable setCount={setDataCount} />
                </>
            )) || <Loading loading={true} />}
            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default ProductList
