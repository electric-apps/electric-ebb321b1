# Todos

A local-first, real-time todo application — changes sync instantly across all connected clients via Postgres → Electric → browser, with optimistic updates for a snappy feel.

<!-- screenshot placeholder -->

## Features

- Add todos with title, priority (low/medium/high), and optional due date
- Toggle completion with optimistic UI updates
- Filter by All / Active / Completed
- Overdue date warnings
- Real-time sync across browser tabs and devices via Electric SQL

## Getting Started

```bash
pnpm install
pnpm dev:start
```

Open [http://localhost:5173](http://localhost:5173).

## Tech Stack

| Layer        | Technology                  |
|-------------|------------------------------|
| Sync         | Electric SQL (Postgres → client) |
| Reactive DB  | TanStack DB (live queries + optimistic mutations) |
| ORM          | Drizzle ORM + drizzle-zod    |
| Framework    | TanStack Start (React SSR)   |
| UI           | Radix UI Themes              |
| Icons        | lucide-react                 |

## Scripts

```bash
pnpm dev:start     # start dev server + Postgres + Electric
pnpm dev:stop      # stop background services
pnpm test          # run tests
pnpm run build     # production build
```

## License

MIT
