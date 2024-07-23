import classNames from 'classnames'
import { HEADER_HEIGHT_CLASS } from '@/constants/theme.constant'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
}

const Header = (props: HeaderProps) => {
    const { headerStart, headerEnd, headerMiddle, className, container } = props
    const navigate = useNavigate()
    const onCreateNewService = () => {
        navigate(`/services/new`)
    }
    return (
        <header className={classNames('header', className)}>
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
                    <div className="flex mt-1 justify-end">
                        {' '}
                        <Button
                            onClick={onCreateNewService}
                            variant='solid'
                        >
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
