import axios from 'axios'
import { Pool, PoolChartData, PoolDetails, PoolCategory, SPECIFIC_POOLS } from '@/types/pool'
import { format, subMonths, startOfMonth } from 'date-fns'

const API_BASE_URL = 'https://yields.llama.fi'

// Create axios instance with proper error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
})

/**
 * Fetch all pools from DeFiLlama API
 */
export async function fetchAllPools(): Promise<Pool[]> {
  try {
    const response = await api.get('/pools')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching pools:', error)
    throw error
  }
}

/**
 * Fetch specific pools based on the assignment requirements
 */
export async function fetchSpecificPools(): Promise<Pool[]> {
  try {
    const allPools = await fetchAllPools()
    const poolMap = new Map<string, Pool>()

    // Create a map for quick lookup
    allPools.forEach(pool => {
      poolMap.set(pool.pool, pool)
    })

    const categorizedPools: Pool[] = []

    // Add lending pools
    SPECIFIC_POOLS.lending.forEach(poolId => {
      const pool = poolMap.get(poolId)
      if (pool) {
        categorizedPools.push({ ...pool, category: 'Lending' })
      }
    })

    // Add liquid staking pools
    SPECIFIC_POOLS.liquidStaking.forEach(poolId => {
      const pool = poolMap.get(poolId)
      if (pool) {
        categorizedPools.push({ ...pool, category: 'Liquid Staking' })
      }
    })

    // Add yield aggregator pools
    SPECIFIC_POOLS.yieldAggregator.forEach(poolId => {
      const pool = poolMap.get(poolId)
      if (pool) {
        categorizedPools.push({ ...pool, category: 'Yield Aggregator' })
      }
    })

    return categorizedPools
  } catch (error) {
    console.error('Error fetching specific pools:', error)
    throw error
  }
}

/**
 * Fetch pool details by ID
 */
export async function fetchPoolDetails(poolId: string): Promise<PoolDetails | null> {
  try {
    const allPools = await fetchAllPools()
    const pool = allPools.find(p => p.pool === poolId)

    if (!pool) {
      throw new Error(`Pool with ID ${poolId} not found`)
    }

    // Determine category based on specific pools mapping
    let category: PoolCategory | undefined
    if (SPECIFIC_POOLS.lending.includes(poolId)) {
      category = 'Lending'
    } else if (SPECIFIC_POOLS.liquidStaking.includes(poolId)) {
      category = 'Liquid Staking'
    } else if (SPECIFIC_POOLS.yieldAggregator.includes(poolId)) {
      category = 'Yield Aggregator'
    }

    return { ...pool, category } as PoolDetails
  } catch (error) {
    console.error('Error fetching pool details:', error)
    throw error
  }
}

/**
 * Fetch historical APY data for a specific pool
 */
export async function fetchPoolChart(poolId: string): Promise<PoolChartData[]> {
  try {
    const response = await api.get(`/chart/${poolId}`)
    const rawData = response.data.data || []

    // Process data to get first day of each month for last 12 months
    const twelveMonthsAgo = subMonths(new Date(), 12)

    // Group data by month and get first day of each month
    const monthlyMap = new Map<string, PoolChartData>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawData.forEach((item: any) => {
      const date = new Date(item.timestamp)
      if (date >= twelveMonthsAgo) {
        const monthKey = format(startOfMonth(date), 'yyyy-MM')

        // Keep only the first occurrence of each month (closest to 1st day)
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            timestamp: item.timestamp,
            apy: item.apy || 0
          })
        }
      }
    })

    // Convert map to array and sort by timestamp
    return Array.from(monthlyMap.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  } catch (error) {
    console.error('Error fetching pool chart:', error)
    throw error
  }
}

/**
 * Filter pools by category
 */
export function filterPoolsByCategory(pools: Pool[], category?: PoolCategory): Pool[] {
  if (!category) return pools
  return pools.filter(pool => pool.category === category)
}

/**
 * Format currency values
 */
export function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}
