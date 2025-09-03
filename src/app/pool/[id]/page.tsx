'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { WalletConnectDialog } from '@/components/ui/wallet-connect-dialog'
import { PoolHeader } from '@/components/pools/PoolHeader'
import { PoolStats } from '@/components/pools/PoolStats'
import { PoolChart } from '@/components/pools/PoolChart'
import { PoolDetails, PoolChartData } from '@/types/pool'
import { fetchPoolDetails, fetchPoolChart } from '@/services/api'
import { useAppKitAccount } from '@reown/appkit/react'
import { ArrowLeft } from 'lucide-react'

export default function PoolPage() {
  const params = useParams()
  const router = useRouter()
  const poolId = params.id as string
  const { isConnected } = useAppKitAccount()

  const [pool, setPool] = useState<PoolDetails | null>(null)
  const [chartData, setChartData] = useState<PoolChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLockDialog, setShowLockDialog] = useState(false)

  useEffect(() => {
    if (!poolId) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const poolData = await fetchPoolDetails(poolId)
        if (!poolData) {
          setError('Pool not found')
          return
        }

        if (poolData.category === 'Yield Aggregator' && !isConnected) {
          setShowLockDialog(true)
          return
        }

        setPool(poolData)

        setChartLoading(true)
        try {
          const data = await fetchPoolChart(poolId)
          setChartData(data)
        } catch (e) {
          console.error('Chart data failed:', e)
        } finally {
          setChartLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pool')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [poolId, isConnected])



  const LoadingSkeleton = () => (
    <div className="container mx-auto p-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />Back
      </Button>
      <div className="space-y-6">
        <Card><CardContent className="p-6"><Skeleton className="h-8 w-48" /></CardContent></Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent><Skeleton className="h-80 w-full" /></CardContent></Card>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) return <LoadingSkeleton />

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
            <PoolHeader pool={pool} />
            <PoolStats pool={pool} />
            <PoolChart chartData={chartData} isLoading={chartLoading} />
          </>
        )}
      </div>

      <WalletConnectDialog
        isOpen={showLockDialog}
        onClose={() => setShowLockDialog(false)}
        title="Connect Wallet Required"
        description="This Yield Aggregator pool is locked until you connect a crypto wallet."
      />
    </>
  )
}
