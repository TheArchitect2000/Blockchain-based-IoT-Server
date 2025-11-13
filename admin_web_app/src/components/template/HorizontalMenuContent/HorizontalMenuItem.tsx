import navigationIcon from '@/configs/navigation-icon.config'
import MenuItem from '@/components/ui/MenuItem'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'
import { useTranslation } from 'react-i18next'
import type { NavMode } from '@/@types/theme'

export type HorizontalMenuItemProps = {
    nav: {
        key: string
        title: string
        translateKey: string
        icon: string
        path: string
    }
    isLink?: boolean
    manuVariant: NavMode
}

const HorizontalMenuItem = ({
    nav,
    isLink,
    manuVariant,
}: HorizontalMenuItemProps) => {
    const { title, translateKey, icon, path } = nav

    const { t } = useTranslation()

    const itemTitle = t(translateKey, title)

    const renderIcon = icon && <span className="text-2xl">{navigationIcon[icon]}</span>

    return (
        <>
            {path && isLink ? (
                <HorizontalMenuNavLink path={path}>
                    <MenuItem variant={manuVariant}>
                        <span className="flex items-center gap-2">
                            {renderIcon}
                            {itemTitle}
                        </span>
                    </MenuItem>
                </HorizontalMenuNavLink>
            ) : (
                <MenuItem variant={manuVariant}>
                    {renderIcon}
                    <span>{itemTitle}</span>
                </MenuItem>
            )}
        </>
    )
}

export default HorizontalMenuItem
