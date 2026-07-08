import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const company = await prisma.company.findUnique({
    where: { id: user.companyId },
    select: { name: true }
  });

  return (
    <DashboardShell user={user} companyName={company?.name ?? "Workspace"}>
      {children}
    </DashboardShell>
  );
}
