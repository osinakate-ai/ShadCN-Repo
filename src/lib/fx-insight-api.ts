/**
 * FX Insight API — fetches FxInsightData (mock or real).
 */

import type { FxInsightData, HistoricalRate } from "./fx-insight-types"
import { getExchangeRate } from "./fx-rates"

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export async function fetchFxInsightData(
  baseCurrency: string,
  targetCurrency: string
): Promise<FxInsightData> {
  const currentRate = await getExchangeRate(baseCurrency, targetCurrency)

  // Generate 7 days of historical rates (mock: slight random walk, last 2 days stable)
  const historicalRates: HistoricalRate[] = []
  let prev = currentRate
  for (let i = 6; i >= 0; i--) {
    const date = daysAgo(i)
    const isLastTwoDays = i <= 1
    const variation = isLastTwoDays
      ? (Math.random() - 0.5) * 0.002 * prev
      : (Math.random() - 0.5) * 0.02 * prev
    prev = prev - variation
    historicalRates.push({ date, rate: Number(prev.toFixed(6)) })
  }

  return {
    baseCurrency,
    targetCurrency,
    currentRate,
    historicalRates,
  }
}
