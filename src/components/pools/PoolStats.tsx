'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react'
import { PoolDetails } from '@/types/pool'
import { formatCurrency, formatPercentage } from '@/services/api'

const StatCard = ({ icon, label, value, iconColor }: { icon: React.ReactNode, label: string, value: string, iconColor?: string }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={iconColor}>{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
)

export const PoolStats = ({ pool }: { pool: PoolDetails }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatCard
      icon={<DollarSign className="h-4 w-4" />}
      label="Total Value Locked"
      value={formatCurrency(pool.tvlUsd)}
      iconColor="text-muted-foreground"
    />
    <StatCard
      icon={<TrendingUp className="h-4 w-4" />}
      label="Current APY"
      value={pool.apy ? formatPercentage(pool.apy) : 'N/A'}
      iconColor="text-green-500"
    />
    <StatCard
      icon={<Activity className="h-4 w-4" />}
      label="30d Average APY"
      value={pool.apyMean30d ? formatPercentage(pool.apyMean30d) : 'N/A'}
      iconColor="text-blue-500"
    />
    <StatCard
      icon={<BarChart3 className="h-4 w-4" />}
      label="Risk Score (σ)"
      value={pool.sigma ? pool.sigma.toFixed(3) : 'N/A'}
      iconColor="text-purple-500"
    />
  </div>
)
