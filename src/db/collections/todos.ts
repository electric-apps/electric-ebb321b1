import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { todoSelectSchema } from "@/db/zod-schemas";

const getBaseUrl = () =>
	typeof window !== "undefined"
		? window.location.origin
		: "http://localhost:5173";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (row) => row.id,
		shapeOptions: {
			url: `${getBaseUrl()}/api/todos`,
			parser: {
				timestamptz: (val: string) => new Date(val),
			},
		},
		onInsert: async ({ transaction }) => {
			const { modified } = transaction.mutations[0];
			const res = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(modified),
			});
			if (!res.ok) throw new Error("Failed to insert todo");
			return res.json();
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0];
			const res = await fetch(`/api/mutations/todos/${modified.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(modified),
			});
			if (!res.ok) throw new Error("Failed to update todo");
			return res.json();
		},
		onDelete: async ({ transaction }) => {
			const { original } = transaction.mutations[0];
			const res = await fetch(`/api/mutations/todos/${original.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete todo");
			return res.json();
		},
	}),
);
