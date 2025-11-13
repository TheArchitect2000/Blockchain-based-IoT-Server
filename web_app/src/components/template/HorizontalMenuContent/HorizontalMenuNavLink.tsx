import { Link } from 'react-router-dom'
import classNames from 'classnames'
import type { PropsWithChildren } from 'react'

export type HorizontalMenuNavLinkProps = PropsWithChildren<{
    path: string
    className?: string
}>

const HorizontalMenuNavLink = ({
    path,
    children,
    className
}: HorizontalMenuNavLinkProps) => {
    return (
        <Link 
            className={
                classNames(
                    'h-full w-full flex items-center',
                    className
                )} 
            to={path}
        >
            <span>{children}</span>
        </Link>
    )
}

export default HorizontalMenuNavLink
