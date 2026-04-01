import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { DataTable } from '../components/shared/DataTable';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader } from '../components/shared/PageHeader';
import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { useFormatDate } from '../hooks/useFormatDate';
import { demoPayments, demoLeads } from '../data/demo';
import type { Payment } from '../types/database';

export function PaymentsPage() {
  const formatCurrency = useFormatCurrency();
  const { format } = useFormatDate();

  const paymentsWithLeads = demoPayments.map((p) => ({
    ...p,
    lead: demoLeads.find((l) => l.id === p.lead_id),
  }));

  const totalReceived = demoPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = demoPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (p: Payment & { lead?: typeof demoLeads[0] }) => (
        <div>
          <p className="font-medium text-slate-900">{p.reference || '—'}</p>
          <p className="text-xs text-slate-500">{p.lead?.project_title}</p>
        </div>
      ),
    },
    {
      key: 'payment_type',
      header: 'Type',
      render: (p: Payment) => (
        <span className="capitalize text-slate-700">{p.payment_type}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (p: Payment) => (
        <span className="font-semibold text-slate-900">{formatCurrency(p.amount, p.currency)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Payment) => <StatusBadge status={p.status} />,
    },
    {
      key: 'paid_at',
      header: 'Paid At',
      render: (p: Payment) => (
        <span className="text-slate-500">{p.paid_at ? format(p.paid_at) : '—'}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (p: Payment) => (
        <span className="text-slate-500">{p.due_date ? format(p.due_date) : '—'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Track all incoming payments" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Received</p>
              <p className="text-xl font-bold">{formatCurrency(totalReceived)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-bold">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Payments</p>
              <p className="text-xl font-bold">{demoPayments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={paymentsWithLeads}
            keyExtractor={(p) => p.id}
            emptyMessage="No payments recorded"
          />
        </CardContent>
      </Card>
    </div>
  );
}
