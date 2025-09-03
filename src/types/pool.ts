// Pool data types based on DeFiLlama API structure
export interface Pool {
  pool: string // Pool ID
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy?: number
  apyMean30d?: number
  prediction?: number
  sigma?: number
  category?: PoolCategory
}

export interface PoolChartData {
  timestamp: string
  apy: number
}

export interface PoolDetails extends Pool {
  apyBase?: number
  apyReward?: number
  rewardTokens?: string[]
  underlyingTokens?: string[]
  poolMeta?: string
  url?: string
  apyPct1D?: number
  apyPct7D?: number
  apyPct30D?: number
  stablecoin?: boolean
  ilRisk?: string
  exposure?: string
  predictions?: {
    predictedClass?: string
    predictedProbability?: number
    binnedConfidence?: number
  }
}

export type PoolCategory = 'Lending' | 'Liquid Staking' | 'Yield Aggregator'

export interface PoolFilter {
  category?: PoolCategory
  minTvl?: number
  maxTvl?: number
  minApy?: number
  maxApy?: number
}

// Specific pool IDs from the assignment
export const SPECIFIC_POOLS = {
  lending: [
    'db678df9-3281-4bc2-a8bb-01160ffd6d48', // aave-v3
    'c1ca08e4-d618-415e-ad63-fcec58705469', // compound-v3
    '8edfdf02-cdbb-43f7-bca6-954e5fe56813'  // maple
  ],
  liquidStaking: [
    '747c1d2a-c668-4682-b9f9-296708a3dd90', // lido
    '80b8bf92-b953-4c20-98ea-c9653ef2bb98', // binance-staked-eth
    '90bfb3c2-5d35-4959-a275-ba5085b08aa3'  // stader
  ],
  yieldAggregator: [
    '107fb915-ab29-475b-b526-d0ed0d3e6110', // cian-yield-layer
    '05a3d186-2d42-4e21-b1f0-68c079d22677', // yearn-finance
    '1977885c-d5ae-4c9e-b4df-863b7e1578e6'  // beefy
  ]
}

export const POOL_CATEGORIES: PoolCategory[] = ['Lending', 'Liquid Staking', 'Yield Aggregator']
