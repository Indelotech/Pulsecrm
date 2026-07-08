import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "PulseCRM | SaaS CRM Dashboard",
  description:
    "A production-ready CRM SaaS for managing customers, leads, tasks, notes, and sales activity."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
