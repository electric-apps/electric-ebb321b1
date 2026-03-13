import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todoSelectSchema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects missing completed", () => {
		const row = generateRowWithout(todoSelectSchema, "completed")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects missing priority", () => {
		const row = generateRowWithout(todoSelectSchema, "priority")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects missing created_at", () => {
		const row = generateRowWithout(todoSelectSchema, "created_at")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("allows null due_date", () => {
		const row = { ...generateValidRow(todoSelectSchema), due_date: null }
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("parses ISO string created_at to Date", () => {
		const row = {
			...generateValidRow(todoSelectSchema),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
		}
	})
})

describe("todoInsertSchema", () => {
	it("validates a valid insert row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects missing title", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("allows omitting optional fields", () => {
		const result = todoInsertSchema.safeParse({
			title: "Buy milk",
			completed: false,
			priority: "medium",
		})
		expect(result.success).toBe(true)
	})
})
