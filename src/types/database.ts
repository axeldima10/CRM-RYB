// ============================================================
// CRM-RYB Database Types
// Maps directly to the Supabase schema
// ============================================================

export type UserRole = 'admin' | 'bd' | 'client';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'meeting_scheduled'
  | 'meeting_done'
  | 'quote_sent'
  | 'quote_signed'
  | 'deposit_received'
  | 'in_progress'
  | 'delivered'
  | 'paid'
  | 'lost';

export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';
export type CommissionStatus = 'pending' | 'approved' | 'paid';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  bd_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  company_name?: string;
  project_title: string;
  project_description?: string;
  status: LeadStatus;
  estimated_value?: number;
  currency: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  bd?: Profile;
  client?: Profile;
}

export interface Meeting {
  id: string;
  lead_id: string;
  bd_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_url?: string;
  status: MeetingStatus;
  outcome_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
  bd?: Profile;
}

export interface Quote {
  id: string;
  lead_id: string;
  amount: number;
  currency: string;
  description?: string;
  file_url?: string;
  sent_at?: string;
  signed_at?: string;
  is_signed: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
}

export interface Payment {
  id: string;
  lead_id: string;
  amount: number;
  currency: string;
  payment_type: 'deposit' | 'milestone' | 'final';
  status: PaymentStatus;
  due_date?: string;
  paid_at?: string;
  reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
}

export interface Commission {
  id: string;
  bd_id: string;
  lead_id: string;
  amount: number;
  currency: string;
  percentage: number;
  status: CommissionStatus;
  paid_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  bd?: Profile;
  lead?: Lead;
}

export interface Project {
  id: string;
  lead_id: string;
  client_id?: string;
  title: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  progress: number;
  current_phase?: string;
  next_action?: string;
  start_date?: string;
  end_date?: string;
  deliverables: Deliverable[];
  created_at: string;
  updated_at: string;
  // Joined
  lead?: Lead;
  client?: Profile;
}

export interface Deliverable {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  file_url?: string;
  completed_at?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  entity_type: 'lead' | 'meeting' | 'quote' | 'payment' | 'commission' | 'project' | 'user';
  entity_id: string;
  action: string;
  details?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  // Joined
  user?: Profile;
}

export interface TrainingResource {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  category?: string;
  order: number;
  created_at: string;
}

// Dashboard KPI types
export interface AdminKPIs {
  total_bds: number;
  active_leads: number;
  meetings_this_week: number;
  quotes_pending: number;
  deals_signed: number;
  revenue_total: number;
  commissions_due: number;
  commissions_paid: number;
  conversion_rate: number;
}

export interface BDKPIs {
  total_leads: number;
  active_leads: number;
  meetings_scheduled: number;
  quotes_sent: number;
  deals_signed: number;
  commissions_due: number;
  commissions_paid: number;
  conversion_rate: number;
}

export interface ClientKPIs {
  project_count: number;
  active_projects: number;
  completed_projects: number;
  next_milestone?: string;
}
