"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RateAlertModal } from "@/components/rate-alert-modal"
import { getStoredAlerts, deleteAlert } from "@/lib/rate-alert-storage"
import type { RateAlert } from "@/lib/rate-alert-types"

export default function InsightsPage() {
  const [alerts, setAlerts] = useState<RateAlert[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<RateAlert | null>(null)

  const refreshAlerts = useCallback(() => {
    setAlerts(getStoredAlerts())
  }, [])

  useEffect(() => {
    refreshAlerts()
    const handleStorage = () => refreshAlerts()
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [refreshAlerts])

  const activeAlerts = alerts.filter((a) => !a.triggeredAt)

  return (
    <div className="mx-auto w-full max-w-[976px] flex flex-1 flex-col gap-6 px-6 pb-6 pt-[56px]">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Active alerts</h2>
        <ul className="rounded-lg bg-transparent">
          {activeAlerts.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              No active alerts. Set an alert to get notified when the exchange rate reaches your target.
            </li>
          ) : (
            activeAlerts.map((alert) => (
              <li key={alert.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                  <Bell className="size-6 text-grey-700" strokeWidth={1.5} fill="none" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    Notify when 1 {alert.base} = {alert.rate.toFixed(2)} {alert.target}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {alert.notifyAbove ? "Notify when rate goes above" : "Notify when rate goes below"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingAlert(alert)
                      setModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      deleteAlert(alert.id)
                      refreshAlerts()
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="group/add-alert flex min-h-[72px] w-full shrink-0 rounded-[14px] border border-dashed border-grey-300 transition-colors hover:border-grey-400" data-add-alert>
          <button
            type="button"
            className="flex min-h-[72px] flex-1 flex-row items-center gap-3 rounded-[13px] bg-transparent px-3 py-3 text-left transition-colors hover:bg-grey-300"
            onClick={() => {
              setEditingAlert(null)
              setModalOpen(true)
            }}
            aria-label="Add alert"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-grey-300 bg-grey-200 group-hover/add-alert:border-grey-400 group-hover/add-alert:border-opacity-[0.65] group-hover/add-alert:[&>svg]:text-brand-green-700 group-hover/add-alert:[&>svg]:opacity-100">
              <Plus className="size-6 text-grey-700" strokeWidth={2} />
            </div>
            <p className="text-sm text-grey-400 group-hover/add-alert:font-bold group-hover/add-alert:text-brand-green-700">
              Add alert
            </p>
          </button>
        </div>
      </section>

      <RateAlertModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingAlert(null)
        }}
        defaultBase="EUR"
        defaultTarget="USD"
        editingAlert={editingAlert}
        onSaved={refreshAlerts}
      />
    </div>
  )
}
