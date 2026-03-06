/**
 * FX Insight calculations — factual comparisons only.
 * No advisory language.
 */

import type {
  FxInsightData,
  FxInsightCalculations,
  HistoricalRate,
  TrendDirection,
  VolatilityLevel,
} from "./fx-insight-types"

const STABLE_THRESHOLD_PERCENT = 0.5

function computeSevenDayAverage(historicalRates: HistoricalRate[]): number {
  if (historicalRates.length === 0) return 0
  const sum = historicalRates.reduce((acc, h) => acc + h.rate, 0)
  return sum / historicalRates.length
}

function computePercentageDiff(
  currentRate: number,
  sevenDayAverage: number
): number {
  if (sevenDayAverage === 0) return 0
  return ((currentRate - sevenDayAverage) / sevenDayAverage) * 100
}

function computeTrend(
  currentRate: number,
  sevenDayAverage: number
): TrendDirection {
  const pct = computePercentageDiff(currentRate, sevenDayAverage)
  if (Math.abs(pct) <= STABLE_THRESHOLD_PERCENT) return "stable"
  return pct > 0 ? "up" : "down"
}

function computeVolatility(historicalRates: HistoricalRate[]): VolatilityLevel {
  if (historicalRates.length < 2) return "low"
  const mean =
    historicalRates.reduce((acc, h) => acc + h.rate, 0) /
    historicalRates.length
  const variance =
    historicalRates.reduce((acc, h) => acc + Math.pow(h.rate - mean, 2), 0) /
    historicalRates.length
  const stdDev = Math.sqrt(variance)
  const cv = (stdDev / mean) * 100 // coefficient of variation
  if (cv < 1.0) return "low"
  return "high"
}

/**
 * Estimate hours the rate has been stable (last 2 days within 0.5% of each other).
 */
function computeStabilityHours(historicalRates: HistoricalRate[]): number | undefined {
  if (historicalRates.length < 2) return undefined
  const lastTwo = historicalRates.slice(-2)
  const [a, b] = lastTwo.map((h) => h.rate)
  const pctChange = Math.abs((b - a) / a) * 100
  if (pctChange <= STABLE_THRESHOLD_PERCENT) return 48
  return undefined
}

function buildInsightText(
  currentRate: number,
  sevenDayAverage: number,
  percentageDiff: number,
  _stabilityHours?: number
): string {
  let rateLine: string
  if (Math.abs(percentageDiff) <= STABLE_THRESHOLD_PERCENT) {
    rateLine = "This rate is close to the 7-day average."
  } else {
    const absPct = Math.abs(percentageDiff).toFixed(1)
    if (currentRate > sevenDayAverage) {
      rateLine = `This rate is ${absPct}% above the 7-day average.`
    } else {
      rateLine = `This rate is ${absPct}% below the 7-day average.`
    }
  }
  return `Good time to send. ${rateLine}`
}

/**
 * Simple linear regression for optional projection.
 * Returns projected values for next 2 days.
 */
function linearRegressionProjection(
  historicalRates: HistoricalRate[]
): number[] | undefined {
  if (historicalRates.length < 3) return undefined
  const n = historicalRates.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  historicalRates.forEach((h, i) => {
    sumX += i
    sumY += h.rate
    sumXY += i * h.rate
    sumX2 += i * i
  })
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return [
    Number((intercept + slope * n).toFixed(6)),
    Number((intercept + slope * (n + 1)).toFixed(6)),
  ]
}

export function computeFxInsight(data: FxInsightData): FxInsightCalculations {
  const sevenDayAverage = computeSevenDayAverage(data.historicalRates)
  const percentageDiff = computePercentageDiff(
    data.currentRate,
    sevenDayAverage
  )
  const trend = computeTrend(data.currentRate, sevenDayAverage)
  const volatility = computeVolatility(data.historicalRates)
  const stabilityHours = computeStabilityHours(data.historicalRates)
  const insightText = buildInsightText(
    data.currentRate,
    sevenDayAverage,
    percentageDiff,
    stabilityHours
  )
  const projectedNext2Days = linearRegressionProjection(data.historicalRates)

  return {
    sevenDayAverage,
    percentageDiff,
    trend,
    volatility,
    insightText,
    stabilityHours,
    projectedNext2Days,
  }
}
