'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { PoolChartData } from '@/types/pool'

interface PoolChartProps {
  chartData: PoolChartData[]
  isLoading: boolean
}

export const PoolChart = ({ chartData, isLoading }: PoolChartProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical APY (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical APY (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No historical data available for this pool
          </div>
        </CardContent>
      </Card>
    )
  }

  const formattedData = chartData.map(item => ({
    date: format(new Date(item.timestamp), 'MMM yyyy'),
    apy: item.apy,
    fullDate: format(new Date(item.timestamp), 'MMM dd, yyyy')
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Historical APY (Last 12 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'APY']}
              labelFormatter={(label, payload) =>
                payload && payload[0] ? payload[0].payload.fullDate : label
              }
            />
            <Line
              type="monotone"
              dataKey="apy"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 3, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
