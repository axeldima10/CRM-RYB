import { Award, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { DataTable } from '../components/shared/DataTable';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader } from '../components/shared/PageHeader';
import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { useFormatDate } from '../hooks/useFormatDate';
import { useAuth } from '../contexts/AuthContext';
import { demoCommissions } from '../data/demo';
import { Button } from '../components/ui/button';
import type { Commission } from '../types/database';

export function CommissionsPage() {
  const { user } = useAuth();
  const formatCurrency = useFormatCurrency();
  const { format } = useFormatDate();

  const isAdmin = user?.role === 'admin';
  const commissions = isAdmin
    ? demoCommissions
    : demoCommissions.filter((c) => c.bd_id === user?.id);

  const totalDue = commissions
    .filter((c) => c.status !== 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPaid = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const columns = [
    ...(isAdmin
      ? [
          {
            key: 'bd',
            header: 'BD',
            render: (c: Commission) => (
              <span className="font-medium text-slate-900">{c.bd?.full_name || '—'}</span>
            ),
          },
        ]
      : []),
    {
      key: 'lead',
      header: 'Lead / Project',
      render: (c: Commission) => (
        <span className="text-slate-700">{c.lead?.project_title || '—'}</span>
      ),
    },
    {
      key: 'percentage',
      header: 'Rate',
      render: (c: Commission) => <span className="text-slate-600">{c.percentage}%</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (c: Commission) => (
        <span className="font-semibold text-slate-900">{formatCurrency(c.amount, c.currency)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Commission) => <StatusBadge status={c.status} />,
    },
    {
      key: 'paid_at',
      header: 'Paid At',
      render: (c: Commission) => (
        <span className="text-slate-500">{c.paid_at ? format(c.paid_at) : '—'}</span>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: '',
            render: (c: Commission) =>
              c.status === 'approved' ? (
                <Button size="sm" variant="outline" className="text-xs">
                  Mark Paid
                </Button>
              ) : c.status === 'pending' ? (
                <Button size="sm" variant="outline" className="text-xs">
                  Approve
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description={isAdmin ? 'Manage BD commissions' : 'Your commission tracking'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Paid</p>
              <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Due</p>
              <p className="text-xl font-bold">{formatCurrency(totalDue)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Entries</p>
              <p className="text-xl font-bold">{commissions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={commissions}
            keyExtractor={(c) => c.id}
            emptyMessage="No commissions yet"
          />
        </CardContent>
      </Card>
    </div>
  );
}
