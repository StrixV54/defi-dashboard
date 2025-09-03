'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { PoolDetails, PoolChartData } from '@/types/pool'
import { fetchPoolDetails, fetchPoolChart, formatCurrency, formatPercentage } from '@/services/api'
import { useAppKitAccount } from '@reown/appkit/react'
import { ArrowLeft, TrendingUp, DollarSign, Activity, Lock, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export default function PoolPage() {
  const params = useParams()
  const router = useRouter()
  const poolId = params.id as string

  const [pool, setPool] = useState<PoolDetails | null>(null)
  const [chartData, setChartData] = useState<PoolChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLockDialog, setShowLockDialog] = useState(false)

  const { isConnected } = useAppKitAccount()

  useEffect(() => {
    if (poolId) {
      loadPoolData()
    }
  }, [poolId])

  const loadPoolData = async () => {
    try {
      setLoading(true)
      setError(null)

      const poolData = await fetchPoolDetails(poolId)

      if (!poolData) {
        setError('Pool not found')
        return
      }

      // Check if this is a locked pool
      if (poolData.category === 'Yield Aggregator' && !isConnected) {
        setShowLockDialog(true)
        return
      }

      setPool(poolData)

      // Load chart data
      setChartLoading(true)
      try {
        const chartData = await fetchPoolChart(poolId)
        setChartData(chartData)
      } catch (chartError) {
        console.error('Failed to load chart data:', chartError)
        // Don't set error for chart failure, just log it
      } finally {
        setChartLoading(false)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pool data')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryBadgeVariant = (category?: string) => {
    switch (category) {
      case 'Lending':
        return 'default'
      case 'Liquid Staking':
        return 'secondary'
      case 'Yield Aggregator':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatChartData = (data: PoolChartData[]) => {
    return data.map(item => ({
      date: format(new Date(item.timestamp), 'MMM yyyy'),
      apy: item.apy,
      fullDate: format(new Date(item.timestamp), 'MMM dd, yyyy')
    }))
  }

  const renderPoolDetails = () => {
    if (!pool) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Value Locked</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(pool.tvlUsd)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Current APY</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {pool.apy ? formatPercentage(pool.apy) : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">30d Average APY</span>
            </div>
            <p className="text-2xl font-bold">
              {pool.apyMean30d ? formatPercentage(pool.apyMean30d) : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Risk Score (σ)</span>
            </div>
            <p className="text-2xl font-bold">
              {pool.sigma ? pool.sigma.toFixed(3) : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderChart = () => {
    if (chartLoading) {
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

    const formattedData = formatChartData(chartData)

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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button onClick={loadPoolData} variant="outline">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pools
        </Button>

        {pool && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{pool.project}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {pool.symbol} • {pool.chain}
                    </p>
                  </div>
                  <Badge variant={getCategoryBadgeVariant(pool.category)}>
                    {pool.category}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {renderPoolDetails()}
            {renderChart()}
          </>
        )}
      </div>

      <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Connect Wallet Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              This Yield Aggregator pool is locked until you connect a crypto wallet.
              Please connect your wallet to access this investment opportunity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.back()}>
              Go Back
            </AlertDialogCancel>
            <Button onClick={() => {
              setShowLockDialog(false)
              // Trigger wallet connection modal
              document.querySelector('appkit-button')?.click()
            }}>
              Connect Wallet
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
