import classNames from 'classnames'
import { HEADER_HEIGHT_CLASS } from '@/constants/theme.constant'
import { useState, type ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useConfig } from '../ui/ConfigProvider'
import { apiValidateRemixIDE } from '@/services/UserApi'
import { PasswordInput } from '../shared'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
}

const Header = (props: HeaderProps) => {
    const { headerStart, headerEnd, headerMiddle, className, container } = props
    const navigate = useNavigate()
    const [remixDialog, setRemixDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{
        username?: string
        password?: string
    }>({})

    const onCreateNewService = () => {
        navigate(`/services/new`)
    }

    const { themeBackground } = useConfig()

    const validateForm = () => {
        let valid = true
        const newErrors: { username?: string; password?: string } = {}

        if (!username) {
            newErrors.username = 'Username is required'
            valid = false
        }

        if (!password) {
            newErrors.password = 'Password is required'
            valid = false
        }

        setErrors(newErrors)
        return valid
    }

    const onValidate = () => {
        if (validateForm()) {
            // Handle successful validation
            async function validateData(user: string, pass: string) {
                setLoading(true)
                const res = (await apiValidateRemixIDE(user, pass)) as any
                setLoading(false)
                if (res.data.data == true) {
                    setRemixDialog(false)
                    navigate(`/remix?user=${username}&pass=${password}`)
                } else {
                    toast.push(
                        <Notification type="danger">
                            {'Username or password is not valid'}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            }
            validateData(username, password)
            console.log('Form is valid')
        }
    }

    return (
        <header
            className={classNames(
                'header',
                `dark:bg-${themeBackground}`,
                className
            )}
        >
            <Dialog isOpen={remixDialog} onClose={() => setRemixDialog(false)}>
                <h3>Advanced Console Authentication</h3>
                <div className="flex p-6 justify-around gap-6">
                    <div className="w-full">
                        <Input
                            disabled={loading}
                            placeholder="Username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={errors.username ? 'border-red-500' : ''}
                        />
                        {errors.username && (
                            <span className="text-red-500 text-sm">
                                {errors.username}
                            </span>
                        )}
                    </div>
                    <div className="w-full">
                        <PasswordInput
                            disabled={loading}
                            placeholder="Password..."
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Button
                        loading={loading}
                        color="green"
                        variant="solid"
                        onClick={onValidate}
                    >
                        Validate
                    </Button>
                </div>
            </Dialog>
            <div
                className={classNames(
                    'header-wrapper',
                    HEADER_HEIGHT_CLASS,
                    container && 'container mx-auto'
                )}
            >
                <div className="header-action header-action-start">
                    {headerStart}
                </div>

                {headerMiddle && (
                    <div className="header-action header-action-middle">
                        {headerMiddle}
                    </div>
                )}
                <div className="flex flex-row">
                    <div className="flex gap-4 mt-1 justify-end">
                        <Button
                            onClick={() => setRemixDialog(true)}
                            variant="default"
                        >
                            Advanced console
                        </Button>{' '}
                        <Button onClick={onCreateNewService} variant="solid">
                            Create New Service
                        </Button>{' '}
                    </div>
                    <div className="header-action header-action-end">
                        {headerEnd}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
