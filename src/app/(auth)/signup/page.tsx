import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-lg bg-muted" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
