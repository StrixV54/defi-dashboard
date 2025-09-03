'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock } from 'lucide-react'
import { PoolCategory, POOL_CATEGORIES } from '@/types/pool'

interface PoolFiltersProps {
  selectedCategory: PoolCategory
  onCategoryChange: (category: PoolCategory) => void
  isWalletConnected: boolean
}

export const PoolFilters = ({ selectedCategory, onCategoryChange, isWalletConnected }: PoolFiltersProps) => {
  return (
    <Tabs value={selectedCategory} onValueChange={(value) => onCategoryChange(value as PoolCategory)} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-10 rounded-md">
        {POOL_CATEGORIES.map((category) => {
          const isLocked = category === 'Yield Aggregator' && !isWalletConnected
          return (
            <TabsTrigger
              key={category}
              value={category}
              title={isLocked ? 'Connect Wallet to Access!!' : category}
              className={`text-sm font-medium transition-all ${isLocked ? 'cursor-not-allowed' : ''}`}
            >
              {isLocked && <Lock className="h-3 w-3 mr-1" />}
              {category}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
