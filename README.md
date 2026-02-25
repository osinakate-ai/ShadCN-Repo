# Wise UI Dashboard — Designer Template

A **Next.js + ShadCN** template that recreates the layout and structure of the Wise dashboard. Use this repo to learn where components live and how to change styling so the UI matches the Wise brand. All core UI is built with [ShadCN](https://ui.shadcn.com/) components and [Tailwind CSS](https://tailwindcss.com/).

---

## Getting started

**Install and run the app:**

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (or the port shown in the terminal) in your browser. You’ll see the Wise-style dashboard: sidebar, header, total balance, currency cards, and transactions list.

---

## Project structure

Where to look when you want to change layout or styling:

```
src/
├── app/                    # App shell and pages
│   ├── layout.tsx          # Root layout: sidebar, header, fonts
│   ├── page.tsx            # Main dashboard content (balance, cards, transactions)
│   └── globals.css         # Theme variables and base styles ← main place for colours/fonts
│
├── components/
│   ├── app-header.tsx      # Top bar: logo, “Earn” button, user menu
│   ├── app-sidebar.tsx     # Left nav: Home, Cards, Transactions, Payments (expandable), etc.
│   │
│   └── ui/                 # ShadCN primitives (buttons, cards, inputs, etc.)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── collapsible.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx     # Sidebar layout + menu components
│       ├── skeleton.tsx
│       └── tooltip.tsx
│
├── hooks/
│   └── use-mobile.ts       # Used by sidebar for responsive behaviour
│
└── lib/
    └── utils.ts            # cn() and other helpers
```

---

## What lives where

| What you want to change | Where to edit |
|-------------------------|---------------|
| **Overall colours, radius, dark mode** | `src/app/globals.css` — `:root` and `.dark` variables |
| **Dashboard content** (balance, cards, transactions, footer) | `src/app/page.tsx` |
| **Header** (logo, Earn button, user block) | `src/components/app-header.tsx` |
| **Sidebar** (nav items, Payments submenu) | `src/components/app-sidebar.tsx` |
| **One-off component look** (e.g. a single button or card) | Add Tailwind classes in the file that uses it (e.g. `page.tsx`, `app-header.tsx`) |
| **Global look of a primitive** (all buttons, all cards) | `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, etc. |

---

## How to update styling

### 1. Theme variables (`src/app/globals.css`)

Use this for **brand-wide colours and spacing**. The app uses CSS variables; Tailwind and ShadCN read them via `@theme` in `globals.css`.

**Important variables:**

- **`--primary`** / **`--primary-foreground`** — Primary buttons, links, accents (e.g. “Send”, “Add money”, “Earn €90”). Set these to Wise green for brand alignment.
- **`--background`** / **`--foreground`** — Page background and main text.
- **`--card`** / **`--card-foreground`** — Card backgrounds and text (e.g. currency account cards).
- **`--muted`** / **`--muted-foreground`** — Secondary text and subtle backgrounds.
- **`--sidebar-*`** — Sidebar background, text, active state, border (e.g. `--sidebar-accent` for the active “Home” item).
- **`--radius`** — Default border radius (buttons, cards, inputs). Other radii are derived from it (`--radius-sm`, `--radius-lg`, etc.).

All colours use **HEX** (e.g. `#343434`, `#fafafa`) so you can copy values from Figma and paste them into `globals.css`. After changing variables, save and the dev server will hot-reload.

### 2. Tailwind classes on components

For **localised styling** (one section or one component), add Tailwind classes in the file that renders it:

- **`page.tsx`** — e.g. `className="text-3xl font-bold"` on the balance, or `className="bg-muted/50"` on a card.
- **`app-header.tsx`** — e.g. `className="text-xl font-bold text-primary"` on the logo.
- **`app-sidebar.tsx`** — e.g. padding, spacing, or active state on nav items.

Use semantic colours so the theme stays consistent: `bg-primary`, `text-muted-foreground`, `border-border`, etc. They all map to the variables in `globals.css`.

### 3. ShadCN component variants

Many ShadCN components support **variants** so you can change style without editing the UI file:

- **Button:** `variant="default" | "outline" | "secondary" | "ghost" | "link"`, `size="default" | "sm" | "lg" | "icon"`.
- **Badge:** `variant="default" | "secondary" | "destructive" | "outline"`.
- **Card:** No variants; style via `className` on `Card`, `CardHeader`, `CardContent`, etc.

Example: `<Button variant="outline" size="sm">Request</Button>`. Variant styles are defined in `src/components/ui/button.tsx` (and similar files); you can tweak those classes if you want to change how all “outline” or “secondary” buttons look.

### 4. Changing a ShadCN primitive everywhere

To change how **all** buttons or cards look app-wide, edit the corresponding file in `src/components/ui/`:

- **`button.tsx`** — `buttonVariants` and the default `Button` component.
- **`card.tsx`** — `Card`, `CardHeader`, `CardContent`, etc. (e.g. border, shadow, padding).
- **`sidebar.tsx`** — Sidebar width, collapsed state, and menu item styles.

Use the same CSS variables and Tailwind tokens as in `globals.css` so light/dark and theme changes stay consistent.

---

## Dashboard layout (summary)

- **Header:** Sidebar toggle, “WISE” wordmark, “Earn €90” button, user avatar + “Carolina Fernandes” with dropdown.
- **Sidebar:** Home (active), Cards, Transactions, Payments (expandable: Scheduled, Direct Debits, Recurring card payments, Payment requests), Bill splits, Recipients, Insights.
- **Main:** Total balance + “Send” / “Add money” / “Request”; four currency account cards (EUR, AUD, CAD, GBP); recent transactions list; footer “Provided by Wise Assets Europe.”

Placeholder content (e.g. flag emoji, sample transactions) is in `page.tsx` and can be replaced with real data or assets later.

---

## Tech stack

- **Next.js 16** (App Router)
- **ShadCN UI** (Radix-based components)
- **Tailwind CSS 4**
- **TypeScript**

---

## Useful links

- [ShadCN UI](https://ui.shadcn.com/) — component docs and theming
- [Tailwind CSS](https://tailwindcss.com/docs) — utility classes
- [Next.js App Router](https://nextjs.org/docs/app) — routing and layout
