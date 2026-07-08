import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MessageSquareText, Save, Trash2 } from "lucide-react";
import Link from "next/link";

import { addLeadNote, deleteLead, updateLead } from "@/app/(dashboard)/leads/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatCurrency, formatDate, humanizeEnum } from "@/lib/utils";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;

function toDateInput(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

function statusTone(status: string) {
  if (status === "WON") return "green";
  if (status === "LOST") return "red";
  if (status === "QUALIFIED") return "blue";
  if (status === "CONTACTED") return "amber";
  return "gray";
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const lead = await prisma.lead.findFirst({
    where: { id: params.id, companyId: user.companyId },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      tasks: { orderBy: { dueDate: "asc" }, take: 6 }
    }
  });

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-3">
            <Link href="/leads">
              <ArrowLeft className="h-4 w-4" />
              Leads
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-normal">{lead.name}</h1>
            <Badge tone={statusTone(lead.status)}>{humanizeEnum(lead.status)}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {lead.companyName ?? "No company"} · {formatCurrency(lead.value)} lead value
          </p>
        </div>
        <form action={deleteLead.bind(null, lead.id)}>
          <Button type="submit" variant="destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </form>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Edit lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateLead.bind(null, lead.id)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={lead.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    defaultValue={lead.companyName ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={lead.email ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={lead.phone ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={lead.status}
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
                  <Label htmlFor="value">Lead value</Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    min="0"
                    defaultValue={lead.value}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" name="source" defaultValue={lead.source ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedClose">Expected close</Label>
                  <Input
                    id="expectedClose"
                    name="expectedClose"
                    type="date"
                    defaultValue={toDateInput(lead.expectedClose)}
                  />
                </div>
              </div>
              <Button>
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add note</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addLeadNote.bind(null, lead.id)} className="space-y-4">
                <Textarea name="body" placeholder="Capture next-step context..." required />
                <Button>
                  <MessageSquareText className="h-4 w-4" />
                  Add note
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linked tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.tasks.length ? (
                lead.tasks.map((task) => (
                  <div key={task.id} className="rounded-md border bg-background p-3">
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={CalendarDays}
                  title="No tasks"
                  description="Tasks linked to this lead will appear here."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Note history</CardTitle>
        </CardHeader>
        <CardContent>
          {lead.notes.length ? (
            <div className="divide-y">
              {lead.notes.map((note) => (
                <article key={note.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="whitespace-pre-wrap text-sm leading-6">{note.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(note.createdAt)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquareText}
              title="No notes yet"
              description="Add the first note to keep lead history organized."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
