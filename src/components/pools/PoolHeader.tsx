'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PoolDetails } from '@/types/pool'

export const PoolHeader = ({ pool }: { pool: PoolDetails }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{pool.project}</CardTitle>
          <p className="text-muted-foreground mt-1">{pool.symbol} • {pool.chain}</p>
        </div>
        <Badge variant="default">{pool.category}</Badge>
      </div>
    </CardHeader>
  </Card>
)
