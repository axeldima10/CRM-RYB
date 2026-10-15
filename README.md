# CRM-RYB

A SaaS CRM MVP for Rise Your Business (RYB), designed to centralize lead management, client follow-up, meetings, quotes, payments, commissions, projects, and business-development activity.

The application supports three user groups: administrators, business developers, and clients. Role-based dashboards and access guards organize each user's workflow.

## Product scope

- Lead and prospect tracking
- Meeting and quote follow-up
- Payment and commission tracking
- Business developer management and training resources
- Project tracking for clients and administrators
- Audit log and account settings
- Dashboard KPIs and activity timeline

## Technology

- React 18 + TypeScript + Vite
- Tailwind CSS and shadcn/ui
- React Router
- Supabase (Auth, PostgreSQL, Row Level Security, real-time and storage)
- Recharts and Lucide React

The current MVP includes demo data for immediate preview, with Supabase integration prepared for activation. Treat demo data as sample content, not production customer data.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL after startup.

## Quality checks

```bash
npm run lint
npm run build
```

## Configuration

Copy `.env.example` to `.env` and configure the Supabase values required by `src/services/supabase.ts`. Never commit real credentials or production secrets.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the product architecture, route map, project structure, roles, and implementation trade-offs.

## Status

This repository represents an MVP codebase. Confirm which flows are connected to live Supabase services before using it with real customer or financial data.
