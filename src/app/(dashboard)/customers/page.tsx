import type { Prisma } from "@prisma/client";
import {
  Building2,
  Filter,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Users
} from "lucide-react";
import Link from "next/link";

import { createCustomer, deleteCustomer } from "@/app/(dashboard)/customers/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatCurrency, formatDate, humanizeEnum } from "@/lib/utils";

const statuses = ["ACTIVE", "PROSPECT", "INACTIVE"] as const;

function statusTone(status: string) {
  if (status === "ACTIVE") return "green";
  if (status === "PROSPECT") return "blue";
  return "gray";
}

export default async function CustomersPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string };
}) {
  const user = await requireUser();
  const q = searchParams.q?.trim();
  const status = statuses.find((item) => item === searchParams.status);

  const where: Prisma.CustomerWhereInput = {
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

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { notes: true, tasks: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Customers</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Relationship records
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Add accounts, track customer value, and keep every note attached to
            the right relationship.
          </p>
        </div>
        <form className="flex flex-col gap-2 sm:flex-row" action="/customers">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search customers"
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
            <CardTitle>Add customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCustomer} className="space-y-4">
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
                    defaultValue="ACTIVE"
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
                  <Label htmlFor="lifetimeValue">Lifetime value</Label>
                  <Input
                    id="lifetimeValue"
                    name="lifetimeValue"
                    type="number"
                    min="0"
                    defaultValue="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="source" placeholder="Referral, website, event" />
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4" />
                Add customer
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {customers.length ? (
            customers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="text-lg font-semibold hover:text-primary"
                        >
                          {customer.name}
                        </Link>
                        <Badge tone={statusTone(customer.status)}>
                          {humanizeEnum(customer.status)}
                        </Badge>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {customer.companyName ?? "No company"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {customer.email ?? "No email"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {customer.phone ?? "No phone"}
                        </span>
                        <span>Updated {formatDate(customer.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="mr-2 text-right">
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-semibold">
                          {formatCurrency(customer.lifetimeValue)}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/customers/${customer.id}`}>Open</Link>
                      </Button>
                      <form action={deleteCustomer.bind(null, customer.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${customer.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </form>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2 py-1">
                      {customer._count.notes} notes
                    </span>
                    <span className="rounded-md bg-muted px-2 py-1">
                      {customer._count.tasks} tasks
                    </span>
                    {customer.source ? (
                      <span className="rounded-md bg-muted px-2 py-1">
                        Source: {customer.source}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Users}
              title="No customers found"
              description="Create a customer or adjust the current search and filters."
            />
          )}
        </div>
      </section>
    </div>
  );
}
