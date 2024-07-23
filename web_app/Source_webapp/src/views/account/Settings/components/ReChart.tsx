import { Loading } from '@/components/shared'
import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

export default function Chart({
    data,
    loading,
}: {
    data: any[]
    loading: boolean
}) {
    return (
        <ResponsiveContainer width={'100%'} height={400}>
            {data.length === 0 && loading == false && (
                <h1
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: '2rem',
                        color: '#ffffff',
                    }}
                >
                    Data not found
                </h1>
            )}
            {data.length > 0 && loading == false && (
                <LineChart
                    data={data}
                    margin={{
                        right: 30,
                        left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="1 1" strokeOpacity={0.2} />
                    <XAxis dataKey="insertDate" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            background: '#111827',
                            borderRadius: '1rem',
                        }}
                    />
                    <Legend />
                    <Line
                        dot={{ r: 0 }}
                        type="monotone"
                        dataKey="Humidity"
                        stroke="cyan"
                    />
                    <Line
                        dot={{ r: 0 }}
                        type="monotone"
                        dataKey="Temperature"
                        stroke="#ff4800"
                    />
                </LineChart>
            )}

            {loading == true && <Loading loading={true} />}
        </ResponsiveContainer>
    )
}
