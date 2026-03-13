import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos/$id")({
	server: {
		handlers: {
			PATCH: async ({
				request,
				params,
			}: {
				request: Request;
				params: { id: string };
			}) => {
				const body = parseDates(await request.json());
				const { id } = params;

				let txid: number | undefined;

				await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					await tx
						.update(todos)
						.set({
							title: body.title,
							completed: body.completed,
							priority: body.priority,
							due_date: body.due_date ?? null,
							updated_at: new Date(),
						})
						.where(eq(todos.id, id));
				});

				return Response.json({ txid });
			},

			DELETE: async ({ params }: { params: { id: string } }) => {
				const { id } = params;

				let txid: number | undefined;

				await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					await tx.delete(todos).where(eq(todos.id, id));
				});

				return Response.json({ txid });
			},
		},
	},
});
