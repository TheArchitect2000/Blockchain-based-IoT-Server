import ThemeApply from '@/components/layouts/ThemeApply'
import SignUpForm from './SignUpForm'
import { ActionLink } from '@/components/shared'

const SignUp = () => {
    ThemeApply()

    return (
        <main className="w-full min-h-[93.5dvh] flex flex-col justify-center">
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p>Let's start with your free account!</p>
            </div>
            <SignUpForm disableSubmit={false} />

            <div className="flex flex-col gap-4 mt-4 w-full max-w-[550px]">
                <p className="text-wrap text-center">
                    By continuing, you agree to Fidesinnova's{' '}
                    <ActionLink
                        target="_blank"
                        to={
                            'https://fidesinnova.io/Download/docs/terms-of-service.html'
                        }
                    >
                        Terms of Service
                    </ActionLink>{' '}
                    and acknowledge you've read our{' '}
                    <ActionLink
                        target="_blank"
                        to={
                            'https://fidesinnova.io/Download/docs/privacy-policy.html'
                        }
                    >
                        Privacy Policy
                    </ActionLink>
                    .
                </p>
            </div>

            <section className="w-full relative my-4">
                <div className="w-5/12 mx-auto border-t border-gray-400"></div>
            </section>

            <div className="text-center">
                <span>Already have an account? </span>
                <ActionLink to={'/sign-in'}>Sign in</ActionLink>
            </div>
        </main>
    )
}

export default SignUp
