import { useEffect } from 'react'
import SignInForm from './SignInForm'
import ThemeApply from '@/components/layouts/ThemeApply'
import { useAppSelector } from '@/store'
import GoogleLoginButton from '@/components/GoogleLoginButton/GoogleLoginButton'

const SignIn = () => {
    ThemeApply()

    const themeColor = useAppSelector((state) => state.theme.themeBackground)

    return (
        <main className="w-full min-h-[93.5dvh] flex flex-col justify-center">
            <div className="mb-8">
                <h3 className="mb-1">Welcome back!</h3>
                <p>Please enter your credentials to sign in!</p>
            </div>
            <SignInForm disableSubmit={false} />
            <section className="w-full relative border-t border-gray-400 mt-4 mb-6">
                <p
                    className={`absolute top-[-11px] left-1/2 transform -translate-x-1/2 px-3 bg-${themeColor}`}
                >
                    Or
                </p>
            </section>
            <div className="w-full">
                <GoogleLoginButton />
            </div>
        </main>
    )
}

export default SignIn
