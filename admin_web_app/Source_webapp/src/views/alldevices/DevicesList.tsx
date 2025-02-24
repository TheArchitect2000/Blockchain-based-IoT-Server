import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { Loading } from '@/components/shared'
import { useState } from 'react'
import DevicesTable from './components/DeviceTable'
import { useCheckPage } from '../security/CheckPage'
import { useNavigate } from 'react-router-dom'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    const [dataCount, setDataCount] = useState(0)
    const navigateTo = useNavigate()
    const { loading, result } = useCheckPage('device')
    const { loading: roleLoading, result: superResult } = useCheckPage('super')
    if (loading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }

    return (
        <AdaptableCard className="h-full p-6" bodyClass="h-full">
            {(loading == false && roleLoading == false && (
                <>
                    <div className="lg:flex items-center justify-between mb-4">
                        <h3 className="mb-4 lg:mb-0">
                            All Devices List ( {dataCount} )
                        </h3>
                    </div>
                    <DevicesTable superAdmin={superResult} setCount={setDataCount} />
                </>
            )) || <Loading loading={true} />}

            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default ProductList
