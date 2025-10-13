import { createSlice } from '@reduxjs/toolkit'
import appConfig from '@/configs/app.config'

export type LocaleState = {
    currentLang: string
    avatarLink: string
    firstName: string
}

const initialState: LocaleState = {
    currentLang: appConfig.locale,
    avatarLink: appConfig.locale,
    firstName: appConfig.locale,
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
    },
})

export const { setLang, setAvatar, setFirstName } = localeSlice.actions

export default localeSlice.reducer
