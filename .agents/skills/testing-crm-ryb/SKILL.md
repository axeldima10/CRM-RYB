# Testing CRM-RYB

## Overview
CRM-RYB is a React + TypeScript SaaS CRM with 3 role-based dashboards (Admin, BD, Client). It runs in demo mode with in-memory auth and demo data — no Supabase connection needed.

## Prerequisites
- Node.js 18+
- Dev server: `npm run dev` from repo root (Vite, typically on port 5173+)

## Demo Login
- Navigate to the app root URL — it redirects to `/login`
- 3 demo buttons at the bottom of the login form:
  - **Admin** — logs in as Axel Ganmo (axel@ryb-agency.com)
  - **BD** — logs in as Sarah Diallo (sarah@ryb-agency.com)
  - **Client** — logs in as Fatou Sow (fatou@senegal-tech.sn)
- Password for all demo accounts: `demo`

## Role Switching
- Top bar shows a "{role} View" button (e.g. "Admin View")
- Click it to open a dropdown with "Admin (Axel)", "BD (Sarah)", "Client (Fatou)"
- Switching roles updates the dashboard, sidebar, and user profile instantly

## Sidebar Navigation Per Role
- **Admin (11 items):** Dashboard, Leads, Projects, Meetings, Quotes, Payments, Commissions, BDs, Audit Log, Settings
- **BD (8 items):** Dashboard, Leads, Meetings, Quotes, Payments, Commissions, Training, Settings
- **Client (3 items):** Dashboard, Projects, Settings

## Expected KPI Values (from demo data)
- **Admin:** Active BDs=2, Active Leads=4, Meetings This Week=2, Conversion Rate=57%, Quotes Pending=1, Deals Signed=3, Total Revenue=15,000,000 F CFA, Commissions Due=850,000 F CFA
- **BD:** Total Leads=4, Meetings Scheduled=1, Quotes Sent=1, Conversion Rate=66%, Commissions Due=250,000, Commissions Paid=900,000
- **Client:** Total Projects=1, Active=1, Completed=0, Next Milestone="Payment Integration — April 10"

## Known Limitations
- **In-memory auth:** Demo auth state is stored in React context (not localStorage). Full page reload or URL bar navigation causes auth loss and redirect to /login. This means RoleGuard route protection cannot be tested via direct URL navigation in demo mode. With real Supabase auth, route guards would work correctly.
- **No backend:** All data is static demo data from `src/data/demo.ts`. Form submissions (New Lead, Settings save, etc.) don't persist.

## Testing Tips
- Test role switching via the top bar dropdown rather than logging out and back in
- Verify KPI values against the expected values above to ensure demo data renders correctly
- Check sidebar item count per role to verify role-based navigation filtering
- The "New Lead" button on the Leads page opens a dialog — verify all form fields render
- Meetings page shows cards (not a table) — verify completed meetings show outcomes
- Audit Log page has entity and action filter dropdowns

## Devin Secrets Needed
None — the app runs entirely in demo mode without external services.
