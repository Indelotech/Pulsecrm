import type { Prisma } from "@prisma/client";
import { Building2, Filter, Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";

import { createLead, deleteLead } from "@/app/(dashboard)/leads/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatCurrency, formatDate, humanizeEnum } from "@/lib/utils";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;

function statusTone(status: string) {
  if (status === "WON") return "green";
  if (status === "LOST") return "red";
  if (status === "QUALIFIED") return "blue";
  if (status === "CONTACTED") return "amber";
  return "gray";
}

export default async function LeadsPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string };
}) {
  const user = await requireUser();
  const q = searchParams.q?.trim();
  const status = statuses.find((item) => item === searchParams.status);

  const where: Prisma.LeadWhereInput = {
    companyId: user.companyId,
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { notes: true, tasks: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Leads</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Pipeline opportunities
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track qualified conversations, expected value, status, and next steps
            from first touch through won revenue.
          </p>
        </div>
        <form className="flex flex-col gap-2 sm:flex-row" action="/leads">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search leads"
              defaultValue={q}
              className="pl-9 sm:w-64"
            />
          </div>
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
          <Button type="submit" variant="outline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </form>
      </div>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createLead} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company</Label>
                <Input id="companyName" name="companyName" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="NEW"
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
                  <Input id="value" name="value" type="number" min="0" defaultValue="0" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" name="source" placeholder="Outbound, event" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedClose">Expected close</Label>
                  <Input id="expectedClose" name="expectedClose" type="date" />
                </div>
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4" />
                Add lead
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {leads.length ? (
            leads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="text-lg font-semibold hover:text-primary"
                        >
                          {lead.name}
                        </Link>
                        <Badge tone={statusTone(lead.status)}>
                          {humanizeEnum(lead.status)}
                        </Badge>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {lead.companyName ?? "No company"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {lead.email ?? "No email"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {lead.phone ?? "No phone"}
                        </span>
                        <span>Expected {formatDate(lead.expectedClose)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="mr-2 text-right">
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-semibold">{formatCurrency(lead.value)}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/leads/${lead.id}`}>Open</Link>
                      </Button>
                      <form action={deleteLead.bind(null, lead.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${lead.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </form>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2 py-1">
                      {lead._count.notes} notes
                    </span>
                    <span className="rounded-md bg-muted px-2 py-1">
                      {lead._count.tasks} tasks
                    </span>
                    {lead.source ? (
                      <span className="rounded-md bg-muted px-2 py-1">
                        Source: {lead.source}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Building2}
              title="No leads found"
              description="Create a lead or adjust the current search and filters."
            />
          )}
        </div>
      </section>
    </div>
  );
}
