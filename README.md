# PulseCRM

A production-ready SaaS CRM dashboard built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth/Auth.js, Zod, Recharts, and shadcn-style UI primitives.

## Features

- Landing page with hero, features, pricing, testimonials, and CTAs
- Credentials authentication with signup, login, logout, protected dashboard routes, and demo account
- Dashboard metrics, recent activity, priority follow-up, and revenue chart
- Customer CRUD with search, filters, details, linked tasks, and notes
- Lead CRUD with status pipeline, value tracking, expected close dates, and notes
- Task CRUD with due dates, statuses, priorities, and customer/lead assignment
- Settings page with profile, company name, and light/dark theme toggle
- Loading, empty, and error states across the app
- Prisma schema, initial migration, and seed data for demo use

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth/Auth.js credentials provider
- Zod validation
- Recharts
- Vercel-ready configuration

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in `.env`.

4. Run the database migration:

```bash
npm run db:migrate
```

5. Seed the demo workspace:

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Demo login:

```text
Email: demo@pulsecrm.app
Password: password123
```

## Vercel Deployment

1. Create a PostgreSQL database. Vercel Postgres, Neon, Supabase, or Railway all work.
2. Add these environment variables in Vercel:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` set to your production URL, for example `https://your-app.vercel.app`
3. Deploy the project to Vercel.
4. Run migrations against production:

```bash
npm run db:deploy
```

5. Optionally seed a demo workspace:

```bash
npm run db:seed
```

## Useful Scripts

```bash
npm run dev        # Start local development
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run Next.js linting
npm run typecheck  # Run TypeScript checks
npm run db:migrate # Create/apply local migrations
npm run db:deploy  # Apply migrations in production
npm run db:seed    # Seed demo data
npm run db:studio  # Open Prisma Studio
```

## Project Structure

```text
src/app
  (auth)          Login and signup pages
  (dashboard)     Protected dashboard, CRM modules, settings, server actions
  api/auth        NextAuth and registration route handlers
src/components    Shared UI, auth, dashboard shell, charts
src/lib           Prisma client, auth config, validation, utilities
prisma            Schema, migration, and seed data
```
