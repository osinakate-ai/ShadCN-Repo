"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RateAlert } from "@/lib/rate-alert-types"

type Props = {
  alert: RateAlert
  onDismiss: () => void
  onSendMoney?: () => void
}

export function RateAlertToast({ alert, onDismiss, onSendMoney }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-background p-4 shadow-lg",
        "animate-in slide-in-from-top-2 duration-300"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
          <Bell className="size-5 text-grey-700" strokeWidth={1.5} fill="none" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Rate alert triggered!</p>
          <p className="text-sm text-muted-foreground">
            {alert.base} → {alert.target} has reached {alert.rate.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {onSendMoney && (
          <Button size="sm" onClick={onSendMoney}>
            Send money
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}
