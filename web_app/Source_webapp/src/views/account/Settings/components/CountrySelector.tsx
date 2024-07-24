import React, { useState, useEffect } from 'react'
import countrys from './countrys.json' 
import { Select } from '@/components/ui'
import { HiOutlineGlobeAlt } from 'react-icons/hi'

interface CountryData {
    name: string
    code: string
}

interface Country {
    label: string
    value: string
}

function getCountrys(data: CountryData[]): Country[] {
    const countrys: Country[] = []
    data.forEach((item) => {
        countrys.push({ label: item.name, value: item.name })
    })
    return countrys
}

const countrysOptions = getCountrys(countrys)

const CountrySelector = ({ selectedCountry, setSelectedCountry }: any) => {
    const handleChange = (selectedOption: any) => {
        setSelectedCountry(selectedOption)
    }

    return (
        <Select
            id="country-selector"
            value={selectedCountry}
            onChange={handleChange}
            options={countrysOptions}

            //menuPlacement='top'
        />
    )
}

export default CountrySelector
