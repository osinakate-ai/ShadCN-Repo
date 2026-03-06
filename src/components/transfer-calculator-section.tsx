"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FxInsightWidget } from "@/components/fx-insight-widget"
import { RateAlertModal } from "@/components/rate-alert-modal"
import { RateAlertToast } from "@/components/rate-alert-toast"
import {
  getAlertForPair,
  getStoredAlerts,
  markAlertTriggered,
} from "@/lib/rate-alert-storage"
import type { RateAlert } from "@/lib/rate-alert-types"

function checkAlertTriggered(alert: RateAlert, currentRate: number): boolean {
  if (alert.triggeredAt) return false
  if (alert.notifyAbove) {
    return currentRate >= alert.rate
  }
  return currentRate <= alert.rate
}

export function TransferCalculatorSection() {
  const [alerts, setAlerts] = useState<RateAlert[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<RateAlert | null>(null)
  const [triggeredToast, setTriggeredToast] = useState<RateAlert | null>(null)
  const [fromCurrency, setFromCurrency] = useState<"EUR" | "USD" | "GBP" | "AUD" | "CAD">("EUR")
  const [toCurrency, setToCurrency] = useState<"EUR" | "USD" | "GBP" | "AUD" | "CAD">("USD")

  const refreshAlerts = useCallback(() => {
    setAlerts(getStoredAlerts())
  }, [])

  useEffect(() => {
    refreshAlerts()
    const handleStorage = () => refreshAlerts()
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [refreshAlerts])

  const handleRateUpdate = useCallback(
    (base: string, target: string, currentRate: number) => {
      setFromCurrency(base as typeof fromCurrency)
      setToCurrency(target as typeof toCurrency)
      const alert = getAlertForPair(base, target)
      if (!alert) return
      if (checkAlertTriggered(alert, currentRate)) {
        markAlertTriggered(alert.id)
        setTriggeredToast(alert)
        refreshAlerts()
      }
    },
    [refreshAlerts]
  )

  const activeAlert = getAlertForPair(fromCurrency, toCurrency)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Transfer calculator</h2>
      <FxInsightWidget
        onRateUpdate={handleRateUpdate}
        activeAlert={activeAlert}
      />
      <Button
        size="sm"
        variant="ghost"
        className="group mt-3 min-h-[72px] w-full justify-start gap-3 rounded-[14px] border-0 bg-transparent px-3 py-3 shadow-none transition-colors hover:bg-grey-300 dark:hover:bg-grey-300"
        data-set-alert
        onClick={() => {
          setEditingAlert(null)
          setModalOpen(true)
        }}
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-grey-300 bg-grey-200 group-hover:border-grey-400 group-hover:border-opacity-[0.65] group-hover:[&>svg]:text-brand-green-700 group-hover:[&>svg]:opacity-100">
          <Bell className="size-6 text-grey-700" strokeWidth={1.5} fill="none" />
        </div>
        <span className="text-sm text-grey-400 group-hover:font-bold group-hover:text-brand-green-700">Set alert</span>
      </Button>

      <RateAlertModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingAlert(null)
        }}
        defaultBase={fromCurrency}
        defaultTarget={toCurrency}
        editingAlert={editingAlert}
        onSaved={refreshAlerts}
      />

      {triggeredToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <RateAlertToast
            alert={triggeredToast}
            onDismiss={() => setTriggeredToast(null)}
            onSendMoney={() => {
              setTriggeredToast(null)
              // Could navigate to send flow
            }}
          />
        </div>
      )}
    </section>
  )
}
