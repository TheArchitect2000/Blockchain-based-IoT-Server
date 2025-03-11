import { apiGetMyProfile } from '@/services/UserApi'
import { create } from 'zustand'

interface Role {
    department: string
    label: string
    name: string
}

interface RoleStore {
    useRoles: Array<Role> // Replace `any` with the specific type of your roles if known
    loading: boolean
    fetchUserRoles: () => Promise<void>
    checkUserHasRole: (role: string) => boolean
}

export const useRoleStore = create<RoleStore>((set, get) => ({
    useRoles: [],
    loading: false,

    checkUserHasRole: (role) => {
        const { useRoles } = get()

        return useRoles.some(
            (theRole) =>
                theRole.name == role ||
                theRole.label == role ||
                theRole.department == role
        )
    },

    fetchUserRoles: async () => {
        try {
            set({ loading: true })
            const res = (await apiGetMyProfile()) as any
            const roles = res.data.data.roles
            set({ useRoles: roles, loading: false })
        } catch (error) {
            set({ loading: false })
        }
    },
}))
