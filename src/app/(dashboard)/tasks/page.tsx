import type { Prisma } from "@prisma/client";
import { CalendarDays, CheckSquare, Filter, Plus, Save, Trash2 } from "lucide-react";

import { createTask, deleteTask, updateTask } from "@/app/(dashboard)/tasks/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatDate, humanizeEnum } from "@/lib/utils";

const statuses = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
const priorities = ["LOW", "MEDIUM", "HIGH"] as const;

function dateInput(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function priorityTone(priority: string) {
  if (priority === "HIGH") return "red";
  if (priority === "MEDIUM") return "amber";
  return "green";
}

function statusTone(status: string) {
  if (status === "COMPLETED") return "green";
  if (status === "IN_PROGRESS") return "blue";
  return "gray";
}

function relationValue(task: { customerId: string | null; leadId: string | null }) {
  if (task.customerId) return `customer:${task.customerId}`;
  if (task.leadId) return `lead:${task.leadId}`;
  return "none";
}

export default async function TasksPage({
  searchParams
}: {
  searchParams: { status?: string; priority?: string };
}) {
  const user = await requireUser();
  const status = statuses.find((item) => item === searchParams.status);
  const priority = priorities.find((item) => item === searchParams.priority);

  const where: Prisma.TaskWhereInput = {
    companyId: user.companyId,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {})
  };

  const [tasks, customers, leads] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { updatedAt: "desc" }],
      include: { customer: true, lead: true, assignee: true }
    }),
    prisma.customer.findMany({
      where: { companyId: user.companyId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, companyName: true }
    }),
    prisma.lead.findMany({
      where: { companyId: user.companyId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, companyName: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Tasks</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Follow-up queue
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Keep customer and lead follow-up visible with due dates, ownership,
            priority, and completion state.
          </p>
        </div>
        <form className="flex flex-col gap-2 sm:flex-row" action="/tasks">
          <select
            name="status"
            defaultValue={status ?? ""}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {humanizeEnum(item)}
              </option>
            ))}
          </select>
          <select
            name="priority"
            defaultValue={priority ?? ""}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
          >
            <option value="">All priorities</option>
            {priorities.map((item) => (
              <option key={item} value={item}>
                {humanizeEnum(item)}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </form>
      </div>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add task</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relation">Assign to</Label>
                  <select
                    id="relation"
                    name="relation"
                    defaultValue="none"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  >
                    <option value="none">General task</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={`customer:${customer.id}`}>
                        Customer: {customer.name}
                      </option>
                    ))}
                    {leads.map((lead) => (
                      <option key={lead.id} value={`lead:${lead.id}`}>
                        Lead: {lead.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="PENDING"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {humanizeEnum(item)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue="MEDIUM"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  >
                    {priorities.map((item) => (
                      <option key={item} value={item}>
                        {humanizeEnum(item)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4" />
                Add task
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tasks.length ? (
            tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{task.title}</h2>
                        <Badge tone={statusTone(task.status)}>
                          {humanizeEnum(task.status)}
                        </Badge>
                        <Badge tone={priorityTone(task.priority)}>
                          {humanizeEnum(task.priority)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {task.customer?.name ?? task.lead?.name ?? "General task"} ·{" "}
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <form action={deleteTask.bind(null, task.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </form>
                  </div>

                  <form
                    action={updateTask.bind(null, task.id)}
                    className="grid gap-4 lg:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`title-${task.id}`}>Title</Label>
                      <Input
                        id={`title-${task.id}`}
                        name="title"
                        defaultValue={task.title}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`due-${task.id}`}>Due date</Label>
                      <Input
                        id={`due-${task.id}`}
                        name="dueDate"
                        type="date"
                        defaultValue={dateInput(task.dueDate)}
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor={`desc-${task.id}`}>Description</Label>
                      <Textarea
                        id={`desc-${task.id}`}
                        name="description"
                        defaultValue={task.description ?? ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`relation-${task.id}`}>Assign to</Label>
                      <select
                        id={`relation-${task.id}`}
                        name="relation"
                        defaultValue={relationValue(task)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                      >
                        <option value="none">General task</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={`customer:${customer.id}`}>
                            Customer: {customer.name}
                          </option>
                        ))}
                        {leads.map((lead) => (
                          <option key={lead.id} value={`lead:${lead.id}`}>
                            Lead: {lead.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`status-${task.id}`}>Status</Label>
                        <select
                          id={`status-${task.id}`}
                          name="status"
                          defaultValue={task.status}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {humanizeEnum(item)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`priority-${task.id}`}>Priority</Label>
                        <select
                          id={`priority-${task.id}`}
                          name="priority"
                          defaultValue={task.priority}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                        >
                          {priorities.map((item) => (
                            <option key={item} value={item}>
                              {humanizeEnum(item)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <Button>
                        <Save className="h-4 w-4" />
                        Save task
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={CheckSquare}
              title="No tasks found"
              description="Create a task or adjust the current filters."
            />
          )}
        </div>
      </section>
    </div>
  );
}
