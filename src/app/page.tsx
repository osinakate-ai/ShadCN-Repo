import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, Plus } from "lucide-react"
import { CURRENCY_ACCOUNTS, CARD_FLAG_SIZE } from "@/lib/currency-settings"
import { TransferCalculatorSection } from "@/components/transfer-calculator-section"

/**
 * DESIGNER NOTE: Wise-style dashboard — layout and structure only.
 * All core sections use ShadCN components. Designers can restyle to match Wise UI (colours, typography, spacing).
 *
 * Sections:
 * — Total balance + action buttons (Send, Add money, Request)
 * — Currency account cards (EUR, AUD, CAD, GBP)
 * — Recent transactions list
 * — Footer (Provided by Wise Assets Europe)
 */

const RECENT_TRANSACTIONS = [
  { id: "1", icon: ArrowUp, name: "Hannah Johnson", subtitle: "Sent - 18 Apr", amount: "49 EUR", isCredit: false },
  { id: "2", icon: Plus, name: "To EUR", subtitle: "Added - 18 Apr", amount: "+ 50 EUR", subAmount: "50.44 EUR", isCredit: true },
  { id: "3", icon: ArrowUp, name: "Brandon Bolt", subtitle: "Sent - 2 Apr", amount: "110 EUR", isCredit: false },
]

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[976px] flex flex-1 flex-col gap-6 px-6 pb-6 pt-[56px]">
      {/* Total balance + actions */}
      <section className="space-y-5">
        <div className="space-y-0 [&_p]:mb-0 [&_h2]:mt-0">
          <p className="text-sm font-medium text-muted-foreground">Total balance</p>
          <h2 className="text-3xl font-bold tracking-tight">1.00 US</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="default">
            Send Money
          </Button>
          <Button size="sm" variant="secondary">
            Add money
          </Button>
          <Button size="sm" variant="secondary">
            Request
          </Button>
        </div>
      </section>

      {/* Currency account cards — horizontal scroll to reach last card */}
      <section className="cards-scroll min-w-0 overflow-x-auto overflow-y-visible pb-2">
        <div className="flex w-max min-w-full gap-[12px] flex-nowrap">
        {CURRENCY_ACCOUNTS.slice(0, 2).map((account) => (
          <Card key={account.code} className="flex h-[206px] min-w-[256px] shrink-0 flex-col justify-between gap-0 bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <Image
                src={account.flagSrc}
                alt={`${account.label} flag`}
                width={CARD_FLAG_SIZE.width}
                height={CARD_FLAG_SIZE.height}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <CardTitle className="text-base font-medium">{account.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-xs text-muted-foreground">Account - {account.accountId}</p>
              <p className="text-2xl font-bold">{account.balance}</p>
            </CardContent>
          </Card>
        ))}
        <div className="group/add-card relative flex h-[206px] min-w-[256px] shrink-0 rounded-[14px]" data-add-card>
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-grey-300 group-hover/add-card:text-grey-400"
          viewBox="0 0 256 206"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect
            x="0.5"
            y="0.5"
            width="255"
            height="205"
            rx="13.5"
            ry="13.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <button
          type="button"
          className="flex flex-1 flex-col justify-between rounded-[13px] bg-transparent p-4 text-left transition-colors hover:bg-grey-300 dark:hover:bg-grey-300"
          aria-label="Add another currency to your account"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-grey-300 bg-grey-200">
            <Plus className="size-6 text-grey-700" strokeWidth={2} />
          </div>
          <p className="text-sm text-grey-400">
            Add another currency to your account.
          </p>
        </button>
        </div>
        </div>
      </section>

      {/* Transfer calculator Section */}
      <TransferCalculatorSection />

      {/* Recent transactions */}
      <section className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <Link
            href="/"
            className="text-sm font-medium text-brand-green-700 underline-offset-4 hover:underline"
          >
            See all
          </Link>
        </div>
        <ul className="rounded-lg bg-transparent">
          {RECENT_TRANSACTIONS.map((tx) => (
            <li key={tx.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                <tx.icon className="size-6 text-grey-700" strokeWidth={1.5} fill="none" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{tx.name}</p>
                <p className="text-sm text-muted-foreground">{tx.subtitle}</p>
                {tx.subAmount && (
                  <p className="text-xs text-muted-foreground">{tx.subAmount}</p>
                )}
              </div>
              <p className={`shrink-0 text-right font-medium ${tx.isCredit ? "text-brand-green-700" : ""}`}>
                {tx.amount}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-4">
        <p className="text-xs text-muted-foreground">
          Provided by Wise Assets Europe
        </p>
      </footer>
    </div>
  )
}
