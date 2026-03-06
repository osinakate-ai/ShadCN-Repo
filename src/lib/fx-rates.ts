/**
 * FX rates API — mock implementation.
 * Can be swapped for a real API (e.g. exchangerate-api.com) later.
 */

const MOCK_RATES: Record<string, Record<string, number>> = {
  "EUR-USD": { base: 1.08, volatility: 0.015 },
  "USD-EUR": { base: 0.926, volatility: 0.014 },
  "EUR-GBP": { base: 0.857, volatility: 0.012 },
  "GBP-EUR": { base: 1.167, volatility: 0.012 },
  "EUR-AUD": { base: 1.65, volatility: 0.02 },
  "AUD-EUR": { base: 0.606, volatility: 0.019 },
  "EUR-CAD": { base: 1.47, volatility: 0.018 },
  "CAD-EUR": { base: 0.68, volatility: 0.017 },
  "USD-GBP": { base: 0.793, volatility: 0.013 },
  "GBP-USD": { base: 1.261, volatility: 0.013 },
  "USD-AUD": { base: 1.528, volatility: 0.021 },
  "AUD-USD": { base: 0.655, volatility: 0.02 },
  "USD-CAD": { base: 1.361, volatility: 0.017 },
  "CAD-USD": { base: 0.735, volatility: 0.016 },
  "GBP-AUD": { base: 1.925, volatility: 0.022 },
  "AUD-GBP": { base: 0.52, volatility: 0.021 },
  "GBP-CAD": { base: 1.715, volatility: 0.019 },
  "CAD-GBP": { base: 0.583, volatility: 0.018 },
}

function getPairKey(base: string, target: string): string {
  return `${base}-${target}`
}

function randomVariation(base: number, volatility: number): number {
  const variation = (Math.random() - 0.5) * 2 * volatility * base
  return Number((base + variation).toFixed(6))
}

export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  const pair = getPairKey(baseCurrency, targetCurrency)
  const config = MOCK_RATES[pair]
  if (!config) {
    return randomVariation(1, 0.02)
  }
  return randomVariation(config.base, config.volatility)
}
