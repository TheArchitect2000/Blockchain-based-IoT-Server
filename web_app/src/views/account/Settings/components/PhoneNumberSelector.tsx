import { Input, Select } from '@/components/ui'
import React from 'react'
import { SingleValue } from 'react-select'
import countrys from './countrys.json'

interface CountryData {
    name: string
    code: string
}

interface Country {
    label: string
    value: string
}

interface PhoneNumberSelectorProps {
    state: {
        phoneNumber: string
        countryCode: SingleValue<Country>
    }
    setState: React.Dispatch<
        React.SetStateAction<{
            phoneNumber: string
            countryCode: SingleValue<Country>
        }>
    >
}

function getCountrys(data: CountryData[]): Country[] {
    return data.map((item) => ({
        label: `(${item.code}) ${item.name}`,
        value: item.code,
    }))
}

const countrysOptions = getCountrys(countrys)

const PhoneNumberSelector: React.FC<PhoneNumberSelectorProps> = ({
    state,
    setState,
}) => {
   
    const handleCountryChange = (selectedOption: SingleValue<Country>) => {
        setState((prevState) => ({ ...prevState, countryCode: selectedOption }))
    }

    const handlePhoneNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setState((prevState) => ({ ...prevState, phoneNumber: e.target.value }))
    }

    return (
        <form className="w-full flex flex-col sm:flex-row gap-5 mx-auto">
            <div className="w-full sm:w-4/12 mb-4">
                <label
                    htmlFor="countryCode"
                    className="block text-sm font-medium"
                >
                    Country Code:
                </label>
                <Select
                    id="countryCode"
                    value={state.countryCode}
                    onChange={handleCountryChange}
                    options={countrysOptions}
                    className="mt-1"
                />
            </div>
            <div className="w-full sm:w-8/12 mb-4">
                <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium"
                >
                    Number:
                </label>
                <Input
                    type="number"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={state.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </form>
    )
}

export default PhoneNumberSelector
