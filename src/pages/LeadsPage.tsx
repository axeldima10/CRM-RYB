import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { DataTable } from '../components/shared/DataTable';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader } from '../components/shared/PageHeader';
import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { useFormatDate } from '../hooks/useFormatDate';
import { useAuth } from '../contexts/AuthContext';
import { demoLeads } from '../data/demo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import type { Lead } from '../types/database';

export function LeadsPage() {
  const { user } = useAuth();
  const formatCurrency = useFormatCurrency();
  const { format } = useFormatDate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const isAdmin = user?.role === 'admin';

  const leads = demoLeads.filter((lead) => {
    if (!isAdmin && lead.bd_id !== user?.id) return false;
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        lead.project_title.toLowerCase().includes(q) ||
        lead.client_name.toLowerCase().includes(q) ||
        (lead.company_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: 'project_title',
      header: 'Project',
      render: (lead: Lead) => (
        <div>
          <p className="font-medium text-slate-900">{lead.project_title}</p>
          <p className="text-xs text-slate-500">{lead.company_name}</p>
        </div>
      ),
    },
    {
      key: 'client_name',
      header: 'Client',
      render: (lead: Lead) => (
        <div>
          <p className="text-slate-700">{lead.client_name}</p>
          <p className="text-xs text-slate-400">{lead.client_email}</p>
        </div>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'bd',
            header: 'BD',
            render: (lead: Lead) => (
              <span className="text-slate-700">{lead.bd?.full_name || '—'}</span>
            ),
          },
        ]
      : []),
    {
      key: 'estimated_value',
      header: 'Value',
      render: (lead: Lead) => (
        <span className="font-medium">
          {lead.estimated_value ? formatCurrency(lead.estimated_value) : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead: Lead) => <StatusBadge status={lead.status} />,
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (lead: Lead) => (
        <span className="text-slate-500">{format(lead.created_at)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={isAdmin ? 'All leads across BDs' : 'Your sales pipeline'}
        actions={
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" /> New Lead
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="meeting_scheduled">Meeting Scheduled</option>
                <option value="quote_sent">Quote Sent</option>
                <option value="quote_signed">Quote Signed</option>
                <option value="in_progress">In Progress</option>
                <option value="paid">Paid</option>
                <option value="lost">Lost</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={leads}
            keyExtractor={(lead) => lead.id}
            emptyMessage="No leads found"
          />
        </CardContent>
      </Card>

      {/* Create Lead Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>Add a new lead to your pipeline</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateDialog(false); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Name</label>
                <Input placeholder="Full name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input placeholder="Company name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="client@example.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="+221 77 000 0000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <Input placeholder="Project name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Brief project description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Value (XOF)</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Select>
                  <option value="">Select source</option>
                  <option value="referral">Referral</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Website</option>
                  <option value="event">Event</option>
                  <option value="social_media">Social Media</option>
                  <option value="cold_call">Cold Call</option>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
