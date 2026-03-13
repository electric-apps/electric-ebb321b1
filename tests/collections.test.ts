import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("Todo collection insert validation", () => {
	it("validates a valid todo for insert", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects insert without title", () => {
		const result = todoInsertSchema.safeParse({
			id: crypto.randomUUID(),
			completed: false,
			priority: "medium",
		})
		expect(result.success).toBe(false)
	})

	it("JSON round-trip: parseDates restores Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const restored = parseDates(serialized)
		const result = todoSelectSchema.safeParse(restored)
		expect(result.success).toBe(true)
	})

	it("JSON round-trip: created_at is a Date after parseDates", () => {
		const row = { ...generateValidRow(todoSelectSchema) }
		const serialized = JSON.parse(JSON.stringify(row))
		const restored = parseDates(serialized)
		expect(restored.created_at).toBeInstanceOf(Date)
	})

	it("accepts all valid priorities", () => {
		for (const priority of ["low", "medium", "high"]) {
			const result = todoInsertSchema.safeParse({ title: "Test", priority })
			expect(result.success).toBe(true)
		}
	})
})
