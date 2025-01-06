import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import {
    HiDatabase,
    HiGlobeAlt,
    HiHashtag,
    HiHome,
    HiInbox,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiPencil,
    HiPencilAlt,
    HiUser,
    HiUsers,
} from 'react-icons/hi'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { apiEditUserProfile, apiGetCurUserProfile } from '@/services/UserApi'
import { Button } from '@/components/ui'
import { Loading } from '@/components/shared'
import { useAppSelector } from '@/store'
import FormDesription from '../FormDesription'
import FormRow from '../FormRow'
import CountrySelector from '../CountrySelector'
import { useRoleStore } from '@/store/user/userRoleStore'

type AddressFormModel = {
    line_1: string
    line_2?: string
    country: string
    city: string
    state: string
    zipCode: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Company name is required'),
    line_1: Yup.string().required('Line 1 is required'),
    line_2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip Code is required'),
})

export default function CompanyDeveloperPage() {
    const [apiData, setApiData] = useState<any>()
    const [selectedCountry, setSelectedCountry] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const {
        checkUserHasRole,
        fetchUserRoles,
        loading: roleLoading,
    } = useRoleStore()

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            await fetchUserRoles()
            const resData = (await apiGetCurUserProfile()) as any
            const datas = resData.data.data
            setApiData(datas)
            if (datas?.company?.country) {
                setSelectedCountry({
                    label: datas.company.country,
                    value: datas.company.country,
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
        if (!selectedCountry?.label) {
            toast.push(
                <Notification
                    title={'You have to select the country'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                }
            )
            setSubmitting(false)
            return false
        }

        setSubmitting(true)
        const dbDatas = {
            ...apiData,
            company: { ...values, country: selectedCountry.label },
        }
        const res = await apiEditUserProfile(userId?.toString() || '', dbDatas)
        toast.push(<Notification title={'Address updated'} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
        console.log('values', dbDatas)
    }

    const isDeveloper = checkUserHasRole('company_developer')

    return (
        <Formik
            enableReinitialize
            initialValues={
                apiData?.company || {
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
                        {(!loading && !roleLoading && (
                            <FormContainer>
                                <FormDesription
                                    className=""
                                    title="IoT Developer"
                                    desc="Please fill out all the fields about your company."
                                />
                                <FormRow
                                    name="name"
                                    label={
                                        (
                                            <div className="flex items-center gap-2">
                                                <span>Name</span>
                                                <span>(</span>
                                                <p>
                                                    {!isDeveloper && 'Not'}{' '}
                                                    Verified
                                                </p>
                                                {(isDeveloper && (
                                                    <HiOutlineCheckCircle className="text-xl text-green-500" />
                                                )) || (
                                                    <HiOutlineXCircle className="text-xl text-red-500" />
                                                )}
                                                <span>)</span>
                                            </div>
                                        ) as any
                                    }
                                    {...validatorProps}
                                >
                                    <Field
                                        disabled={isDeveloper}
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Enter Company name"
                                        component={Input}
                                        prefix={<HiUser className="text-xl" />}
                                    />
                                </FormRow>

                                <FormRow
                                    name="line_1"
                                    label="Address line 1"
                                    {...validatorProps}
                                >
                                    <Field
                                        disabled={isDeveloper}
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
                                    label="Address line 2 (optional)"
                                    {...validatorProps}
                                >
                                    <Field
                                        disabled={isDeveloper}
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
                                        isDisabled={isDeveloper}
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
                                        disabled={isDeveloper}
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
                                        disabled={isDeveloper}
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
                                        disabled={isDeveloper}
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
                                <div className="flex gap-3 mt-4 ltr:text-right">
                                    <Button
                                        disabled={isDeveloper}
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting ? 'Updating' : 'Update'}
                                    </Button>
                                    <Button
                                        disabled={isDeveloper}
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
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
