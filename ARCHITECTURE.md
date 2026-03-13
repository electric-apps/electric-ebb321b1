# Architecture

## Entities

### `todos`
| Column      | Type                        | Notes                   |
|------------|-----------------------------|-------------------------|
| id          | uuid (PK)                   | defaultRandom()         |
| title       | text                        | required                |
| completed   | boolean                     | default false           |
| priority    | text (low/medium/high)      | default medium          |
| due_date    | timestamptz (nullable)      | optional                |
| created_at  | timestamptz                 | defaultNow()            |
| updated_at  | timestamptz                 | defaultNow()            |

## Routes

| Route                          | Purpose                              |
|-------------------------------|--------------------------------------|
| `GET /`                       | Main todo list UI (ssr: false)       |
| `GET /api/todos`              | Electric shape proxy for todos table |
| `POST /api/mutations/todos`   | Insert a new todo                    |
| `PATCH /api/mutations/todos/:id` | Update an existing todo           |
| `DELETE /api/mutations/todos/:id` | Delete a todo                    |

## Key Files

```
src/
  db/
    schema.ts              # Drizzle table definition
    zod-schemas.ts         # Zod schemas derived from Drizzle
    collections/
      todos.ts             # TanStack DB Electric collection
  routes/
    index.tsx              # Main UI route (TodoPage component)
    api/
      todos.ts             # Electric shape proxy
      mutations/
        todos.ts           # Insert handler
        todos.$id.ts       # Update/delete handler
  lib/
    electric-proxy.ts      # Proxy helper (scaffold, do not modify)
tests/
  schema.test.ts           # Schema validation tests
  collections.test.ts      # Collection insert + JSON round-trip tests
```

## Data Flow

```
User action → collection.insert/update/delete (optimistic)
           → onInsert/onUpdate/onDelete → PATCH /api/mutations/todos
           → Drizzle writes to Postgres (returns txid)
           → Electric streams change back to client
           → TanStack DB confirms optimistic state via txid
```
