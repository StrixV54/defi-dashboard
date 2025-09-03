'use client'

import { useRouter } from 'next/navigation'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Lock } from 'lucide-react'
import { Pool } from '@/types/pool'
import { formatCurrency, formatPercentage } from '@/services/api'

interface PoolRowProps {
  pool: Pool
  isWalletConnected: boolean
  onLockedPoolClick: () => void
}

export const PoolRow = ({ pool, isWalletConnected, onLockedPoolClick }: PoolRowProps) => {
  const router = useRouter()
  const isLocked = pool.category === 'Yield Aggregator' && !isWalletConnected

  const handleClick = () => isLocked ? onLockedPoolClick() : router.push(`/pool/${pool.pool}`)

  return (
    <TableRow
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${isLocked ? 'opacity-60' : ''}`}
      onClick={handleClick}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          {pool.project}
        </div>
      </TableCell>
      <TableCell><Badge variant="default">{pool.category}</Badge></TableCell>
      <TableCell className="font-mono text-sm">{pool.symbol}</TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(pool.tvlUsd)}</TableCell>
      <TableCell className="text-right">
        {pool.apy ? (
          <div className="flex items-center justify-end gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            {formatPercentage(pool.apy)}
          </div>
        ) : 'N/A'}
      </TableCell>
      <TableCell className="text-right">{pool.apyMean30d ? formatPercentage(pool.apyMean30d) : 'N/A'}</TableCell>
      <TableCell className="text-right">{pool.prediction ? formatPercentage(pool.prediction) : 'N/A'}</TableCell>
      <TableCell className="text-right font-mono text-sm">{pool.sigma ? pool.sigma.toFixed(3) : 'N/A'}</TableCell>
    </TableRow>
  )
}
