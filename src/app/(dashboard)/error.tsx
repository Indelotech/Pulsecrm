"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-8 shadow-panel">
      <div className="flex max-w-xl items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Something went sideways</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "The dashboard could not finish loading."}
          </p>
          <Button className="mt-5" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
