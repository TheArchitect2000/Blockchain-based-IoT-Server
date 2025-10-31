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
    apiGetAllServices,
    apiGetService,
} from '@/services/ServiceAPI'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'

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
    serviceName: Yup.string(),
    serviceType: Yup.string(),
    description: Yup.string(),
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
    const [svgContent, setSvgContent] = useState('')
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
                const datas = (await apiGetAllServices()) as {
                    data: { data: any[] }
                }

                if (datas.data) {
                    const filteredService = datas.data.data.filter(
                        (item: any) => item._id == serviceId
                    )
                    if (filteredService.length > 0) {
                        setData((prevData) => ({
                            ...prevData,
                            serviceName: filteredService[0].serviceName,
                            serviceType: filteredService[0].serviceType,
                            description: filteredService[0].description,
                            serviceImage: filteredService[0].serviceImage || '',
                        }))
                        if (filteredService[0].serviceImage) {
                            setSvgContent(
                                filteredService[0].serviceImage.toString()
                            )
                        }
                    } else {
                        navigate('/services')
                    }
                }
            } catch (error) {
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
                    const res = await apiCreateNewService({
                        ...values,
                        serviceImage: svgContent.toString(),
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
                            window.location.reload()
                        }, 500)
                    }
                } catch (error) {
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
                    const res = await apiEditService({
                        ...values,
                        serviceId: serviceId,
                        serviceImage: svgContent.toString(),
                    })
                    if (res) {
                        toast.push(
                            <Notification
                                title={'Service Edited'}
                                type="success"
                            />,
                            {
                                placement: 'top-center',
                            }
                        )
                        setSubmitting(false)
                        navigate('/services')
                        setTimeout(() => {
                            window.location.reload()
                        }, 500)
                    }
                } catch (error) {
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
        if (file && file.type === 'image/svg+xml') {
            const MAX_SIZE = 300 * 1024 // 300KB in bytes
            if (file.size > MAX_SIZE) {
                alert('Please upload a file smaller than 100KB.')
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    const svgText = e.target.result as string
                    const parser = new DOMParser()
                    const svgDoc = parser.parseFromString(
                        svgText,
                        'image/svg+xml'
                    )
                    const svgElement = svgDoc.documentElement

                    const width = svgElement.getAttribute('width')
                    const height = svgElement.getAttribute('height')

                    if (parseInt(width!) <= 300 && parseInt(height!) <= 175) {
                        setSvgContent(svgText)
                    } else {
                        alert(
                            'Please upload a valid SVG file with dimensions 300 x 175 pixels.'
                        )
                    }
                }
            }
            reader.readAsText(file)
        } else {
            alert('Please upload a valid SVG file.')
        }
    }

    return (
        <main className="w-100 h-full flex flex-col">
            {(isNew && <h1>Create Service</h1>) || <h1>Edit Service</h1>}
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
                {({ values, touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormRow
                                    name="serviceName"
                                    label="Service Name :"
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
                                    label="Service Type :"
                                    {...validatorProps}
                                >
                                    <Field name="serviceType">
                                        {({ field, form }: FieldProps) => (
                                            <Select<ServiceTypeOption>
                                                field={field}
                                                placeholder="Select Service Type"
                                                form={form}
                                                options={serviceOptions}
                                                components={{
                                                    Option: CustomSelectOption,
                                                    Control: CustomControl,
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
                                    label="Service Description :"
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
                                    label="Service Image :"
                                    {...validatorProps}
                                >
                                    <div
                                        className={`flex w-full items-center ${
                                            (svgContent && 'justify-around') ||
                                            'gap-10'
                                        }`}
                                    >
                                        <Field name="serviceImage">
                                            {({ field, form }: FieldProps) => {
                                                const avatarProps = field.value
                                                    ? { src: field.value }
                                                    : {}
                                                return (
                                                    <Upload
                                                        className="cursor-pointer"
                                                        showList={false}
                                                        uploadLimit={1}
                                                        accept=".svg"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                    >
                                                        {(!svgContent && (
                                                            <Avatar
                                                                className="border-2 border-white dark:border-gray-800 shadow-lg"
                                                                size={60}
                                                                shape="circle"
                                                                icon={
                                                                    <HiServer />
                                                                }
                                                                {...avatarProps}
                                                            />
                                                        )) || (
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: svgContent,
                                                                }}
                                                                style={{
                                                                    width: '300px',
                                                                    height: '175px',
                                                                }}
                                                                className="card-header-svg"
                                                            />
                                                        )}
                                                    </Upload>
                                                )
                                            }}
                                        </Field>
                                        <p>
                                            <strong>
                                                image Upload Requirements:
                                            </strong>
                                            <br />
                                            <strong>Format:</strong> SVG <br />
                                            <strong>Size:</strong> 300x175
                                            pixels Maximum
                                            <br />
                                            <strong>file size:</strong> 300 KB
                                        </p>
                                    </div>
                                </FormRow>

                                <div className="mt-4 ltr:text-right">
                                    {(isNew && (
                                        <Button
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
                                            variant="solid"
                                            loading={isSubmitting}
                                            type="submit"
                                        >
                                            {isSubmitting ? 'Editing' : 'Edit'}
                                        </Button>
                                    )}
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </main>
    )
}

export default createService
