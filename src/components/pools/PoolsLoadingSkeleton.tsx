'use client'

import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export const PoolsLoadingSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }, (_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 8 }, (_, j) => (
          <TableCell key={j}>
            <Skeleton className={`h-5 flex-1 rounded-sm`} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)
