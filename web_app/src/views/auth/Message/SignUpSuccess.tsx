import { Button } from '@/components/ui'
import { useEffect } from 'react';
import { render } from 'react-dom';
import { useNavigate } from 'react-router-dom'

export default function SignUpSuccess({ ...rest }) {
    const navigateTo = useNavigate()

    return (
        <section className="flex flex-col h-[75vh]">
            <img
                className="self-center w-[200px] lg:w-[300px]"
                loading="lazy"
                src="/img/others/success.png"
            />
            <h1 className='self-center'>Success!</h1>
            <p className='self-center mt-2 text-xl'>Completed Registration.</p>
            <Button onClick={() => navigateTo("/sign-in")} className='mt-auto' variant="solid" size="md">
                Continue
            </Button>
        </section>
    )
}
