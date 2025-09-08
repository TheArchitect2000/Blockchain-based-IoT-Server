import { Button, FormContainer } from '@/components/ui'
import './style.scss'
import StorXLogo from './sotrxLogo'
import { apiGetServiceById } from '@/services/StorxApi'

export default function StorX() {
    const handleLogin = async () => {
        try {
            const res = (await apiGetServiceById()) as any

            if (res.data?.data.uri) {
                window.location.href = res.data.data.uri
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <FormContainer>
            <div className="flex items-center gap-4">
                <h5>StorX Authentication</h5>
                <StorXLogo />
            </div>
            <div className="mt-4 ltr:text-right">
                <Button
                    variant="solid"
                    size="sm"
                    className="w-fit ms-auto"
                    onClick={handleLogin}
                >
                    Login to StorX
                </Button>
            </div>
        </FormContainer>
    )
}
