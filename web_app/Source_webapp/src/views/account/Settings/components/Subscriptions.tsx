import { useEffect, useState } from 'react'
import FormDesription from './FormDesription'
import {
    apiGetMyEmailSubscription,
    apiSetMyEmailSubscription,
} from '@/services/Subscriptions'
import { Loading } from '@/components/shared'
import { Button, Notification, toast } from '@/components/ui'

const SubscriptionComponent = ({
    title,
    desc,
    color,
    subscription,
    onSubscribeChange,
    loadingState,
}: {
    title: string
    desc: string
    color?: string
    subscription: boolean
    onSubscribeChange: Function
    loadingState: any
}) => {
    console.log("Ghol:", subscription);
    
    return (
        <div className="flex items-center gap-4 w-full p-4 border rounded-xl">
            <h5 className="text-[1.25rem]">{title}:</h5>
            <p
                className={`text-[1rem] text-[#${
                    (color && color) || 'ffffff'
                }]`}
            >
                {desc}
            </p>
            <Button
                className="ms-auto mr-4"
                variant="solid"
                loading={loadingState}
                onClick={() => onSubscribeChange(!subscription)}
                color={subscription ? 'red-500' : 'green-500'}
            >
                {subscription ? 'Unsubscribe' : 'subscribe'}
            </Button>
        </div>
    )
}

export default function Subscriptions() {
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(false)
    const [emailSubscription, setEmailSubscription] = useState<boolean>(false)

    async function getSubscriptionsData() {
        setLoading(true)
        const res = (await apiGetMyEmailSubscription()) as any
        setEmailSubscription(res?.data?.data ?? false)
        setLoading(false)
    }

    async function handleChangeEmailSubscribe(state: boolean) {
        console.log("state:", state);
        
        try {
            setApiLoading(true)
            const res = await apiSetMyEmailSubscription(state)
            getSubscriptionsData()
            setApiLoading(false)
            toast.push(
                <Notification title="Email Subscription Updated" type="success">
                    {`You have successfully ${
                        state ? 'subscribed to' : 'unsubscribed from'
                    } our emails.`}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            setApiLoading(false)
            toast.push(
                <Notification title="Error Updating Subscription" type="danger">
                    {`There was a problem ${
                        state ? 'subscribing to' : 'unsubscribing from'
                    } our emails. Please try again later.`}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    useEffect(() => {
        getSubscriptionsData()
    }, [])

    if (loading) {
        return (
            <div className="flex w-full h-screen items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    return (
        <main className="flex flex-col gap-6 w-full">
            <FormDesription
                title="Manage Your Subscriptions"
                desc="Stay updated with our latest news and offers. You can manage your email subscriptions below."
            />
            <div className="flex flex-col w-full gap-3">
                <SubscriptionComponent
                    title="Email"
                    desc={
                        emailSubscription
                            ? 'You are currently subscribed to our emails!'
                            : 'You have not subscribed to our emails!'
                    }
                    color={emailSubscription ? '00aa00' : 'aa0000'}
                    subscription={emailSubscription}
                    loadingState={apiLoading}
                    onSubscribeChange={handleChangeEmailSubscribe}
                />
            </div>
        </main>
    )
}
