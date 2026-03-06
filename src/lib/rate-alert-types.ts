/**
 * Rate alert types — for FX rate monitoring.
 * Future-proof: can be connected to real FX API, push notifications, background monitoring.
 */

export type RateAlert = {
  id: string
  base: string
  target: string
  rate: number
  notifyAbove: boolean
  createdAt: number
  triggeredAt?: number
}

export const RATE_ALERT_STORAGE_KEY = "fx-rate-alerts"
