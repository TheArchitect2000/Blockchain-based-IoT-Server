import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer, FormItem } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import {
    HiGlobeAlt,
    HiHashtag,
    HiHome,
    HiPencil,
    HiPencilAlt,
} from 'react-icons/hi'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { apiEditUserProfile, apiGetMyProfile } from '@/services/UserApi'
import CountrySelector from './CountrySelector'
import { Button } from '@/components/ui'
import { Loading } from '@/components/shared'
import { useAppSelector } from '@/store'

type AddressFormModel = {
    line_1: string
    line_2?: string
    country: string
    city: string
    state: string
    zipCode: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Home name is required'),
    line_1: Yup.string().required('Line 1 is required'),
    line_2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip Code is required'),
})

const Address = () => {
    const [apiData, setApiData] = useState<any>()
    const [selectedCountry, setSelectedCountry] = useState<any>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const resData = (await apiGetMyProfile()) as any
            const datas = resData.data.data
            setApiData(datas)
            if (datas?.address?.country) {
                setSelectedCountry({
                    label: datas.address.country,
                    value: datas.address.country,
                })
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const { _id: userId } = useAppSelector((state) => state.auth.user)

    const onFormSubmit = async (
        values: AddressFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        const dbDatas = {
            ...apiData,
            address: { ...values, country: selectedCountry.label },
        }
        const res = await apiEditUserProfile(userId?.toString() || '', dbDatas)
        toast.push(<Notification title={'Address updated'} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
        console.log('values', dbDatas)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={
                apiData?.address || {
                    name: '',
                    line_1: '',
                    line_2: '',
                    country: '',
                    city: '',
                    state: '',
                    zipCode: '',
                }
            }
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onFormSubmit(values, setSubmitting)
            }}
        >
            {({ touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        {(loading == false && (
                            <FormContainer>
                                {/* <FormDesription
                                    className=""
                                    title="Personal"
                                    desc=""
                                /> */}
                                <FormRow
                                    name="name"
                                    label="Location Name"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Enter location name"
                                        component={Input}
                                        prefix={
                                            <HiHashtag className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="line_1"
                                    label="Address Line 1"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="line_1"
                                        placeholder="Street address, P.O. box, company name, c/o"
                                        component={Input}
                                        prefix={
                                            <HiPencilAlt className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="line_2"
                                    label="Address Line 2 (optional)"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="line_2"
                                        placeholder="Apartment, suite, unit, building, floor, etc."
                                        component={Input}
                                        prefix={<HiHome className="text-xl" />}
                                    />
                                </FormRow>
                                <FormRow
                                    name="country"
                                    label="Country"
                                    {...validatorProps}
                                >
                                    <Field
                                        readOnly
                                        type="text"
                                        autoComplete="off"
                                        name="country"
                                        placeholder="Country"
                                        component={CountrySelector}
                                        selectedCountry={selectedCountry}
                                        setSelectedCountry={setSelectedCountry}
                                    />
                                </FormRow>
                                <FormRow
                                    name="city"
                                    label="City"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="city"
                                        placeholder="City"
                                        component={Input}
                                        prefix={
                                            <HiGlobeAlt className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="state"
                                    label="State/Province/Region"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        name="state"
                                        placeholder="State/Province/Region"
                                        component={Input}
                                        prefix={
                                            <HiGlobeAlt className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="zipCode"
                                    label="Zip Code"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="zipCode"
                                        placeholder="Zip Code"
                                        component={Input}
                                        prefix={
                                            <HiPencil className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <div className="flex gap-3 mt-4 justify-end ltr:text-right">
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting ? 'Updating' : 'Update'}
                                    </Button>
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                            resetForm()
                                            setSelectedCountry(null)
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </FormContainer>
                        )) || (
                            <div className="w-full h-[60dvh]">
                                <Loading loading={true} />
                            </div>
                        )}
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Address
