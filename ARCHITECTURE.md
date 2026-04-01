# CRM-RYB — Architecture Document

## 1. Architecture Summary

CRM-RYB is a modern SaaS CRM platform built to centralize the relationship between an **Admin** (Axel), **Business Developers (BDs)**, and **Clients**. It replaces scattered WhatsApp communication with transparent, traceable, premium tracking.

### Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + TypeScript + Vite | Type-safe, fast dev experience, modern tooling |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with premium, accessible components |
| **Charts** | Recharts | Composable charts that integrate well with React |
| **Routing** | React Router v6 | Industry-standard routing with nested layouts |
| **Backend** | Supabase | Auth, Postgres DB, RLS, real-time, storage — all-in-one |
| **Icons** | Lucide React | Clean, consistent icon set |

### Trade-offs

- **Supabase over custom backend**: Faster time-to-market, built-in auth/RLS/realtime. Trade-off: less control over server-side logic (mitigated by Supabase Edge Functions when needed).
- **Demo data over live Supabase**: MVP ships with demo data for immediate preview. Supabase integration is pre-wired and ready to activate.
- **Client-side state over Redux/Zustand**: React Context is sufficient for auth state. Can add Zustand if state complexity grows.

---

## 2. Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Topbar, AppLayout
│   ├── shared/          # KPICard, StatusBadge, DataTable, ActivityTimeline, EmptyState, PageHeader
│   └── ui/              # Button, Card, Badge, Dialog, Input, Select, Tabs, Progress, etc.
├── contexts/
│   └── AuthContext.tsx   # Authentication state & demo user switching
├── data/
│   └── demo.ts          # Demo/mock data for all entities
├── hooks/
│   ├── useFormatCurrency.ts
│   └── useFormatDate.ts
├── lib/
│   └── utils.ts         # cn() utility for Tailwind class merging
├── pages/
│   ├── auth/            # LoginPage, SignupPage
│   ├── admin/           # AdminDashboard
│   ├── bd/              # BDDashboard
│   ├── client/          # ClientDashboard
│   ├── LeadsPage.tsx
│   ├── MeetingsPage.tsx
│   ├── QuotesPage.tsx
│   ├── PaymentsPage.tsx
│   ├── CommissionsPage.tsx
│   ├── BDsPage.tsx
│   ├── ProjectsPage.tsx
│   ├── TrainingPage.tsx
│   ├── AuditLogPage.tsx
│   └── SettingsPage.tsx
├── routes/
│   ├── AuthGuard.tsx    # Redirect unauthenticated users
│   ├── RoleGuard.tsx    # Restrict access by role
│   └── DashboardRouter.tsx  # Route to role-specific dashboard
├── services/
│   └── supabase.ts      # Supabase client initialization
├── types/
│   └── database.ts      # TypeScript types matching Supabase schema
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Tailwind directives + base styles
```

---

## 3. Pages & Routing

| Route | Page | Roles |
|-------|------|-------|
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/dashboard` | Role-based dashboard | All (auto-routed) |
| `/leads` | Lead management | Admin, BD |
| `/meetings` | Meeting scheduler | Admin, BD |
| `/quotes` | Quote tracking | Admin, BD |
| `/payments` | Payment tracking | Admin, BD |
| `/commissions` | Commission management | Admin, BD |
| `/bds` | BD team overview | Admin |
| `/projects` | Project tracking | Admin, Client |
| `/training` | Training resources | BD |
| `/audit` | Audit log | Admin |
| `/settings` | User settings | All |

---

## 4. Reusable Components

| Component | Description |
|-----------|-------------|
| `Sidebar` | Collapsible nav with role-filtered links |
| `Topbar` | Search bar, demo role switcher, notifications |
| `KPICard` | Metric card with icon, value, trend, color coding |
| `DataTable` | Generic table with column definitions, row click, empty state |
| `StatusBadge` | Color-coded badge for any status type |
| `ActivityTimeline` | Chronological activity feed with icons |
| `PageHeader` | Page title, description, action buttons |
| `EmptyState` | Empty data placeholder with optional CTA |
| `Button` | Variants: default, outline, secondary, ghost, destructive, link |
| `Card` | Container with header, content, footer sections |
| `Dialog` | Modal with header, body, footer |
| `Badge` | Status indicators with color variants |
| `Progress` | Progress bar component |
| `Tabs` | Tabbed content |
| `Input/Select/Textarea` | Form controls |

---

## 5. Supabase Schema

See `supabase/schema.sql` for the complete SQL migration. Key tables:

- **profiles** — User accounts (admin, bd, client)
- **leads** — Sales pipeline entries linked to BDs
- **meetings** — Scheduled meetings tied to leads
- **quotes** — Price proposals for leads
- **payments** — Payment records (deposit, milestone, final)
- **commissions** — BD commission tracking
- **projects** — Client-facing project tracker
- **deliverables** — Project milestones/deliverables
- **activity_log** — Full audit trail
- **training_resources** — BD training materials

### Key Relationships

```
profiles (1) ──< leads (N) ──< meetings (N)
                            ──< quotes (N)
                            ──< payments (N)
                            ──< commissions (N)
                            ──< projects (N) ──< deliverables (N)
profiles (1) ──< activity_log (N)
profiles (1) ──< projects (N) [client_id]
```

---

## 6. Row-Level Security (RLS)

| Table | Admin | BD | Client |
|-------|-------|------|--------|
| profiles | Full access | Read own + other BDs; update own | Read/update own |
| leads | Full access | Full access to own leads | — |
| meetings | Full access | Full access to own meetings | — |
| quotes | Full access | Full access (via own leads) | — |
| payments | Full access | Read only (via own leads) | — |
| commissions | Full access | Read own | — |
| projects | Full access | — | Read own |
| deliverables | Full access | — | Read own (via projects) |
| activity_log | Read all | Read own | — |
| training | Full access | Read all | — |

---

## 7. Business Flows

### BD Onboarding
1. BD signs up → profile created with `role: 'bd'`
2. Admin activates account
3. BD accesses dashboard + training kit

### Lead Lifecycle
```
new → contacted → meeting_scheduled → meeting_done → quote_sent → quote_signed → deposit_received → in_progress → delivered → paid
                                                                                                                          ↘ lost (at any stage)
```

### Meeting Flow
1. BD creates meeting linked to a lead
2. Status: `scheduled` → `completed` / `cancelled` / `no_show`
3. Outcome notes recorded

### Quote → Payment → Commission
1. Quote created for lead → sent → signed
2. Payments recorded (deposit, milestone, final)
3. Commission auto-calculated (percentage of deal value)
4. Admin approves → marks as paid

### Client Portal
1. Admin/BD creates project linked to lead + client
2. Client sees progress, current phase, next action, deliverables
3. No messaging needed — status is always visible

---

## 8. UI/UX Direction

- **Style**: Clean, neutral SaaS aesthetic (slate/gray palette with emerald/blue/amber accents)
- **Typography**: System font stack with tight tracking
- **Cards**: Rounded corners (xl), subtle shadows, hover elevation
- **Tables**: Clean with subtle dividers, hover rows
- **Status colors**: Blue (info), Amber (warning), Emerald (success), Red (destructive)
- **Animations**: Subtle fade-in, scale transitions
- **Mobile**: Responsive grid, collapsible sidebar
- **Inspiration**: Linear, Vercel, Stripe Dashboard

---

## 9. MVP Plan

### Phase 1 — MVP (Current)
- Login/Signup with demo data
- Role-based dashboards (Admin, BD, Client)
- Lead CRUD + pipeline view
- Meeting scheduling
- Quote tracking
- Payment tracking
- Commission management
- Client project portal with deliverables
- Audit log
- BD training kit
- Settings page

### Phase 2 — Supabase Integration
- Connect to live Supabase project
- Real authentication (email + password)
- Live CRUD operations
- Real-time updates
- File uploads (quotes, deliverables)

### Phase 3 — Advanced Features
- Email notifications (Supabase Edge Functions)
- Calendar integration
- PDF quote generation
- Advanced analytics & reports
- Multi-currency support
- Kanban board for leads
- Client messaging system

### What to Avoid Initially
- Over-engineering with complex state management
- Building a custom backend
- Real-time chat (use status tracking instead)
- Complex role hierarchies beyond the 3 defined roles
