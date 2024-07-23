import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getProduct,
    updateProduct,
    deleteProduct,
    useAppSelector,
    useAppDispatch,
} from '../store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ProductForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/services/ServiceForm'
import isEmpty from 'lodash/isEmpty'
import { useGetServices } from '@/utils/hooks/useGetServices'

injectReducer('salesProductEdit', reducer)

const ServiceEdit = () => {
    const { services, status } = useGetServices()
    const loading = status !== 'success'
    const { serviceId } = useParams()
    const curService = services?.data.data.filter(
        (service) => service._id === serviceId
    )[0]

    console.log(curService)

    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    // const loading = useAppSelector(
    //     (state) => state.salesProductEdit.data.loading
    // )

    const fetchData = (data: { id: string }) => {
        dispatch(getProduct(data))
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await updateProduct(values)
        setSubmitting(false)
        if (success) {
            popNotification('updated')
        }
    }

    const handleDiscard = () => {
        navigate('/app/sales/product-list')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const success = await deleteProduct({ id: curService?._id })
        if (success) {
            popNotification('deleted')
        }
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Product successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/app/sales/product-list')
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <>
            <Loading loading={loading}>
                {!isEmpty(curService) && (
                    <>
                        <ProductForm
                            type="edit"
                            initialData={curService}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && !curService && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3 className="mt-8">No service found!</h3>
                </div>
            )}
        </>
    )
}

export default ServiceEdit
