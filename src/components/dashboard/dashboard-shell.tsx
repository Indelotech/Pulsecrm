"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  CheckSquare,
  Home,
  Menu,
  Settings,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn, initials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/leads", label: "Leads", icon: BriefcaseBusiness },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings }
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  children,
  user,
  companyName
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
  companyName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/35">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-card/95 px-4 py-5 shadow-sm backdrop-blur md:flex md:flex-col">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold">PulseCRM</p>
            <p className="text-xs text-muted-foreground">{companyName}</p>
          </div>
        </Link>
        <Navigation />
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between rounded-lg border bg-background p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-semibold text-accent-foreground">
                {initials(user.name ?? user.email)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name ?? "Owner"}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card/90 px-4 backdrop-blur md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5 text-primary" />
          PulseCRM
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur md:hidden">
          <div className="h-full w-80 max-w-[85vw] border-r bg-card p-4 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold">PulseCRM</p>
                <p className="text-xs text-muted-foreground">{companyName}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Navigation onNavigate={() => setOpen(false)} />
            <div className="mt-8 border-t pt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      ) : null}

      <main className="px-4 py-6 md:ml-72 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
