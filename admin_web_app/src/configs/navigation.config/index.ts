import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { apiGetUserAdminRoles } from '@/services/UserApi'
import { useAppSelector } from '@/store'
import { toast } from '@/components/ui'

const navigationConfig: NavigationTree[] = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'Dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'accounts',
        path: '/accounts',
        role: 'super',
        title: 'Wallet Accounts',
        translateKey: 'Accounts',
        icon: 'account',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'allUsers',
        path: '/allusers',
        title: 'All Users',
        role: 'user',
        translateKey: 'All Users',
        icon: 'user',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'allDevices',
        path: '/alldevices',
        title: 'All Devices',
        role: 'device',
        translateKey: 'All Devices',
        icon: 'device',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'allInstalledServices',
        path: '/allinstalledservices',
        title: 'All Installed Services',
        role: 'service',
        translateKey: 'All Installed Services',
        icon: 'myService',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'Notifications',
        path: '/notifications',
        title: 'Notifications',
        role: 'notification',
        translateKey: 'Notifications',
        icon: 'notification',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'requests',
        path: '/requests',
        role: 'request',
        title: 'Service Requests',
        translateKey: 'Requests',
        icon: 'requests',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'admins',
        path: '/admins',
        role: 'super',
        title: 'User Roles',
        translateKey: 'Admins',
        icon: 'admins',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'market',
        path: '/market',
        title: 'Service Market',
        translateKey: 'Service Market',
        icon: 'singleMenu',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export async function fixNavigationWithRoles(userEmail: string) {
    try {
        const res = (await apiGetUserAdminRoles(userEmail || '')) as any

        const rolesArray = res.data?.data as Array<string>

        const filteredItems = navigationConfig
            .flatMap((items) => {
                if (items.role) {
                    if (rolesArray.includes(items.role)) {
                        return items
                    }
                } else {
                    return items
                }
            })
            .filter((item) => item != undefined)

        if (rolesArray.includes('super')) {
            return navigationConfig
        } else {
            return filteredItems
        }
    } catch (error) {
        alert('There was an error while getting pages, please refresh the page')
        return []
    }
}

export default navigationConfig

// {
//     key: 'collapseMenu',
//     path: '',
//     title: 'Collapse Menu',
//     translateKey: 'nav.collapseMenu.collapseMenu',
//     icon: 'collapseMenu',
//     type: NAV_ITEM_TYPE_COLLAPSE,
//     authority: [],
//     subMenu: [
//         {
//             key: 'collapseMenu.item1',
//             path: '/collapse-menu-item-view-1',
//             title: 'Collapse menu item 1',
//             translateKey: 'nav.collapseMenu.item1',
//             icon: '',
//             type: NAV_ITEM_TYPE_ITEM,
//             authority: [],
//             subMenu: [],
//         },
//         {
//             key: 'collapseMenu.item2',
//             path: '/collapse-menu-item-view-2',
//             title: 'Collapse menu item 2',
//             translateKey: 'nav.collapseMenu.item2',
//             icon: '',
//             type: NAV_ITEM_TYPE_ITEM,
//             authority: [],
//             subMenu: [],
//         },
//     ],
// },
// {
//     key: 'groupMenu',
//     path: '',
//     title: 'Group Menu',
//     translateKey: 'nav.groupMenu.groupMenu',
//     icon: '',
//     type: NAV_ITEM_TYPE_TITLE,
//     authority: [],
//     subMenu: [
//         {
//             key: 'groupMenu.single',
//             path: '/group-single-menu-item-view',
//             title: 'Group single menu item',
//             translateKey: 'nav.groupMenu.single',
//             icon: 'groupSingleMenu',
//             type: NAV_ITEM_TYPE_ITEM,
//             authority: [],
//             subMenu: [],
//         },
//         {
//             key: 'groupMenu.collapse',
//             path: '',
//             title: 'Group collapse menu',
//             translateKey: 'nav.groupMenu.collapse.collapse',
//             icon: 'groupCollapseMenu',
//             type: NAV_ITEM_TYPE_COLLAPSE,
//             authority: [],
//             subMenu: [
//                 {
//                     key: 'groupMenu.collapse.item1',
//                     path: '/group-collapse-menu-item-view-1',
//                     title: 'Menu item 1',
//                     translateKey: 'nav.groupMenu.collapse.item1',
//                     icon: '',
//                     type: NAV_ITEM_TYPE_ITEM,
//                     authority: [],
//                     subMenu: [],
//                 },
//                 {
//                     key: 'groupMenu.collapse.item2',
//                     path: '/group-collapse-menu-item-view-2',
//                     title: 'Menu item 2',
//                     translateKey: 'nav.groupMenu.collapse.item2',
//                     icon: '',
//                     type: NAV_ITEM_TYPE_ITEM,
//                     authority: [],
//                     subMenu: [],
//                 },
//             ],
//         },
//     ],
// },
