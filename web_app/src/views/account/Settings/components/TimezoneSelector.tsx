import React, { useState, useEffect } from 'react'
import timezones from './timezone.json' // Ensure you have a JSON file with time zone data or use any available time zone library
import { Select } from '@/components/ui'

interface TimeZoneData {
    value: string
    abbr: string
    offset: number
    isdst: boolean
    text: string
    utc: string[]
}

interface TimeZone {
    label: string
    value: string
}

function getTimeZones(data: TimeZoneData[]): TimeZone[] {
    const timeZones: TimeZone[] = []
    data.forEach((item) => {
        item.utc.forEach((zone) => {
            timeZones.push({ label: zone, value: zone })
        })
    })
    return timeZones
}

export function convertToTimeZone(
    date: Date | string,
    timeZone: string
): string {
    // Convert the input to a Date object if it's a string
    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    // Use Intl.DateTimeFormat to format the date in the specified time zone
    const options: Intl.DateTimeFormatOptions = {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }

    const formatter = new Intl.DateTimeFormat([], options)
    const parts = formatter.formatToParts(date)

    // Extract the formatted parts and build the formatted date string
    const formattedDate = parts
        .map(({ type, value }) => {
            switch (type) {
                case 'year':
                case 'month':
                case 'day':
                case 'hour':
                case 'minute':
                case 'second':
                    return value
                case 'literal':
                    return value
                default:
                    return ''
            }
        })
        .join('')

    return formattedDate
}

const timeZoneOptions = getTimeZones(timezones)

const TimeZoneSelector = ({ selectedTimeZone, setSelectedTimeZone }: any) => {
    useEffect(() => {
        if (!selectedTimeZone) {
            const userTimeZone =
                Intl.DateTimeFormat().resolvedOptions().timeZone
            setSelectedTimeZone({ value: userTimeZone, label: userTimeZone })
        }
    }, [])

    const handleChange = (selectedOption: any) => {
        setSelectedTimeZone(selectedOption)
    }

    return (
        <Select
            id="time-zone-selector"
            value={selectedTimeZone}
            onChange={handleChange}
            options={timeZoneOptions}
            //menuPlacement='top'
        />
    )
}

export default TimeZoneSelector
