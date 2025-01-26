import ThemeApply from '@/components/layouts/ThemeApply'
import SignUpForm from './SignUpForm'

const SignUp = () => {
    ThemeApply()

    return (
        <main className='w-full min-h-[93.5dvh] flex flex-col justify-center'>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p>lets get started with your free trial</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </main>
    )
}

export default SignUp
