-- ============================================================
-- CRM-RYB — Supabase Database Schema
-- Complete SQL migration for the CRM platform
-- ============================================================

-- ── Extensions ────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ─────────────────────────────────────────────────
create type user_role as enum ('admin', 'bd', 'client');
create type lead_status as enum (
  'new', 'contacted', 'meeting_scheduled', 'meeting_done',
  'quote_sent', 'quote_signed', 'deposit_received',
  'in_progress', 'delivered', 'paid', 'lost'
);
create type meeting_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');
create type payment_status as enum ('pending', 'partial', 'paid', 'overdue');
create type commission_status as enum ('pending', 'approved', 'paid');
create type project_status as enum ('planning', 'in_progress', 'review', 'completed', 'on_hold');
create type deliverable_status as enum ('pending', 'in_progress', 'completed');
create type payment_type as enum ('deposit', 'milestone', 'final');
create type training_type as enum ('pdf', 'video', 'link');

-- ── Profiles ──────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role user_role not null default 'client',
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_role on profiles(role);
create index idx_profiles_email on profiles(email);

-- ── Leads ─────────────────────────────────────────────────
create table leads (
  id uuid primary key default uuid_generate_v4(),
  bd_id uuid not null references profiles(id) on delete restrict,
  client_name text not null,
  client_email text,
  client_phone text,
  company_name text,
  project_title text not null,
  project_description text,
  status lead_status not null default 'new',
  estimated_value numeric(15, 2),
  currency text not null default 'XOF',
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_bd_id on leads(bd_id);
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at desc);

-- ── Meetings ──────────────────────────────────────────────
create table meetings (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  bd_id uuid not null references profiles(id) on delete restrict,
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30,
  location text,
  meeting_url text,
  status meeting_status not null default 'scheduled',
  outcome_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_meetings_lead_id on meetings(lead_id);
create index idx_meetings_bd_id on meetings(bd_id);
create index idx_meetings_scheduled_at on meetings(scheduled_at);
create index idx_meetings_status on meetings(status);

-- ── Quotes ────────────────────────────────────────────────
create table quotes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  amount numeric(15, 2) not null,
  currency text not null default 'XOF',
  description text,
  file_url text,
  sent_at timestamptz,
  signed_at timestamptz,
  is_signed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_quotes_lead_id on quotes(lead_id);

-- ── Payments ──────────────────────────────────────────────
create table payments (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  amount numeric(15, 2) not null,
  currency text not null default 'XOF',
  payment_type payment_type not null,
  status payment_status not null default 'pending',
  due_date timestamptz,
  paid_at timestamptz,
  reference text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_lead_id on payments(lead_id);
create index idx_payments_status on payments(status);

-- ── Commissions ───────────────────────────────────────────
create table commissions (
  id uuid primary key default uuid_generate_v4(),
  bd_id uuid not null references profiles(id) on delete restrict,
  lead_id uuid not null references leads(id) on delete cascade,
  amount numeric(15, 2) not null,
  currency text not null default 'XOF',
  percentage numeric(5, 2) not null,
  status commission_status not null default 'pending',
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_commissions_bd_id on commissions(bd_id);
create index idx_commissions_lead_id on commissions(lead_id);
create index idx_commissions_status on commissions(status);

-- ── Projects ──────────────────────────────────────────────
create table projects (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  client_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  status project_status not null default 'planning',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  current_phase text,
  next_action text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_lead_id on projects(lead_id);
create index idx_projects_client_id on projects(client_id);
create index idx_projects_status on projects(status);

-- ── Deliverables ──────────────────────────────────────────
create table deliverables (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  status deliverable_status not null default 'pending',
  due_date date,
  file_url text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_deliverables_project_id on deliverables(project_id);

-- ── Activity Log (Audit Trail) ────────────────────────────
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete restrict,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  details text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index idx_activity_log_user_id on activity_log(user_id);
create index idx_activity_log_entity on activity_log(entity_type, entity_id);
create index idx_activity_log_created_at on activity_log(created_at desc);

-- ── Training Resources ────────────────────────────────────
create table training_resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type training_type not null,
  url text not null,
  category text,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── Updated At Trigger ────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles for each row execute function update_updated_at();
create trigger trg_leads_updated before update on leads for each row execute function update_updated_at();
create trigger trg_meetings_updated before update on meetings for each row execute function update_updated_at();
create trigger trg_quotes_updated before update on quotes for each row execute function update_updated_at();
create trigger trg_payments_updated before update on payments for each row execute function update_updated_at();
create trigger trg_commissions_updated before update on commissions for each row execute function update_updated_at();
create trigger trg_projects_updated before update on projects for each row execute function update_updated_at();
create trigger trg_deliverables_updated before update on deliverables for each row execute function update_updated_at();

-- ── Audit Log Trigger ─────────────────────────────────────
create or replace function log_lead_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into activity_log (user_id, entity_type, entity_id, action, details)
    values (
      new.bd_id,
      'lead',
      new.id,
      'status_changed',
      format('Status changed from "%s" to "%s"', old.status, new.status)
    );
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_lead_status_audit
  after update on leads
  for each row execute function log_lead_status_change();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table profiles enable row level security;
alter table leads enable row level security;
alter table meetings enable row level security;
alter table quotes enable row level security;
alter table payments enable row level security;
alter table commissions enable row level security;
alter table projects enable row level security;
alter table deliverables enable row level security;
alter table activity_log enable row level security;
alter table training_resources enable row level security;

-- ── Helper: get current user's role ───────────────────────
create or replace function get_user_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer stable;

-- ── Profiles RLS ──────────────────────────────────────────
-- Admin: see all
create policy "admin_all_profiles" on profiles
  for all using (get_user_role() = 'admin');

-- BD: see own profile + other BDs (read-only)
create policy "bd_read_profiles" on profiles
  for select using (
    get_user_role() = 'bd' and (id = auth.uid() or role = 'bd')
  );

create policy "bd_update_own_profile" on profiles
  for update using (get_user_role() = 'bd' and id = auth.uid());

-- Client: see own profile only
create policy "client_own_profile" on profiles
  for select using (get_user_role() = 'client' and id = auth.uid());

create policy "client_update_own_profile" on profiles
  for update using (get_user_role() = 'client' and id = auth.uid());

-- ── Leads RLS ─────────────────────────────────────────────
-- Admin: full access
create policy "admin_all_leads" on leads
  for all using (get_user_role() = 'admin');

-- BD: full access to own leads
create policy "bd_own_leads" on leads
  for all using (get_user_role() = 'bd' and bd_id = auth.uid());

-- ── Meetings RLS ──────────────────────────────────────────
create policy "admin_all_meetings" on meetings
  for all using (get_user_role() = 'admin');

create policy "bd_own_meetings" on meetings
  for all using (get_user_role() = 'bd' and bd_id = auth.uid());

-- ── Quotes RLS ────────────────────────────────────────────
create policy "admin_all_quotes" on quotes
  for all using (get_user_role() = 'admin');

create policy "bd_own_quotes" on quotes
  for all using (
    get_user_role() = 'bd' and
    lead_id in (select id from leads where bd_id = auth.uid())
  );

-- ── Payments RLS ──────────────────────────────────────────
create policy "admin_all_payments" on payments
  for all using (get_user_role() = 'admin');

create policy "bd_read_own_payments" on payments
  for select using (
    get_user_role() = 'bd' and
    lead_id in (select id from leads where bd_id = auth.uid())
  );

-- ── Commissions RLS ───────────────────────────────────────
create policy "admin_all_commissions" on commissions
  for all using (get_user_role() = 'admin');

create policy "bd_read_own_commissions" on commissions
  for select using (get_user_role() = 'bd' and bd_id = auth.uid());

-- ── Projects RLS ──────────────────────────────────────────
create policy "admin_all_projects" on projects
  for all using (get_user_role() = 'admin');

create policy "client_own_projects" on projects
  for select using (get_user_role() = 'client' and client_id = auth.uid());

-- ── Deliverables RLS ──────────────────────────────────────
create policy "admin_all_deliverables" on deliverables
  for all using (get_user_role() = 'admin');

create policy "client_own_deliverables" on deliverables
  for select using (
    get_user_role() = 'client' and
    project_id in (select id from projects where client_id = auth.uid())
  );

-- ── Activity Log RLS ──────────────────────────────────────
create policy "admin_all_logs" on activity_log
  for select using (get_user_role() = 'admin');

create policy "bd_own_logs" on activity_log
  for select using (get_user_role() = 'bd' and user_id = auth.uid());

-- ── Training Resources RLS ────────────────────────────────
create policy "admin_all_training" on training_resources
  for all using (get_user_role() = 'admin');

create policy "bd_read_training" on training_resources
  for select using (get_user_role() = 'bd');
