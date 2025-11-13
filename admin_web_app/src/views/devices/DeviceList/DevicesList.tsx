import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProductTable from './components/ProductTable'
import ProductTableTools from './components/ProductTableTools'
import { useGetDevices } from '@/utils/hooks/useGetDevices'
import DeviceTable from './components/DeviceTable'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Loading } from '@/components/shared'

injectReducer('salesProductList', reducer)

const ProductList = () => {
    const { status } = useGetDevices()
    const loading = status !== 'success'

    if (loading) return <Loading loading={loading} />
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Device List</h3>
                <ProductTableTools />
            </div>
            <DeviceTable />
            {/* <ProductTable /> */}
        </AdaptableCard>
    )
}

export default ProductList
