"use client"

import type { FxAlert } from "./fx-alert-types"
import { getExchangeRate } from "./fx-rates"
import { notifyFxAlertTriggered } from "./notification-service"

const POLL_INTERVAL_MS = 60_000 // 1 minute (mock polling)

type AlertTriggerCallback = (alert: FxAlert, currentRate: number) => void

let pollIntervalId: ReturnType<typeof setInterval> | null = null
const triggerCallbacks: Set<AlertTriggerCallback> = new Set()

export function registerTriggerCallback(cb: AlertTriggerCallback): () => void {
  triggerCallbacks.add(cb)
  return () => triggerCallbacks.delete(cb)
}

async function checkAlerts(alerts: FxAlert[]): Promise<void> {
  const activeAlerts = alerts.filter((a) => a.isActive && !a.isTriggered)
  if (activeAlerts.length === 0) return

  for (const alert of activeAlerts) {
    try {
      const currentRate = await getExchangeRate(
        alert.baseCurrency,
        alert.targetCurrency
      )
      if (currentRate >= alert.targetRate) {
        notifyFxAlertTriggered(alert, currentRate)
        triggerCallbacks.forEach((cb) => cb(alert, currentRate))
      }
    } catch {
      // Silently ignore fetch errors in mock
    }
  }
}

export function startRateMonitor(getAlerts: () => FxAlert[]): () => void {
  if (pollIntervalId) clearInterval(pollIntervalId)

  const runCheck = () => checkAlerts(getAlerts())
  runCheck() // Initial check
  pollIntervalId = setInterval(runCheck, POLL_INTERVAL_MS)

  return () => {
    if (pollIntervalId) {
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }
  }
}
