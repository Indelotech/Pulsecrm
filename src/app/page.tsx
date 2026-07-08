import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Customer clarity",
    description:
      "Keep profiles, notes, lifetime value, and follow-up history in one searchable customer record.",
    icon: Users
  },
  {
    title: "Pipeline control",
    description:
      "Move leads from new to won with status tracking, value fields, and timely activity signals.",
    icon: BarChart3
  },
  {
    title: "Task discipline",
    description:
      "Assign next steps to customers or leads with due dates, priorities, and clean completion states.",
    icon: CheckCircle2
  },
  {
    title: "Context-rich notes",
    description:
      "Log conversations against customers and leads so every interaction stays easy to recover.",
    icon: MessageSquareText
  }
];

const pricing = [
  {
    name: "Starter",
    price: "$19",
    description: "For owner-led teams getting organized.",
    perks: ["1 workspace", "Demo seed data", "Core CRM workflows"]
  },
  {
    name: "Growth",
    price: "$49",
    description: "For teams managing daily sales motion.",
    perks: ["Team-ready dashboard", "Pipeline analytics", "Priority task queues"],
    featured: true
  },
  {
    name: "Scale",
    price: "$99",
    description: "For operators standardizing revenue process.",
    perks: ["Advanced reporting", "Custom onboarding", "Admin controls"]
  }
];

const testimonials = [
  {
    quote:
      "PulseCRM gave our sales desk the shape it needed. Notes, tasks, and pipeline updates finally live together.",
    author: "Maya R.",
    role: "Founder, Studio North"
  },
  {
    quote:
      "The dashboard feels fast and calm. We can see customer risk and deal momentum without opening five tools.",
    author: "Daniel K.",
    role: "Operations Lead, Fleetwise"
  },
  {
    quote:
      "It has enough structure to keep the team honest, but it is not heavy. That balance matters.",
    author: "Priya S.",
    role: "Managing Partner, Brightline"
  }
];

export default function LandingPage() {
  return (
    <main className="bg-background">
      <section className="relative isolate min-h-[92vh] overflow-hidden border-b bg-slate-950 text-white">
        <div className="absolute inset-0 dashboard-grid opacity-20" />
        <div className="absolute inset-x-4 top-24 mx-auto h-[560px] max-w-6xl rounded-lg border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm">
          <div className="grid h-full grid-cols-[220px_1fr] overflow-hidden rounded-lg">
            <div className="hidden border-r border-white/10 bg-slate-900/80 p-5 md:block">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-500">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="font-semibold">PulseCRM</span>
              </div>
              <div className="space-y-3">
                {["Overview", "Customers", "Leads", "Tasks"].map((item, index) => (
                  <div
                    key={item}
                    className={`h-9 rounded-md ${index === 0 ? "bg-blue-500/90" : "bg-white/8"}`}
                  />
                ))}
              </div>
            </div>
            <div className="p-5 md:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="h-4 w-28 rounded bg-white/30" />
                  <div className="mt-3 h-8 w-56 rounded bg-white/70" />
                </div>
                <div className="h-10 w-28 rounded-md bg-teal-400/80" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {["bg-blue-400/85", "bg-emerald-400/80", "bg-amber-300/85", "bg-rose-400/80"].map(
                  (color) => (
                    <div key={color} className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <div className={`h-9 w-9 rounded-md ${color}`} />
                      <div className="mt-6 h-7 w-20 rounded bg-white/80" />
                      <div className="mt-3 h-3 w-24 rounded bg-white/30" />
                    </div>
                  )
                )}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <div className="h-64 rounded-lg border border-white/10 bg-white/10 p-5">
                  <div className="flex h-full items-end gap-3">
                    {[34, 52, 44, 70, 62, 86, 78].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t bg-blue-300/70"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-64 rounded-lg border border-white/10 bg-white/10 p-5">
                  <div className="space-y-4">
                    {[0, 1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-white/20" />
                        <div className="flex-1">
                          <div className="h-3 rounded bg-white/50" />
                          <div className="mt-2 h-2 w-2/3 rounded bg-white/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/76 to-slate-950" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-500">
              <BarChart3 className="h-5 w-5" />
            </span>
            PulseCRM
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#testimonials" className="hover:text-white">
              Customers
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-white text-slate-950 hover:bg-white/90">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-88px)] max-w-7xl flex-col justify-center px-6 pb-24 pt-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-200" />
              Production-ready CRM starter for serious SaaS demos
            </div>
            <h1 className="text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">
              The small-business CRM that keeps sales moving.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Manage customers, leads, tasks, notes, and revenue activity from a
              polished Next.js dashboard built with Prisma, PostgreSQL, Auth.js,
              Tailwind, Zod, and Recharts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-400">
                <Link href="/signup">
                  Create workspace <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/login">Try demo account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b bg-background py-20">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">
              Everything a lean revenue team needs to stay coordinated.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-lg border bg-card p-6 shadow-panel">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b bg-muted/40 py-20">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">
                Simple plans for growing customer relationships.
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Vercel-ready stack
            </div>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border bg-card p-6 shadow-panel ${
                  plan.featured ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.featured ? (
                    <span className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                      Popular
                    </span>
                  ) : null}
                </div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  <span className="pb-1 text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="border-b bg-background py-20">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-4xl">
              Built for teams that need clean process without heavy software.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author} className="rounded-lg border bg-card p-6 shadow-panel">
                <blockquote className="text-sm leading-6 text-muted-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <Clock3 className="h-4 w-4 text-amber-200" />
              Launch your CRM workflow today
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal">
              Start with the demo data, then connect your PostgreSQL database.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-white text-slate-950 hover:bg-white/90">
              <Link href="/signup">Create account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">View demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
