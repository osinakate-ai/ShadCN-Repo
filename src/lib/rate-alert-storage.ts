/**
 * Rate alert storage — localStorage for now.
 * Future: replace with API calls, push subscription, etc.
 */

import type { RateAlert } from "./rate-alert-types"
import { RATE_ALERT_STORAGE_KEY } from "./rate-alert-types"

export function getStoredAlerts(): RateAlert[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RATE_ALERT_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RateAlert[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAlert(alert: Omit<RateAlert, "id" | "createdAt">): RateAlert {
  const id = crypto.randomUUID()
  const createdAt = Date.now()
  const full: RateAlert = { ...alert, id, createdAt }
  const alerts = getStoredAlerts()
  const filtered = alerts.filter((a) => !matchesPair(a, alert.base, alert.target))
  localStorage.setItem(RATE_ALERT_STORAGE_KEY, JSON.stringify([...filtered, full]))
  return full
}

export function updateAlert(id: string, updates: Partial<Pick<RateAlert, "rate" | "notifyAbove" | "triggeredAt">>): RateAlert | null {
  const alerts = getStoredAlerts()
  const idx = alerts.findIndex((a) => a.id === id)
  if (idx < 0) return null
  const updated = { ...alerts[idx], ...updates }
  alerts[idx] = updated
  localStorage.setItem(RATE_ALERT_STORAGE_KEY, JSON.stringify(alerts))
  return updated
}

export function deleteAlert(id: string): void {
  const alerts = getStoredAlerts().filter((a) => a.id !== id)
  localStorage.setItem(RATE_ALERT_STORAGE_KEY, JSON.stringify(alerts))
}

export function getAlertForPair(base: string, target: string): RateAlert | null {
  return getStoredAlerts().find((a) => matchesPair(a, base, target)) ?? null
}

function matchesPair(a: { base: string; target: string }, base: string, target: string): boolean {
  return a.base === base && a.target === target
}

export function markAlertTriggered(id: string): void {
  updateAlert(id, { triggeredAt: Date.now() })
}
