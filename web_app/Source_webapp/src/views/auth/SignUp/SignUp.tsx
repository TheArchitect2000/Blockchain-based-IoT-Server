import ThemApply from '@/components/layouts/ThemApply'
import SignUpForm from './SignUpForm'

const SignUp = () => {
    ThemApply()

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p>lets get started with your free trial</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
