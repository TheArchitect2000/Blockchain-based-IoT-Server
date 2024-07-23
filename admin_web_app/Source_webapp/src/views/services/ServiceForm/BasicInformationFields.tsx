import AdaptableCard from '@/components/shared/AdaptableCard'
import RichTextEditor from '@/components/shared/RichTextEditor'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'

type FormFieldsName = {
    serviceName: string
    _id: string
    serviceType: string
    description: string
    status: 'string'
    devices: string[]
    serviceImage: 'string'
    blocklyJson: 'string'
    code: 'string'
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props


    const { useEditService } = useEditService()

    const onEditeService = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { serviceId, serviceName, description, serviceType, status, devices, serviceImage, blocklyJson, code } = values
        setSubmitting(true)

        const result = await useEditService({ serviceId, serviceName, description, serviceType, status, devices, serviceImage, blocklyJson, code })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }






    return (
        <AdaptableCard divider className="mb-4">
            
            {/* <h5>Basic Information</h5>
            <p className="mb-6">Section to config basic product information</p> */}
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                    // tags: initialData?.tags
                    //     ? initialData.tags.map((value) => ({
                    //           label: value,
                    //           value,
                    //       }))
                    //     : [],
                }}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onEditeService(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
            <FormItem
                label="Service Name"
                invalid={(errors.serviceName && touched.serviceName) as boolean}
                errorMessage={errors.serviceName}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="serviceName"
                    placeholder="Service Name"
                    component={Input}
                />
            </FormItem>
            {/* <FormItem
                label="Service Id"
                invalid={(errors._id && touched._id) as boolean}
                errorMessage={errors._id}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="_id"
                    placeholder="Service Id"
                    component={Input}
                />
            </FormItem> */}
            <FormItem
                label="Description"
                labelClass="!justify-start"
                invalid={(errors.description && touched.description) as boolean}
                errorMessage={errors.description}
            >
                <Field name="description">
                    {({ field, form }: FieldProps) => (
                        <RichTextEditor
                            value={field.value}
                            onChange={(val) =>
                                form.setFieldValue(field.name, val)
                            }
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Service Type"
                invalid={(errors.serviceType && touched.serviceType) as boolean}
                errorMessage={errors.serviceType}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="serviceType"
                    placeholder="automation"
                    component={Input}
                />
            </FormItem>


            <FormItem
                label="Devices"
                // invalid={
                //     (errors.devices?.[0] && touched.devices?.[0]) as boolean
                // }
                // errorMessage={errors.devices?.[0]}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="devices"
                    placeholder="Device Name"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="Service Image"
                invalid={
                    (errors.serviceImage && touched.serviceImage) as boolean
                }
                errorMessage={errors.serviceImage}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="serviceImage"
                    placeholder="Service Image"
                    component={Input}
                />
            </FormItem>

            {/* <FormItem
                label="Blockly Json"
                invalid={(errors.blocklyJson && touched.blocklyJson) as boolean}
                errorMessage={errors.blocklyJson}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="blocklyJson"
                    placeholder="Blockly Json"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="Code"
                invalid={(errors.code && touched.code) as boolean}
                errorMessage={errors.code}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="code"
                    placeholder="Code"
                    component={Input}
                />
            </FormItem> */}

            
                    {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <BasicInformationFields
                                        touched={touched}
                                        errors={errors}
                                    />
                                </div>
                                <div className="lg:col-span-1">
                                    {/* <ProductImages values={values} /> */}
                                </div>
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <DeleteProductButton
                                            onDelete={onDelete as OnDelete}
                                        />
                                    )}
                                </div>
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        loading={isSubmitting}
                                        icon={<AiOutlineSave />}
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </AdaptableCard>
    )
}

export default BasicInformationFields
