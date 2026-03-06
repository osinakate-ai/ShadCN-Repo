"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CURRENCIES, CURRENCY_FLAGS } from "@/lib/currency-settings"
import { saveAlert, updateAlert } from "@/lib/rate-alert-storage"
import type { RateAlert } from "@/lib/rate-alert-types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultBase?: string
  defaultTarget?: string
  editingAlert?: RateAlert | null
  onSaved: () => void
}

export function RateAlertModal({
  open,
  onOpenChange,
  defaultBase = "EUR",
  defaultTarget = "USD",
  editingAlert,
  onSaved,
}: Props) {
  const [base, setBase] = useState(defaultBase)
  const [target, setTarget] = useState(defaultTarget)
  const [rate, setRate] = useState("")
  const [notifyAbove, setNotifyAbove] = useState(true)

  useEffect(() => {
    if (open) {
      setBase(editingAlert?.base ?? defaultBase)
      setTarget(editingAlert?.target ?? defaultTarget)
      setRate(editingAlert != null ? String(editingAlert.rate) : "")
      setNotifyAbove(editingAlert?.notifyAbove ?? true)
    }
  }, [open, editingAlert, defaultBase, defaultTarget])

  const handleCreate = () => {
    const rateNum = parseFloat(rate)
    if (!Number.isFinite(rateNum) || rateNum <= 0) return
    if (editingAlert) {
      updateAlert(editingAlert.id, { rate: rateNum, notifyAbove })
    } else {
      saveAlert({ base, target, rate: rateNum, notifyAbove })
    }
    onSaved()
    onOpenChange(false)
  }

  const isValid = rate.trim() !== "" && parseFloat(rate) > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-0">
          <DialogTitle>Set exchange rate alert</DialogTitle>
          <DialogDescription>
            Get notified when the exchange rate reaches your target.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-[16px] font-medium text-grey-700">Notify me when:</p>
            <div className="flex h-[56px] items-center gap-2">
              <div className="flex h-full min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-grey-400 bg-background dark:bg-transparent px-3 focus-within:border-brand-green-700">
                <span className="text-[18px] font-semibold text-grey-700 shrink-0">1</span>
                <div className="relative flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-grey-100 px-3 py-1.5">
                  <select
                    value={base}
                    onChange={(e) => setBase(e.target.value as (typeof CURRENCIES)[number])}
                    disabled={!!editingAlert}
                    className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent text-transparent outline-none disabled:cursor-not-allowed"
                    aria-label={`Base currency: ${base}`}
                  >
                    {CURRENCIES.filter((c) => c !== target).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Image
                    src={CURRENCY_FLAGS[base as (typeof CURRENCIES)[number]]}
                    alt=""
                    width={20}
                    height={14}
                    className="relative z-10 size-5 shrink-0 rounded-full object-cover"
                  />
                  <span className="relative z-10 shrink-0 whitespace-nowrap pointer-events-none text-base font-semibold text-grey-700">{base}</span>
                  <ChevronDown className="relative z-10 size-4 shrink-0 pointer-events-none text-grey-700" />
                </div>
              </div>
              <span className="text-[18px] font-semibold text-grey-700 shrink-0">=</span>
              <div className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-xl border border-grey-400 bg-background dark:bg-transparent px-3 focus-within:border-brand-green-700">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="1.10"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="h-auto min-w-0 flex-1 border-0 p-0 text-left text-[18px] font-semibold text-grey-700 focus-visible:ring-0"
                />
                <div className="relative flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-grey-100 px-3 py-1.5">
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value as (typeof CURRENCIES)[number])}
                    disabled={!!editingAlert}
                    className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent text-transparent outline-none disabled:cursor-not-allowed"
                    aria-label={`Target currency: ${target}`}
                  >
                    {CURRENCIES.filter((c) => c !== base).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Image
                    src={CURRENCY_FLAGS[target as (typeof CURRENCIES)[number]]}
                    alt=""
                    width={20}
                    height={14}
                    className="relative z-10 size-5 shrink-0 rounded-full object-cover"
                  />
                  <span className="relative z-10 shrink-0 whitespace-nowrap pointer-events-none text-base font-semibold text-grey-700">{target}</span>
                  <ChevronDown className="relative z-10 size-4 shrink-0 pointer-events-none text-grey-700" />
                </div>
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyAbove}
              onChange={(e) => setNotifyAbove(e.target.checked)}
              className="size-4 rounded border-grey-400"
            />
            <span className="text-sm text-grey-700">Notify if the rate goes above this value</span>
          </label>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            className="h-12 w-full text-[16px]"
            onClick={handleCreate}
            disabled={!isValid}
          >
            {editingAlert ? "Update alert" : "Create alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
