import {
    Avatar,
    Button,
    Upload,
    Input,
    Select,
    FormContainer,
    toast,
    Notification,
} from '@/components/ui'

import FormRow from '@/views/account/Settings/components/FormRow'
import { Field, Form, Formik, FieldProps } from 'formik'
import { HiCheck, HiOutlineUserCircle, HiServer } from 'react-icons/hi'
import * as Yup from 'yup'
import { components } from 'react-select'
import type { OptionProps, ControlProps } from 'react-select'
import {
    apiCreateNewService,
    apiEditService,
    apiGetServiceByServiceId,
} from '@/services/ServiceAPI'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { apiUploadMedia } from '@/services/MediaAPI'
import { Loading } from '@/components/shared'

type ServiceTypeOption = {
    value: string
    label: string
}
const serviceOptions: ServiceTypeOption[] = [
    { value: 'automation', label: 'Automation' },
]

export type ServiceFormModel = {
    serviceName: string
    serviceType: string
    description: string
    serviceImage: string
    userId: string
}

type ServiceProps = {
    data?: ServiceFormModel
    userId?: any
}

const { Control } = components

const CustomControl = ({
    children,
    ...props
}: ControlProps<ServiceTypeOption>) => {
    const selected = props.getValue()[0]
    return <Control {...props}>{children}</Control>
}

const validationSchema = Yup.object().shape({
    serviceName: Yup.string().required(),
    serviceType: Yup.string().required(),
    description: Yup.string().required(),
    serviceImage: Yup.string(),
})

const CustomSelectOption = ({
    innerProps,
    label,
    isSelected,
}: OptionProps<ServiceTypeOption>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const createService = ({
    userId = useAppSelector((state) => state.auth.user),
}: ServiceProps) => {
    const navigate = useNavigate()
    const { serviceId } = useParams()
    const [isNew, setIsNew] = useState(false)
    const [pageLoaded, setPageLoaded] = useState(false)
    const [imageFile, setImageFile] = useState()
    const [imageSrc, setImageSrc] = useState('')
    const [data, setData] = useState<ServiceFormModel>({
        userId: userId._id,
        serviceName: '',
        serviceType: '',
        description: '',
        serviceImage: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const datas = (await apiGetServiceByServiceId(
                    serviceId || ''
                )) as any

                const result = datas?.data?.data

                if (result.userId != userId._id) {
                    return navigate('/services')
                }

                if (result) {
                    setData((prevData) => ({
                        ...prevData,
                        serviceName: result.serviceName,
                        serviceType: result.serviceType,
                        description: result.description,
                        serviceImage: result.serviceImage || '',
                    }))
                    if (result.serviceImage) {
                        setImageSrc(result.serviceImage)
                    }
                    setPageLoaded(true)
                } else {
                    return navigate('/services')
                }
            } catch (error) {
                setPageLoaded(true)
                console.error('Error fetching data:', error)
            }
        }

        if (serviceId == 'new') {
            setIsNew(true)
            setData({
                userId: userId._id,
                serviceName: '',
                serviceType: '',
                description: '',
                serviceImage: '',
            })
            setPageLoaded(true)
        } else {
            fetchData()
        }
    }, [serviceId])

    const onFormSubmit = (
        values: ServiceFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        if (isNew) {
            async function createService() {
                try {
                    const uploadData = new FormData()
                    uploadData.append('file', imageFile as any)

                    const result = imageFile
                        ? ((await apiUploadMedia('profile', uploadData)) as any)
                        : ''

                    const res = await apiCreateNewService({
                        ...values,
                        serviceImage: result?.data?.data?.url || '',
                    })
                    if (res) {
                        toast.push(
                            <Notification
                                title={'Service Created'}
                                type="success"
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                        setSubmitting(false)
                        navigate('/services')
                        setTimeout(() => {
                            //window.location.reload()
                        }, 500)
                    }
                } catch (error: any) {
                    setSubmitting(false)
                    toast.push(
                        <Notification title={error.message} type="danger" />,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            }
            createService()
        } else {
            async function editService() {
                try {
                    const uploadData = new FormData()
                    uploadData.append('file', imageFile as any)

                    const result = imageFile
                        ? ((await apiUploadMedia('profile', uploadData)) as any)
                        : ''

                    const res = (await apiEditService({
                        ...values,
                        serviceId: serviceId,
                        serviceImage:
                            result?.data?.data?.url || data.serviceImage,
                    })) as any
                    setSubmitting(false)
                    if (res?.data?.data?.success === false) {
                        toast.push(
                            <Notification
                                title={'Error while editing service'}
                                type="danger"
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                    } else {
                        toast.push(
                            <Notification
                                title={'Service Edited'}
                                type="success"
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                        navigate('/services')
                    }
                } catch (error: any) {
                    toast.push(
                        <Notification title={error.message} type="danger" />,
                        {
                            placement: 'top-center',
                        }
                    )
                    setSubmitting(false)
                }
            }
            editService()
        }
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0]
        if (
            file &&
            (file.type === 'image/png' ||
                file.type === 'image/jpeg' ||
                file.type === 'image/jpg')
        ) {
            const MAX_SIZE = 5 * 100 * 1024 // 500KB in bytes
            if (file.size > MAX_SIZE) {
                alert('Please upload a file smaller than 500KB.')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    const imageSrc = e.target.result as string

                    // Create an image to get its dimensions
                    const img = new Image()

                    img.src = imageSrc

                    img.onload = () => {
                        const width = img.width
                        const height = img.height

                        if (width <= 300 && height <= 175) {
                            setImageFile(file)
                            setImageSrc(imageSrc)
                        } else {
                            alert(
                                'Please upload a valid image file with dimensions 300 x 175 pixels.'
                            )
                        }
                    }
                }
            }
            reader.readAsDataURL(file)
        } else {
            alert('Please upload a valid ( PNG, JPEG, JPG ) file.')
        }
    }

    return (
        <>
            {(pageLoaded && (
                <main className="w-100 h-full flex flex-col">
                    {(isNew && <h3>Create Service Contract</h3>) || (
                        <h3>Edit Service Contract</h3>
                    )}
                    <Formik
                        enableReinitialize
                        initialValues={data}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true)
                            setTimeout(() => {
                                onFormSubmit(values, setSubmitting)
                            }, 1000)
                        }}
                    >
                        {({
                            values,
                            touched,
                            errors,
                            isSubmitting,
                            resetForm,
                        }) => {
                            const validatorProps = { touched, errors }
                            return (
                                <Form>
                                    <FormContainer>
                                        <FormRow
                                            name="serviceName"
                                            label="Name"
                                            {...validatorProps}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="serviceName"
                                                placeholder="service name..."
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="serviceType"
                                            label="Type"
                                            {...validatorProps}
                                        >
                                            <Field name="serviceType">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select<ServiceTypeOption>
                                                        field={field}
                                                        placeholder="select service type..."
                                                        form={form}
                                                        options={serviceOptions}
                                                        components={{
                                                            Option: CustomSelectOption,
                                                            Control:
                                                                CustomControl,
                                                        }}
                                                        value={serviceOptions.filter(
                                                            (option) =>
                                                                option.value ===
                                                                values?.serviceType
                                                        )}
                                                        onChange={(option) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                option?.value
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormRow>
                                        <FormRow
                                            name="description"
                                            label="Description"
                                            {...validatorProps}
                                        >
                                            <Field
                                                textArea={true}
                                                type="text"
                                                autoComplete="off"
                                                name="description"
                                                placeholder="service description..."
                                                component={Input}
                                            />
                                        </FormRow>
                                        <FormRow
                                            name="serviceImage"
                                            label="Image"
                                            {...validatorProps}
                                        >
                                            <div
                                                className={`flex w-full items-center ${
                                                    (imageSrc &&
                                                        'justify-around') ||
                                                    'gap-10'
                                                }`}
                                            >
                                                <Field name="serviceImage">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => {
                                                        const avatarProps =
                                                            field.value
                                                                ? {
                                                                      src: field.value,
                                                                  }
                                                                : {}
                                                        return (
                                                            <Upload
                                                                className="cursor-pointer"
                                                                showList={false}
                                                                uploadLimit={1}
                                                                accept=".png, .jpg, .jpeg"
                                                                onChange={
                                                                    handleFileChange
                                                                }
                                                            >
                                                                {(!imageSrc && (
                                                                    <Avatar
                                                                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                                                                        size={
                                                                            60
                                                                        }
                                                                        shape="circle"
                                                                        icon={
                                                                            <HiServer />
                                                                        }
                                                                        {...avatarProps}
                                                                    />
                                                                )) || (
                                                                    <img
                                                                        src={
                                                                            imageSrc
                                                                        } // Assuming imageFile is replaced by imageSrc for handling images
                                                                        alt="Uploaded Service Image"
                                                                        style={{
                                                                            width: '300px',
                                                                            height: '175px',
                                                                        }}
                                                                    />
                                                                )}
                                                            </Upload>
                                                        )
                                                    }}
                                                </Field>
                                                <p>
                                                    <strong>
                                                        Image Upload
                                                        Requirements:
                                                    </strong>
                                                    <br />
                                                    <strong>
                                                        &nbsp;&nbsp;- Format:
                                                    </strong>{' '}
                                                    PNG, JPEG, JPG
                                                    <br />
                                                    <strong>
                                                        &nbsp;&nbsp;- Size:
                                                    </strong>{' '}
                                                    300x175 Pixels Maximum
                                                    <br />
                                                    <strong>
                                                        &nbsp;&nbsp;- File size:
                                                    </strong>{' '}
                                                    500 KB
                                                </p>
                                            </div>
                                        </FormRow>

                                        <div className="mt-4 ltr:text-right flex justify-end">
                                            {(isNew && (
                                                <Button
                                                    size="sm"
                                                    className="max-sm:w-full"
                                                    variant="solid"
                                                    loading={isSubmitting}
                                                    type="submit"
                                                >
                                                    {isSubmitting
                                                        ? 'Creating'
                                                        : 'Create'}
                                                </Button>
                                            )) || (
                                                <Button
                                                    size="sm"
                                                    className="max-sm:w-full"
                                                    variant="solid"
                                                    loading={isSubmitting}
                                                    type="submit"
                                                >
                                                    {isSubmitting
                                                        ? 'Editing'
                                                        : 'Edit'}
                                                </Button>
                                            )}
                                        </div>
                                    </FormContainer>
                                </Form>
                            )
                        }}
                    </Formik>
                </main>
            )) || (
                <main className="w-100 h-full flex flex-col">
                    <Loading loading={true} />
                </main>
            )}
        </>
    )
}

export default createService
