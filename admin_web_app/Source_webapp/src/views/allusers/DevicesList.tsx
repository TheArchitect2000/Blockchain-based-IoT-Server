import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { useEffect, useState } from 'react'
import UsersTable from './components/UserTable'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'
import { Loading } from '@/components/shared'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    const [dataCount, setDataCount] = useState(0)
    const navigateTo = useNavigate()
    const { loading, result } = useCheckPage('user')
    if (loading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            {(loading == false && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="mb-4 lg:mb-0">
                            All Users List ( {dataCount} )
                        </h3>
                    </div>
                    <UsersTable setCount={setDataCount} />
                </>
            )) || <Loading loading={true} />}
            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default ProductList
