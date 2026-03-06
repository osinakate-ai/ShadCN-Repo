/**
 * FX Insight types — for reference only, no financial advice.
 */

export type HistoricalRate = {
  date: string
  rate: number
}

export type FxInsightData = {
  baseCurrency: string
  targetCurrency: string
  currentRate: number
  historicalRates: HistoricalRate[] // last 7 days
}

export type TrendDirection = "up" | "down" | "stable"

export type VolatilityLevel = "low" | "high"

export type FxInsightCalculations = {
  sevenDayAverage: number
  percentageDiff: number
  trend: TrendDirection
  volatility: VolatilityLevel
  insightText: string
  stabilityHours?: number
  projectedNext2Days?: number[]
}

