"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, LockOpen, ArrowDownUp, ChevronDown } from "lucide-react"
import { CURRENCIES, CURRENCY_FLAGS } from "@/lib/currency-settings"
import { fetchFxInsightData } from "@/lib/fx-insight-api"
import { computeFxInsight } from "@/lib/fx-insight-calculations"
import type { FxInsightData } from "@/lib/fx-insight-types"
import type { RateAlert } from "@/lib/rate-alert-types"
import { cn } from "@/lib/utils"

const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const LOCK_DURATION_SEC = 15 * 60 // 15 minutes

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, "0")
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  return `${day}.${month}`
}

function formatDateTooltip(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.toLocaleDateString("en", { month: "short" })
  return `${day} ${month}`
}

function formatLockTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

const CLOSE_THRESHOLD_PERCENT = 0.5

type FxInsightWidgetProps = {
  onRateUpdate?: (base: string, target: string, rate: number) => void
  activeAlert?: RateAlert | null
}

export function FxInsightWidget({ onRateUpdate, activeAlert }: FxInsightWidgetProps = {}) {
  const [fromCurrency, setFromCurrency] = useState<"EUR" | "USD" | "GBP" | "AUD" | "CAD">("EUR")
  const [toCurrency, setToCurrency] = useState<"EUR" | "USD" | "GBP" | "AUD" | "CAD">("USD")
  const [amount, setAmount] = useState("1000")
  const [data, setData] = useState<FxInsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lockedRate, setLockedRate] = useState<number | null>(null)
  const [lockSecondsLeft, setLockSecondsLeft] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const load = useCallback(async () => {
    const base = fromCurrency
    const target = toCurrency
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFxInsightData(base, target)
      setData(result)
      onRateUpdate?.(base, target, result.currentRate)
    } catch (e) {
      setError("Unable to load FX data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [fromCurrency, toCurrency, onRateUpdate])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const id = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [load])

  useEffect(() => {
    if (lockSecondsLeft == null || lockSecondsLeft <= 0) return
    const id = setInterval(() => {
      setLockSecondsLeft((s) => (s == null || s <= 1 ? null : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [lockSecondsLeft])

  const displayRate = lockedRate ?? data?.currentRate ?? 0
  const isLocked = lockedRate != null && lockSecondsLeft != null && lockSecondsLeft > 0

  const amountNum = parseFloat(amount) || 0
  const convertedAmount = amountNum * displayRate

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleLockRate = () => {
    if (isLocked) {
      setLockedRate(null)
      setLockSecondsLeft(null)
    } else if (data) {
      setLockedRate(data.currentRate)
      setLockSecondsLeft(LOCK_DURATION_SEC)
    }
  }

  useEffect(() => {
    if (lockSecondsLeft === 0) setLockedRate(null)
  }, [lockSecondsLeft])

  const calc = data ? computeFxInsight(data) : null
  const baseChartData = data?.historicalRates.map((h) => ({
    date: formatDate(h.date),
    rawDate: h.date,
    rate: h.rate,
    projected: null as number | null,
  })) ?? []

  const projectedRates = calc?.projectedNext2Days ?? []
  const hasProjection = baseChartData.length > 0 && projectedRates.length > 0
  const lastPoint = baseChartData[baseChartData.length - 1]

  const today = new Date()
  const chartWithProjection = hasProjection && lastPoint
    ? [
        ...baseChartData.slice(0, -1),
        { ...lastPoint, projected: lastPoint.rate },
        ...projectedRates.map((rate, i) => {
          const d = new Date(today)
          d.setDate(d.getDate() + i + 1)
          return {
            date: `+${i + 1}d`,
            rawDate: d.toISOString(),
            rate: null as number | null,
            projected: rate,
          }
        }),
      ]
    : baseChartData

  const allChartData = chartWithProjection
  const lastHistoricalIndex = baseChartData.length - 1

  const todayFormatted = formatDate(new Date().toISOString())

  const xAxisTicks = allChartData.map((d) => d.date)
  const labelValues = new Set([
    allChartData[0]?.date,
    allChartData[lastHistoricalIndex]?.date,
    allChartData[allChartData.length - 2]?.date,
    allChartData[allChartData.length - 1]?.date,
  ].filter(Boolean))

  const XAxisTick = (props: { x?: number | string; y?: number | string; payload?: { value?: string } }) => {
    const { x, y, payload } = props
    const xNum = typeof x === "number" ? x : parseFloat(String(x))
    const yNum = typeof y === "number" ? y : parseFloat(String(y))
    if (Number.isNaN(xNum) || Number.isNaN(yNum)) return null
    const value = payload?.value ?? ""
    const label = value === todayFormatted ? "Today" : value
    const showLabel = labelValues.has(value)
    return (
      <g transform={`translate(${xNum}, ${yNum})`}>
        {showLabel && (
          <text x={0} y={12} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" fillOpacity={0.9}>
            {label}
          </text>
        )}
      </g>
    )
  }

  const CurrentPointDot = (props: { cx?: number; cy?: number; index?: number }) => {
    if (props.index !== lastHistoricalIndex || props.cx == null || props.cy == null) return null
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={6}
        fill="var(--brand-green-700)"
        stroke="var(--background)"
        strokeWidth={2.5}
      />
    )
  }

  return (
    <Card className="bg-muted/50 p-6 hover:bg-muted/50">
      <CardHeader className="gap-x-1 gap-y-0 space-y-0 px-0 pb-2">
        <h2 className="text-2xl font-bold">
          {data ? (
            <>1 {fromCurrency} = {displayRate.toFixed(4)} {toCurrency}</>
          ) : (
            <>1 {fromCurrency} = — {toCurrency}</>
          )}
        </h2>
        {data && calc && (
          <p className="text-sm text-muted-foreground">
            7-day avg: {calc.sevenDayAverage.toFixed(4)}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4 px-0">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {loading && !data && (
              <div className="h-[200px] animate-pulse rounded-md bg-muted" />
            )}

            {data && calc && !loading && (
              <>
                <div className="grid grid-cols-2 gap-6 items-stretch">
                  <div className="min-h-[200px] min-w-0 flex flex-col gap-2">
                    <div className="min-h-[200px] min-w-0 flex-1">
                    {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={allChartData}
                        margin={{ top: 4, right: 4, bottom: 4, left: 0 }}
                      >
                        <XAxis
                          dataKey="date"
                          ticks={xAxisTicks}
                          tick={XAxisTick as never}
                          tickLine={{ stroke: "var(--grey-400)", strokeOpacity: 0.4 }}
                          axisLine={{ stroke: "var(--grey-400)", strokeOpacity: 0.4 }}
                        />
                        <YAxis
                          domain={["auto", "auto"]}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(v) => Number(v).toFixed(2)}
                          tickCount={3}
                          tickLine={{ stroke: "var(--grey-400)", strokeOpacity: 0.4 }}
                          axisLine={{ stroke: "var(--grey-400)", strokeOpacity: 0.4 }}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const dataPoint = payload[0]?.payload as { rawDate?: string; rate?: number; projected?: number } | undefined
                            const ratePayload = payload.find((p) => p.dataKey === "rate") ?? payload.find((p) => p.dataKey === "projected") ?? payload[0]
                            const rateVal = ratePayload?.value ?? dataPoint?.rate ?? dataPoint?.projected
                            const rateStr = rateVal != null ? Number(rateVal).toFixed(4) : "—"
                            const dateStr = dataPoint?.rawDate
                              ? formatDateTooltip(dataPoint.rawDate)
                              : String(payload[0]?.payload?.date ?? "")
                            return (
                              <div
                                className="rounded-md border px-3 py-2 text-xs"
                                style={{
                                  fontSize: "12px",
                                  borderRadius: "6px",
                                  border: "1px solid var(--border)",
                                  backgroundColor: "var(--popover)",
                                }}
                              >
                                <div className="text-grey-400 uppercase">{dateStr}</div>
                                <div className="font-bold uppercase text-brand-green-700">{rateStr}</div>
                              </div>
                            )
                          }}
                        />
                        <ReferenceLine
                          y={calc.sevenDayAverage}
                          stroke="var(--grey-400)"
                          strokeOpacity={0.4}
                          strokeDasharray="4 4"
                          strokeWidth={1}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="var(--brand-green-700)"
                          strokeWidth={2}
                          dot={<CurrentPointDot />}
                          connectNulls
                        />
                        {hasProjection && (
                          <Line
                            type="monotone"
                            dataKey="projected"
                            stroke="var(--brand-green-600)"
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            strokeOpacity={1}
                            dot={false}
                            connectNulls
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full animate-pulse rounded-md bg-muted" />
                    )}
                    </div>
                    <p className="text-[12px] text-muted-foreground">{calc.insightText}</p>
                    {activeAlert && !activeAlert.triggeredAt && data && (() => {
                      const currentRate = data.currentRate
                      const pctDiff = Math.abs((currentRate - activeAlert.rate) / activeAlert.rate) * 100
                      if (pctDiff <= CLOSE_THRESHOLD_PERCENT) {
                        return (
                          <p className="text-[12px] text-brand-green-700 mt-1">
                            Your alert is close — rate is only {pctDiff.toFixed(1)}% away.
                          </p>
                        )
                      }
                      return null
                    })()}
                  </div>

                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex h-[56px] items-center gap-2 rounded-xl border-2 border-transparent bg-background dark:bg-transparent px-3 focus-within:border-brand-green-700">
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-auto min-w-0 flex-1 border-0 p-0 text-left text-[18px] font-semibold focus-visible:ring-0"
                      />
                      <div className="relative flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-grey-100 px-3 py-1.5">
                        <select
                          value={fromCurrency}
                          onChange={(e) => setFromCurrency(e.target.value as typeof fromCurrency)}
                          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent text-transparent outline-none"
                          aria-label={`From currency: ${fromCurrency}`}
                        >
                          {CURRENCIES.filter((c) => c !== toCurrency).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <Image
                          src={CURRENCY_FLAGS[fromCurrency]}
                          alt=""
                          width={20}
                          height={14}
                          className="relative z-10 size-5 shrink-0 rounded-full object-cover"
                        />
                        <span className="relative z-10 shrink-0 whitespace-nowrap pointer-events-none text-base font-semibold text-grey-700">{fromCurrency}</span>
                        <ChevronDown className="relative z-10 size-4 shrink-0 pointer-events-none text-grey-700" />
                      </div>
                    </div>

                    <div className="relative z-20 flex justify-center -my-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full border-0 bg-grey-200 text-[10px]"
                        onClick={handleSwap}
                      >
                        <ArrowDownUp className="size-5 text-brand-green-700" />
                      </Button>
                    </div>

                    <div className="flex h-[56px] items-center gap-2 rounded-xl border-2 border-transparent bg-background dark:bg-transparent px-3 focus-within:border-brand-green-700">
                      <Input
                        type="text"
                        readOnly
                        value={convertedAmount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        className="h-auto min-w-0 flex-1 border-0 p-0 text-left text-[18px] font-semibold focus-visible:ring-0"
                      />
                      <div className="relative flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-grey-100 px-3 py-1.5">
                        <select
                          value={toCurrency}
                          onChange={(e) => setToCurrency(e.target.value as typeof toCurrency)}
                          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent text-transparent outline-none"
                          aria-label={`To currency: ${toCurrency}`}
                        >
                          {CURRENCIES.filter((c) => c !== fromCurrency).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <Image
                          src={CURRENCY_FLAGS[toCurrency]}
                          alt=""
                          width={20}
                          height={14}
                          className="relative z-10 size-5 shrink-0 rounded-full object-cover"
                        />
                        <span className="relative z-10 shrink-0 whitespace-nowrap pointer-events-none text-base font-semibold text-grey-700">{toCurrency}</span>
                        <ChevronDown className="relative z-10 size-4 shrink-0 pointer-events-none text-grey-700" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <Button
                        variant="default"
                        className="h-12 w-full font-bold"
                      >
                        Send
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-12 w-full border border-grey-400 bg-transparent hover:bg-muted/50"
                        onClick={handleLockRate}
                      >
                        {isLocked ? <Lock className="size-3.5 shrink-0" /> : <LockOpen className="size-3.5 shrink-0" />}
                        {isLocked ? `Unlock (${formatLockTimer(lockSecondsLeft ?? 0)})` : "Lock this rate"}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
      </Card>
  )
}
