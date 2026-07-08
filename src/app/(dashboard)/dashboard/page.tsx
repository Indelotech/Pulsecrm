import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  DollarSign,
  Users
} from "lucide-react";

import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatCurrency, formatDate, humanizeEnum } from "@/lib/utils";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthKey(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
}

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 })
    .map((_, index) => new Date(now.getFullYear(), now.getMonth() - (5 - index), 1))
    .map((date) => ({
      date,
      label: monthKey(date),
      key: `${date.getFullYear()}-${date.getMonth()}`
    }));
}

export default async function DashboardPage() {
  const user = await requireUser();
  const sixMonths = lastSixMonths();
  const currentMonth = startOfMonth(new Date());

  const [
    totalCustomers,
    activeLeads,
    pendingTasks,
    monthlyRevenue,
    wonLeads,
    activities,
    urgentTasks
  ] = await Promise.all([
    prisma.customer.count({ where: { companyId: user.companyId } }),
    prisma.lead.count({
      where: {
        companyId: user.companyId,
        status: { in: ["NEW", "CONTACTED", "QUALIFIED"] }
      }
    }),
    prisma.task.count({
      where: { companyId: user.companyId, status: { not: "COMPLETED" } }
    }),
    prisma.lead.aggregate({
      where: {
        companyId: user.companyId,
        status: "WON",
        updatedAt: { gte: currentMonth }
      },
      _sum: { value: true }
    }),
    prisma.lead.findMany({
      where: {
        companyId: user.companyId,
        status: "WON",
        updatedAt: { gte: sixMonths[0].date }
      },
      select: { value: true, updatedAt: true }
    }),
    prisma.activity.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.task.findMany({
      where: { companyId: user.companyId, status: { not: "COMPLETED" } },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 5,
      include: { customer: true, lead: true }
    })
  ]);

  const chartData = sixMonths.map((month) => {
    const monthLeads = wonLeads.filter((lead) => {
      const updated = lead.updatedAt;
      return (
        updated.getFullYear() === month.date.getFullYear() &&
        updated.getMonth() === month.date.getMonth()
      );
    });

    return {
      month: month.label,
      revenue: monthLeads.reduce((sum, lead) => sum + lead.value, 0),
      leads: monthLeads.length
    };
  });

  const stats = [
    {
      title: "Total customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      tone: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
    },
    {
      title: "Active leads",
      value: activeLeads.toLocaleString(),
      icon: BriefcaseBusiness,
      tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
    },
    {
      title: "Pending tasks",
      value: pendingTasks.toLocaleString(),
      icon: Clock,
      tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
    },
    {
      title: "Monthly revenue",
      value: formatCurrency(monthlyRevenue._sum.value ?? 0),
      icon: DollarSign,
      tone: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Sales command center
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track customer relationships, open opportunities, task follow-up, and
            revenue momentum in one focused workspace.
          </p>
        </div>
        <Badge tone="green" className="w-fit">
          Live workspace
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-md p-2 ${stat.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-normal">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Revenue from won leads</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.some((item) => item.revenue > 0) ? (
              <RevenueChart data={chartData} />
            ) : (
              <EmptyState
                icon={DollarSign}
                title="No won revenue yet"
                description="Move a lead to Won and the monthly chart will start filling in."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentTasks.length ? (
              urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-md border bg-background p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{task.title}</p>
                    <Badge tone={task.priority === "HIGH" ? "red" : "amber"}>
                      {humanizeEnum(task.priority)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {task.customer?.name ?? task.lead?.name ?? "General task"} ·{" "}
                    {formatDate(task.dueDate)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="All clear"
                description="There are no pending tasks waiting for attention."
              />
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length ? (
            <div className="divide-y">
              {activities.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.detail ?? humanizeEnum(item.type)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No activity yet"
              description="Customer, lead, note, and task updates will appear here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
