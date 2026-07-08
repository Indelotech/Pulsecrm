"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email,
            password,
            companyName: formData.get("companyName")
          })
        });

        if (!response.ok) {
          const data = (await response.json()) as { message?: string };
          throw new Error(data.message ?? "Unable to create account.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function useDemoAccount() {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: "demo@pulsecrm.app",
      password: "password123",
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (result?.error) {
      setError("Seed the demo account first with npm run db:seed.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border bg-card p-6 shadow-panel">
      <div className="mb-6">
        <Link href="/" className="text-sm font-semibold text-primary">
          PulseCRM
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-normal">
          {mode === "login" ? "Welcome back" : "Create your workspace"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to manage your pipeline and customer activity."
            : "Start with a focused CRM built for small business teams."}
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input id="companyName" name="companyName" required />
            </div>
          </>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={mode === "signup" ? 8 : undefined}
            required
          />
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        disabled={loading}
        onClick={useDemoAccount}
      >
        Use demo account
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? "New to PulseCRM?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/signup" : "/login"}
          className="font-semibold text-primary"
        >
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
