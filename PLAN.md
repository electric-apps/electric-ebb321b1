# Todo App — Implementation Plan

## App Description
A local-first, real-time todo application built with Electric SQL + TanStack DB. Changes sync instantly across all connected clients via Postgres → Electric → browser, with optimistic updates for a snappy UX.

## Data Model

### todos
- id: UUID, primary key, defaultRandom()
- title: text, notNull
- completed: boolean, notNull, default false
- priority: text enum ('low', 'medium', 'high'), notNull, default 'medium'
- due_date: timestamptz, nullable (optional due date)
- created_at: timestamptz, notNull, defaultNow()
- updated_at: timestamptz, notNull, defaultNow()

## Implementation Tasks
- [x] Phase 1: Write and approve PLAN.md
- [ ] Phase 2: Discover playbook skills and read relevant ones
- [ ] Phase 3: Data model — schema, zod-schemas, migrations, tests
- [ ] Phase 4: Collections & API routes
- [ ] Phase 5: UI components
- [ ] Phase 6: Build, lint & test
- [ ] Phase 7: Deploy & README
- [ ] Phase 8: Push final commit

## Design Conventions
- UUID primary keys with defaultRandom()
- timestamp({ withTimezone: true }) for all dates
- snake_case for SQL table/column names
- Foreign keys with onDelete: "cascade" where appropriate
- Radix UI Themes with violet accent, mauve gray
- lucide-react for icons
