import { createSlice } from '@reduxjs/toolkit'
import appConfig from '@/configs/app.config'

export type LocaleState = {
    currentLang: string
    avatarLink: string
    firstName: string
    unreadNotifs: number
    readedNotifs: Array<string>
}

const initialState: LocaleState = {
    currentLang: appConfig.locale,
    avatarLink: appConfig.locale,
    firstName: appConfig.locale,
    unreadNotifs: 0,
    readedNotifs: [],
}

export const localeSlice = createSlice({
    name: 'locale',
    initialState,
    reducers: {
        setLang: (state, action) => {
            state.currentLang = action.payload
        },
        setAvatar: (state, action) => {
            state.avatarLink = action.payload
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload
        },
        setUnreadNotifs: (state, action) => {
            state.unreadNotifs = action.payload
        },
        setReadedNotifs: (state, action) => {
            state.readedNotifs = action.payload
        },
        resetState: () => initialState,
    },
})

export const {
    setLang,
    setAvatar,
    setFirstName,
    setUnreadNotifs,
    setReadedNotifs,
    resetState,
} = localeSlice.actions

export default localeSlice.reducer
