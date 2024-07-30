import { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import FormRow from '../account/Settings/components/FormRow'
import FormDesription from '../account/Settings/components/FormDesription'
import {
    apiEditNotificationByNotifId,
    apiGetPublicNotifications,
    apiSendNotificationToUser,
    apiSendNotificationToUserByEmail,
    apiSendPublicNotification,
} from '@/services/NotificationService'
import { DatePicker, Dialog, Notification, toast } from '@/components/ui'
import useApiData from '@/utils/hooks/useApi'
import { Loading } from '@/components/shared'
import PaginatedList from '../market/components/PaginationList'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useCheckPage } from '../security/CheckPage'

const userNotifSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    message: Yup.string().required('Message is required'),
    userEmail: Yup.string().required('User Email is required'),
})

const publicNotifSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    message: Yup.string().required('Message is required'),
})

export interface NotificationProps {
    expiryDate: string
    insertDate: string
    insertedBy: string
    message: string
    public: boolean
    read: boolean
    title: string
    type: string
    userId: string
    _id: string
}

function formatISODate(isoDate: string) {
    // Create a new Date object from the ISO string
    const date = new Date(isoDate)

    // Extract date components
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0')

    // Extract time components
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    // Format the date and time
    const formattedDate = `${year}-${month}-${day}`
    const formattedTime = `${hours}:${minutes}:${seconds}`

    // Combine date and time with a comma
    return `${formattedDate} , ${formattedTime}`
}

export default function NotificationPage() {
    const [editPublicDatas, setEditPublicDatas] = useState<any>({})
    const [expiryDateDays, setExpiryDateDays] = useState(0)
    const [editNotifModal, setEditNotifModal] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [publicLoading, setPublicLoading] = useState(true)
    const [publicNotifications, setPublicNotifications] = useState<any>([])
    const [deleteDialog, setDeleteDialog] = useState(false)
    const navigateTo = useNavigate()
    const { loading, result } = useCheckPage('notification')
    if (loading == false) {
        if (result == false) {
            navigateTo('/')
        }
    }

    function refreshNotifications() {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        async function fetchData() {
            setPublicLoading(true)
            const datas = (await apiGetPublicNotifications()) as any
            setPublicNotifications(datas?.data?.data)
            setPublicLoading(false)
        }
        fetchData()
    }, [refresh])

    async function sendUserNotif(values: any, setSubmitting: any) {
        const res = await apiSendNotificationToUserByEmail(
            values.userEmail,
            values.title,
            values.message
        )
        toast.push(
            <Notification
                title={'Notification sended successfully'}
                type="success"
            />,
            {
                placement: 'top-center',
            }
        )
        setSubmitting(false)
    }

    async function sendPublicNotif(values: any, setSubmitting: any) {
        //alert(values.expiryDate);

        const res = await apiSendPublicNotification(
            values.title,
            values.message,
            values.expiryDate
        )
        toast.push(
            <Notification
                title={'Notification sended successfully'}
                type="success"
            />,
            {
                placement: 'top-center',
            }
        )
        refreshNotifications()
        setSubmitting(false)
    }

    async function editPublicNotif(values: any, setSubmitting: any) {
        const res = await apiEditNotificationByNotifId(
            editPublicDatas._id,
            values.title,
            values.message,
            handleEditDateChange(new Date(editPublicDatas.expiryDate))
        )
        toast.push(
            <Notification
                title={'Notification edited successfully'}
                type="success"
            />,
            {
                placement: 'top-center',
            }
        )
        setSubmitting(false)
        setEditNotifModal(false)
        refreshNotifications()
    }

    function handleEditDateChange(date: Date) {
        const selectedDate = new Date(date)
        const nowDate = new Date()
        const timeDifference = selectedDate.getTime() - nowDate.getTime()
        const daysDifference =
            Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1
        setEditPublicDatas((pervState: any) => ({
            ...pervState,
            expiryDate: selectedDate,
        }))
        return daysDifference
    }

    function handleDateChange(date: Date) {
        const selectedDate = new Date(date)
        const nowDate = new Date()
        const timeDifference = selectedDate.getTime() - nowDate.getTime()
        const daysDifference =
            Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1
        setExpiryDateDays(daysDifference)
    }

    async function handleDeleteNotification() {
        setDeleteDialog(false)
        setPublicLoading(true)
        const res = await apiEditNotificationByNotifId(
            editPublicDatas._id,
            editPublicDatas.title,
            editPublicDatas.message,
            -1
        )
        toast.push(
            <Notification
                title={'Notification deleted successfully'}
                type="success"
            />,
            {
                placement: 'top-center',
            }
        )
        setEditNotifModal(false)
        refreshNotifications()
    }

    return (
        <>
            {(loading == false && (
                <main className="w-full min-h-[70dvh] flex flex-col gap-20">
                    <section className="flex gap-4 w-full">
                        <div className="w-1/2 border-4 rounded-xl p-6 border-[#374151] flex flex-col">
                            <Formik
                                initialValues={{
                                    title: '',
                                    message: '',
                                    userEmail: '',
                                }}
                                validationSchema={userNotifSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true)
                                    sendUserNotif(values, setSubmitting)
                                }}
                            >
                                {({ isSubmitting, touched, errors }) => {
                                    const validatorProps = { touched, errors }
                                    return (
                                        <Form>
                                            <FormContainer>
                                                <h2 className="mb-1">
                                                    Send notification to user
                                                </h2>
                                                <p>
                                                    Provide the details for the
                                                    notification
                                                </p>
                                                <FormRow
                                                    name="title"
                                                    label="Title"
                                                    {...validatorProps}
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="title"
                                                        placeholder="Title"
                                                        component={Input}
                                                    />
                                                </FormRow>
                                                <FormRow
                                                    name="message"
                                                    label="Message"
                                                    {...validatorProps}
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="message"
                                                        placeholder="Message"
                                                        textArea={true}
                                                        component={Input}
                                                    />
                                                </FormRow>
                                                <FormRow
                                                    name="userEmail"
                                                    label="User Email"
                                                    {...validatorProps}
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="userEmail"
                                                        placeholder="User Email"
                                                        component={Input}
                                                    />
                                                </FormRow>
                                                <div className="flex mt-4 ltr:text-right">
                                                    <Button
                                                        className="w-1/2 mx-auto"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting
                                                            ? 'Sending'
                                                            : 'Send'}
                                                    </Button>
                                                </div>
                                            </FormContainer>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </div>
                        <div className="w-1/2 border-4 rounded-xl p-6 border-[#374151] flex flex-col">
                            <Formik
                                initialValues={{
                                    title: '',
                                    message: '',
                                    expiryDate: expiryDateDays,
                                }}
                                validationSchema={publicNotifSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true)
                                    sendPublicNotif(
                                        {
                                            ...values,
                                            expiryDate: expiryDateDays,
                                        },
                                        setSubmitting
                                    )
                                }}
                            >
                                {({ isSubmitting, touched, errors }) => {
                                    const validatorProps = { touched, errors }
                                    return (
                                        <Form>
                                            <FormContainer>
                                                <h2 className="mb-1">
                                                    Send public notification
                                                </h2>
                                                <p>
                                                    Provide the details for the
                                                    public notification
                                                </p>
                                                <FormRow
                                                    name="title"
                                                    label="Title"
                                                    {...validatorProps}
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="title"
                                                        placeholder="Title"
                                                        component={Input}
                                                    />
                                                </FormRow>
                                                <FormRow
                                                    name="message"
                                                    label="Message"
                                                    {...validatorProps}
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="message"
                                                        placeholder="Message"
                                                        textArea={true}
                                                        component={Input}
                                                    />
                                                </FormRow>
                                                <FormRow
                                                    name="expiryDate"
                                                    label="Expiry Date"
                                                    {...validatorProps}
                                                >
                                                    <Field
                                                        autoComplete="off"
                                                        name="expiryDate"
                                                        placeholder="Expiry Date"
                                                        onChange={
                                                            handleDateChange as any
                                                        }
                                                        minDate={new Date()}
                                                        clearable={false}
                                                        defaultValue={
                                                            new Date()
                                                        }
                                                        component={DatePicker}
                                                    />
                                                </FormRow>
                                                <div className="flex mt-4 ltr:text-right">
                                                    <Button
                                                        className="w-1/2 mx-auto"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting
                                                            ? 'Sending'
                                                            : 'Send'}
                                                    </Button>
                                                </div>
                                            </FormContainer>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </div>
                    </section>
                    <section className="w-full flex flex-col">
                        <div className="flex justify-between">
                            <h1 className="mb-6">Public Notifications</h1>
                            <Button
                                onClick={refreshNotifications}
                                disabled={publicLoading}
                            >
                                Refresh
                            </Button>
                        </div>
                        {(publicLoading == true && (
                            <Loading loading={true} />
                        )) || (
                            <section className="w-full">
                                <PaginatedList
                                    className="flex flex-col gap-4"
                                    itemsPerPage={10}
                                >
                                    {publicNotifications.map(
                                        (
                                            notif: NotificationProps,
                                            index: any
                                        ) => {
                                            return (
                                                <div className="flex w-full p-4 border-4 border-[#374151] rounded-xl">
                                                    <div className="flex flex-col gap-1 w-11/12">
                                                        <h4 className="text-[1.3rem]">
                                                            {notif.title}
                                                        </h4>
                                                        <p className="text-[1rem]">
                                                            <strong>
                                                                message:
                                                            </strong>{' '}
                                                            {notif.message}
                                                        </p>
                                                        <p>
                                                            <strong>
                                                                Expiry Date:
                                                            </strong>{' '}
                                                            {formatISODate(
                                                                notif.expiryDate
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex text-[1.5rem] gap-2 items-center justify-center w-1/12">
                                                        <HiPencil
                                                            onClick={() => {
                                                                const editDate =
                                                                    new Date(
                                                                        notif.expiryDate
                                                                    )
                                                                editDate.setDate(
                                                                    editDate.getDate() -
                                                                        1
                                                                )
                                                                setEditPublicDatas(
                                                                    (
                                                                        pervState: any
                                                                    ) => ({
                                                                        ...pervState,
                                                                        ...notif,
                                                                        expiryDate:
                                                                            editDate,
                                                                    })
                                                                )
                                                                setEditNotifModal(
                                                                    true
                                                                )
                                                            }}
                                                            className="cursor-pointer"
                                                        />
                                                        <Dialog
                                                            isOpen={
                                                                editNotifModal
                                                            }
                                                            onClose={() =>
                                                                setEditNotifModal(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <Formik
                                                                initialValues={{
                                                                    title: editPublicDatas.title,
                                                                    message:
                                                                        editPublicDatas.message,
                                                                    expiryDate:
                                                                        editPublicDatas.expiryDate,
                                                                }}
                                                                validationSchema={
                                                                    publicNotifSchema
                                                                }
                                                                onSubmit={(
                                                                    values,
                                                                    {
                                                                        setSubmitting,
                                                                    }
                                                                ) => {
                                                                    setSubmitting(
                                                                        true
                                                                    )
                                                                    editPublicNotif(
                                                                        {
                                                                            ...values,
                                                                            expiryDate:
                                                                                editPublicDatas.expiryDate,
                                                                        },
                                                                        setSubmitting
                                                                    )
                                                                }}
                                                            >
                                                                {({
                                                                    isSubmitting,
                                                                    touched,
                                                                    errors,
                                                                }) => {
                                                                    const validatorProps =
                                                                        {
                                                                            touched,
                                                                            errors,
                                                                        }
                                                                    return (
                                                                        <Form>
                                                                            <FormContainer>
                                                                                <h2 className="mb-1">
                                                                                    Edit
                                                                                    public
                                                                                    notification
                                                                                </h2>
                                                                                <FormRow
                                                                                    name="title"
                                                                                    label="Title"
                                                                                    {...validatorProps}
                                                                                >
                                                                                    <Field
                                                                                        type="text"
                                                                                        autoComplete="off"
                                                                                        name="title"
                                                                                        placeholder="Title"
                                                                                        component={
                                                                                            Input
                                                                                        }
                                                                                    />
                                                                                </FormRow>
                                                                                <FormRow
                                                                                    name="message"
                                                                                    label="Message"
                                                                                    {...validatorProps}
                                                                                >
                                                                                    <Field
                                                                                        type="text"
                                                                                        autoComplete="off"
                                                                                        name="message"
                                                                                        placeholder="Message"
                                                                                        textArea={
                                                                                            true
                                                                                        }
                                                                                        component={
                                                                                            Input
                                                                                        }
                                                                                    />
                                                                                </FormRow>
                                                                                <FormRow
                                                                                    name="expiryDate"
                                                                                    label="Expiry Date"
                                                                                    {...validatorProps}
                                                                                >
                                                                                    <Field
                                                                                        autoComplete="off"
                                                                                        name="expiryDate"
                                                                                        placeholder="Expiry Date"
                                                                                        onChange={
                                                                                            handleEditDateChange as any
                                                                                        }
                                                                                        clearable={
                                                                                            false
                                                                                        }
                                                                                        defaultValue={
                                                                                            editPublicDatas.expiryDate
                                                                                        }
                                                                                        component={
                                                                                            DatePicker
                                                                                        }
                                                                                    />
                                                                                </FormRow>
                                                                                <div className="flex mt-4 ltr:text-right">
                                                                                    <Button
                                                                                        className="w-1/2 mx-auto"
                                                                                        type="submit"
                                                                                        disabled={
                                                                                            isSubmitting
                                                                                        }
                                                                                    >
                                                                                        {isSubmitting
                                                                                            ? 'Editing'
                                                                                            : 'Edit'}
                                                                                    </Button>
                                                                                </div>
                                                                            </FormContainer>
                                                                        </Form>
                                                                    )
                                                                }}
                                                            </Formik>
                                                        </Dialog>
                                                        <HiTrash
                                                            onClick={() => {
                                                                setEditPublicDatas(
                                                                    (
                                                                        pervState: any
                                                                    ) => ({
                                                                        ...pervState,
                                                                        ...notif,
                                                                    })
                                                                )
                                                                setDeleteDialog(
                                                                    true
                                                                )
                                                            }}
                                                            className="cursor-pointer"
                                                        />
                                                        <Dialog
                                                            isOpen={
                                                                deleteDialog
                                                            }
                                                            onClose={() =>
                                                                setDeleteDialog(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <h3 className="mb-8">
                                                                Delete Confirm
                                                            </h3>
                                                            <p className="text-center mb-4 text-[1.2rem]">
                                                                Are you sure
                                                                about deleting
                                                                this
                                                                notification ?
                                                            </p>
                                                            <div className="w-2/3 mx-auto flex justify-between">
                                                                <Button
                                                                    variant="solid"
                                                                    color="red"
                                                                    onClick={
                                                                        handleDeleteNotification
                                                                    }
                                                                >
                                                                    Yes
                                                                </Button>
                                                                <Button
                                                                    variant="solid"
                                                                    color="green"
                                                                    onClick={() =>
                                                                        setDeleteDialog(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    No
                                                                </Button>
                                                            </div>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </PaginatedList>
                            </section>
                        )}
                    </section>
                </main>
            )) || (
                <div className="full min-h-[70dvh] flex justify-center items-center">
                    <Loading loading={true} />
                </div>
            )}
        </>
    )
}
