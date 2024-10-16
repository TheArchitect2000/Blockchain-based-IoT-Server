import { useState } from 'react'
import {
    Button,
    Checkbox,
    Dialog,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import FormDesription from './FormDesription'
import { apiPermanentDeleteUserAccount } from '@/services/UserApi'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'

export default function DeleteAccount() {
    const [apiLoading, setApiLoading] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmationText, setConfirmationText] = useState('')
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const requiredText = 'DELETE ACCOUNT'

    const { signOut } = useAuth()

    // Function to handle checkbox change
    const handleCheckboxChange = (values: boolean) => {
        setIsChecked(values)
    }

    async function handleConfirmDelete() {
        setApiLoading(true)
        try {
            const res = await apiPermanentDeleteUserAccount(String(userId))
            setApiLoading(false)
            toast.push(
                <Notification type="success">
                    You account deleted successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            signOut()
        } catch (error: any) {
            setApiLoading(false)
            toast.push(
                <Notification type="danger">
                    {error.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <main className="flex flex-col gap-4 w-full">
            <FormDesription title="Account Deletion Warning:" desc="" />
            <p className="text-[1.2rem] text-white">
                <span className="text-red-500">Important</span>: Once you delete
                your account, this action cannot be undone. All your data,
                including settings, preferences, and history, will be
                permanently removed from our system. If you wish to return in
                the future, you will need to create a new account and set up
                your preferences again. Please ensure you have saved any
                important information before proceeding.
            </p>

            <div className="flex items-center mt-6">
                <Checkbox
                    id="delete-account-checkbox"
                    defaultChecked={false}
                    color="red-500"
                    onChange={handleCheckboxChange}
                />
                <label
                    htmlFor="delete-account-checkbox"
                    className="text-white text-[1rem] ml-2"
                >
                    I have read the above information and agree to proceed with
                    account deletion.
                </label>
            </div>

            <Button
                disabled={!isChecked}
                variant="solid"
                color="red-500"
                className={`mt-4 ms-auto w-fit bg-red-500 ${
                    !isChecked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => setDialogOpen(true)}
            >
                Delete Account
            </Button>
            <Dialog
                overlayClassName={'flex items-center'}
                isOpen={dialogOpen}
                closable={false}
                contentClassName="!w-1/3 flex flex-col gap-4"
                onClose={() => setDialogOpen(false)}
            >
                <h3>Final Warning</h3>
                <p className="text-center text-[1.2rem]">
                    Are you sure you want to permanently delete your account?
                    This action cannot be undone, and all your data, including
                    settings, preferences, and history, will be irreversibly
                    lost. Please confirm that you want to proceed.
                </p>
                <p className="text-center text-[1rem] text-red-500">
                    To confirm, please type "<strong>{requiredText}</strong>"
                    below.
                </p>

                <Input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={`Type ${requiredText} to confirm`}
                    className="border border-gray-300 p-2 rounded"
                />

                <div className="flex justify-center gap-6 mt-2">
                    <Button
                        onClick={handleConfirmDelete}
                        variant="solid"
                        color="red-500"
                        disabled={
                            confirmationText !== requiredText || apiLoading
                        }
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        variant="default"
                        disabled={apiLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>
        </main>
    )
}
