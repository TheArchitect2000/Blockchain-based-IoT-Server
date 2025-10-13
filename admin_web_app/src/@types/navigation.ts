export interface NavigationTree {
    key: string
    path: string
    title: string
    role?: string
    translateKey: string
    icon: string
    type: 'title' | 'collapse' | 'item'
    authority: string[]
    subMenu: NavigationTree[]
}
