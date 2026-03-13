import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const body = parseDates(await request.json());

				let txid: number | undefined;

				await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					await tx.insert(todos).values({
						id: body.id,
						title: body.title,
						completed: body.completed ?? false,
						priority: body.priority ?? "medium",
						due_date: body.due_date ?? null,
					});
				});

				return Response.json({ txid });
			},
		},
	},
});
