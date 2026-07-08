import { Building2, Save, ShieldCheck, UserCog } from "lucide-react";

import { updateSettings } from "@/app/(dashboard)/settings/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: sessionUser.id },
    include: { company: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-normal">
          Workspace settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manage your profile, company identity, and display preference.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile and company</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateSettings} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={user.name ?? ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email ?? ""} disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    defaultValue={user.company?.name ?? ""}
                    required
                  />
                </div>
              </div>
              <Button>
                <Save className="h-4 w-4" />
                Save settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Toggle between light and dark mode.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-md border bg-background p-3">
                <Building2 className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{user.company?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Created {formatDate(user.company?.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-md border bg-background p-3">
                <UserCog className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{user.role}</p>
                  <p className="text-sm text-muted-foreground">Current access level</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background p-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Auth.js credentials</span>
                </div>
                <Badge tone="green">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
