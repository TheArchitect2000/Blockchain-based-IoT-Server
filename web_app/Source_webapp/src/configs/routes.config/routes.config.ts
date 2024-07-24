import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'dashboard',
        path: `/dashboard`,
        component: lazy(() => import('@/views/crm/CrmDashboard')),
        authority: [],
    },
    {
        key: 'devices',
        path: '/devices',
        component: lazy(() => import('@/views/devices/DeviceList')),
        authority: [],
    },
    {
        key: 'device details',
        path: '/devices/:deviceId',
        component: lazy(() => import('@/views/devices/DeviceDetails') as any),
        authority: [],
    },
    {
        key: 'services',
        path: '/services',
        component: lazy(() => import('@/views/services/Services')),
        authority: [],
    },
    {
        key: 'serviceDetails',
        path: '/services/:serviceId',
        component: lazy(() => import('@/views/services/ServiceView')),
        authority: [],
    },
    {
        key: 'serviceCode',
        path: '/services/code/:serviceId',
        component: lazy(() => import('@/views/services/ServiceCode')),
        authority: [],
    },
    {
        key: 'installed',
        path: '/installed',
        component: lazy(() => import('@/views/services/InstallService')),
        authority: [],
    },
    {
        key: 'notifications',
        path: '/notifications',
        component: lazy(() => import('@/views/notification')),
        authority: [],
    },
    {
        key: 'market',
        path: '/market',
        component: lazy(() => import('@/views/market')),
        authority: [],
    },
    {
        key: 'settings',
        path: `/account/settings/:tab`,
        component: lazy(() => import('@/views/account/Settings')),
        authority: [],
        meta: {
            header: 'Settings',
            headerContainer: true,
        },
    },
    {
        key: 'appsAccount.invoice',
        path: `/account/invoice/:id`,
        component: lazy(() => import('@/views/account/Invoice')),
        authority: [],
    },
    {
        key: 'appsAccount.activityLog',
        path: `/account/activity-log`,
        component: lazy(() => import('@/views/account/ActivityLog')),
        authority: [],
    },
    {
        key: 'appsAccount.kycForm',
        path: `/account/kyc-form`,
        component: lazy(() => import('@/views/account/KycForm')),
        authority: [],
    },
]
