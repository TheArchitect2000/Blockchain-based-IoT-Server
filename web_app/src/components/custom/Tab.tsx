import { useAppSelector } from '@/store'
import React, { useState } from 'react'

interface Tab {
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [selectedTab, setSelectedTab] = useState(0)

    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel
    )

    return (
        <div className="w-full">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 focus:outline-none ${
                            selectedTab === index
                                ? `border-b-2 border-${themeColor}-${primaryColorLevel} text-${themeColor}-${primaryColorLevel}`
                                : 'text-gray-500'
                        }`}
                        style={{ textWrap: 'nowrap' }}
                        onMouseEnter={() => setSelectedTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="py-2">{tabs[selectedTab].content}</div>
        </div>
    )
}

export default Tabs
