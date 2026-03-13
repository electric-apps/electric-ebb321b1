import {
	Badge,
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Select,
	Text,
	TextField,
} from "@radix-ui/themes";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";
import type { Priority, Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

type Filter = "all" | "active" | "completed";

function priorityColor(p: string): "gray" | "orange" | "red" {
	if (p === "high") return "red";
	if (p === "medium") return "orange";
	return "gray";
}

function formatDate(d: Date | null | undefined): string {
	if (!d) return "";
	const date = d instanceof Date ? d : new Date(d as unknown as string);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function isOverdue(d: Date | null | undefined): boolean {
	if (!d) return false;
	const date = d instanceof Date ? d : new Date(d as unknown as string);
	if (Number.isNaN(date.getTime())) return false;
	return date < new Date();
}

function AddTodoForm() {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState<Priority>("medium");
	const [dueDate, setDueDate] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = title.trim();
		if (!trimmed) return;

		todosCollection.insert({
			id: crypto.randomUUID(),
			title: trimmed,
			completed: false,
			priority,
			due_date: dueDate ? new Date(dueDate) : null,
			created_at: new Date(),
			updated_at: new Date(),
		});

		setTitle("");
		setDueDate("");
		setPriority("medium");
	};

	return (
		<Card>
			<form onSubmit={handleSubmit}>
				<Flex gap="2" align="end" wrap="wrap">
					<Box flexGrow="1" style={{ minWidth: "180px" }}>
						<Text as="label" size="1" color="gray" weight="medium">
							Task
						</Text>
						<TextField.Root
							placeholder="What needs to be done?"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							mt="1"
						/>
					</Box>

					<Box>
						<Text as="label" size="1" color="gray" weight="medium">
							Priority
						</Text>
						<Box mt="1">
							<Select.Root
								value={priority}
								onValueChange={(v) => setPriority(v as Priority)}
							>
								<Select.Trigger style={{ minWidth: "110px" }} />
								<Select.Content>
									<Select.Item value="low">Low</Select.Item>
									<Select.Item value="medium">Medium</Select.Item>
									<Select.Item value="high">High</Select.Item>
								</Select.Content>
							</Select.Root>
						</Box>
					</Box>

					<Box>
						<Text as="label" size="1" color="gray" weight="medium">
							Due date
						</Text>
						<TextField.Root
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							mt="1"
						/>
					</Box>

					<Button type="submit" disabled={!title.trim()}>
						<Plus size={16} />
						Add
					</Button>
				</Flex>
			</form>
		</Card>
	);
}

function TodoItem({ todo }: { todo: Todo }) {
	const handleToggle = () => {
		todosCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = () => {
		todosCollection.delete(todo.id);
	};

	const overdue = !todo.completed && isOverdue(todo.due_date);

	return (
		<Card>
			<Flex align="center" gap="3">
				<Checkbox
					checked={todo.completed}
					onCheckedChange={handleToggle}
					size="2"
				/>

				<Flex direction="column" gap="1" flexGrow="1">
					<Text
						size="3"
						weight="medium"
						style={{
							textDecoration: todo.completed ? "line-through" : "none",
							color: todo.completed ? "var(--gray-9)" : undefined,
						}}
					>
						{todo.title}
					</Text>

					<Flex gap="2" align="center" wrap="wrap">
						<Badge color={priorityColor(todo.priority)} variant="soft" size="1">
							{todo.priority}
						</Badge>

						{todo.due_date && (
							<Flex align="center" gap="1">
								<Calendar
									size={12}
									color={overdue ? "var(--red-9)" : "var(--gray-9)"}
								/>
								<Text size="1" color={overdue ? "red" : "gray"}>
									{formatDate(todo.due_date)}
									{overdue && " — overdue"}
								</Text>
							</Flex>
						)}
					</Flex>
				</Flex>

				<IconButton
					variant="ghost"
					color="red"
					size="2"
					onClick={handleDelete}
					aria-label="Delete todo"
				>
					<Trash2 size={15} />
				</IconButton>
			</Flex>
		</Card>
	);
}

function TodoPage() {
	const [filter, setFilter] = useState<Filter>("all");

	const { data: allTodos } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.orderBy(({ todo }) => todo.created_at, "desc"),
		[],
	);

	const { data: activeTodos } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.where(({ todo }) => eq(todo.completed, false))
				.orderBy(({ todo }) => todo.created_at, "desc"),
		[],
	);

	const { data: completedTodos } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todosCollection })
				.where(({ todo }) => eq(todo.completed, true))
				.orderBy(({ todo }) => todo.created_at, "desc"),
		[],
	);

	const displayedTodos =
		filter === "active"
			? activeTodos
			: filter === "completed"
				? completedTodos
				: allTodos;

	const activeCount = activeTodos?.length ?? 0;

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				<Flex justify="between" align="center">
					<Flex direction="column" gap="1">
						<Heading size="7">My Todos</Heading>
						<Text size="2" color="gray">
							{activeCount === 0
								? "All done!"
								: `${activeCount} task${activeCount === 1 ? "" : "s"} remaining`}
						</Text>
					</Flex>
				</Flex>

				<AddTodoForm />

				<Flex gap="2">
					{(["all", "active", "completed"] as Filter[]).map((f) => (
						<Button
							key={f}
							variant={filter === f ? "solid" : "soft"}
							color={filter === f ? "violet" : "gray"}
							size="2"
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
							{f === "all" && allTodos?.length ? (
								<Badge color="violet" variant="solid" ml="1" size="1">
									{allTodos.length}
								</Badge>
							) : f === "active" && activeCount > 0 ? (
								<Badge color="orange" variant="solid" ml="1" size="1">
									{activeCount}
								</Badge>
							) : null}
						</Button>
					))}
				</Flex>

				<Flex direction="column" gap="2">
					{displayedTodos?.length === 0 ? (
						<Card>
							<Flex py="6" align="center" justify="center">
								<Text color="gray" size="3">
									{filter === "completed"
										? "No completed todos yet."
										: filter === "active"
											? "No active todos. Add one above!"
											: "No todos yet. Add one above!"}
								</Text>
							</Flex>
						</Card>
					) : (
						displayedTodos?.map((todo) => (
							<TodoItem key={todo.id} todo={todo} />
						))
					)}
				</Flex>
			</Flex>
		</Container>
	);
}
