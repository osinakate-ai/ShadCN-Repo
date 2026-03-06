/**
 * Currency account card settings
 * Flag images are stored in public/assets/ and rendered at 48x48px
 */

export const CURRENCIES = ["EUR", "USD", "GBP", "AUD", "CAD"] as const

export const CURRENCY_FLAGS: Record<(typeof CURRENCIES)[number], string> = {
  EUR: "/assets/europe.png",
  USD: "/assets/united-states.png",
  GBP: "/assets/united-kingdom.png",
  AUD: "/assets/australia.png",
  CAD: "/assets/canada.png",
}

export const CURRENCY_ACCOUNTS = [
  {
    code: "EUR",
    label: "EUR",
    accountId: "51568",
    balance: "1.00",
    flagSrc: "/assets/europe.png",
  },
  {
    code: "AUD",
    label: "AUD",
    accountId: "30779",
    balance: "0.00",
    flagSrc: "/assets/australia.png",
  },
  {
    code: "CAD",
    label: "CAD",
    accountId: "15376",
    balance: "0.00",
    flagSrc: "/assets/canada.png",
  },
  {
    code: "GBP",
    label: "GBP",
    accountId: "13159",
    balance: "0.00",
    flagSrc: "/assets/united-kingdom.png",
  },
] as const

export const CARD_FLAG_SIZE = { width: 48, height: 48 } as const
