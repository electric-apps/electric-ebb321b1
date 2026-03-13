import { createFileRoute } from "@tanstack/react-router";
import { proxyElectricRequest } from "@/lib/electric-proxy";

export const Route = createFileRoute("/api/todos")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				return proxyElectricRequest(request, "todos");
			},
		},
	},
});
