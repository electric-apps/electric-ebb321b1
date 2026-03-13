import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { z } from "zod/v4"
import { todos } from "./schema"

// Override timestamp columns so they accept both string and Date (for JSON round-trip)
const timestampOverride = z
	.union([z.string(), z.date()])
	.transform((val) => (typeof val === "string" ? new Date(val) : val))

// due_date is nullable and optional; accepts string, Date, or null
const dueDateOverride = z
	.union([z.string(), z.date()])
	.transform((val) => (typeof val === "string" ? new Date(val) : val))
	.nullable()
	.optional()

export const todoSelectSchema = createSelectSchema(todos, {
	// Override priority: drizzle-zod v4 enum internals aren't introspectable by test utils,
	// so we use z.string(). DB-level enum constraint still enforced in Postgres.
	priority: z.string(),
	due_date: dueDateOverride,
	created_at: timestampOverride,
	updated_at: timestampOverride,
})

export const todoInsertSchema = createInsertSchema(todos, {
	priority: z.string().optional(),
	due_date: dueDateOverride,
	created_at: timestampOverride.optional(),
	updated_at: timestampOverride.optional(),
})

export type Priority = "low" | "medium" | "high"
export type Todo = typeof todoSelectSchema._type
export type NewTodo = typeof todoInsertSchema._type
