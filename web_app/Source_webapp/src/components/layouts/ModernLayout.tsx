import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import Notification from '@/components/template/Notification'
import ThemeApply from './ThemeApply'
import { useEffect } from 'react'
import { useConfig } from '../ui/ConfigProvider'
import Scrollbar from 'smooth-scrollbar'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            {/* <LanguageSelector />*/}
            <Notification />
            {/* <SidePanel /> */}
            <UserDropdown hoverable={false} />
        </>
    )
}

const ModernLayout = () => {
    const { themeBackground } = useConfig()
    ThemeApply()

    useEffect(() => {
        const elm = document.querySelector('#my-scrollbar')
        if (elm) {
            Scrollbar.init(elm, {
                damping: 0.03,
            })
        }
    }, [])

    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div
                    id="my-scrollbar"
                    className={`flex flex-col flex-auto h-screen overflow-scroll min-w-0 relative w-full bg-white dark:bg-${themeBackground} border-l border-gray-200 dark:border-gray-700`}
                >
                    <Header
                        className={`border-b border-gray-200 dark:border-gray-700`}
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
