import { FileText, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { DataTable } from '../components/shared/DataTable';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader } from '../components/shared/PageHeader';
import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { useFormatDate } from '../hooks/useFormatDate';
import { demoQuotes, demoLeads } from '../data/demo';
import type { Quote } from '../types/database';

export function QuotesPage() {
  const formatCurrency = useFormatCurrency();
  const { format } = useFormatDate();

  const quotesWithLeads = demoQuotes.map((q) => ({
    ...q,
    lead: demoLeads.find((l) => l.id === q.lead_id),
  }));

  const columns = [
    {
      key: 'description',
      header: 'Quote',
      render: (q: Quote & { lead?: typeof demoLeads[0] }) => (
        <div>
          <p className="font-medium text-slate-900">{q.description}</p>
          <p className="text-xs text-slate-500">{q.lead?.client_name}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (q: Quote) => (
        <span className="font-semibold text-slate-900">{formatCurrency(q.amount, q.currency)}</span>
      ),
    },
    {
      key: 'sent_at',
      header: 'Sent',
      render: (q: Quote) => (
        <div className="flex items-center gap-1.5">
          {q.sent_at ? (
            <>
              <Send className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-slate-600">{format(q.sent_at)}</span>
            </>
          ) : (
            <span className="text-slate-400">Not sent</span>
          )}
        </div>
      ),
    },
    {
      key: 'signed',
      header: 'Signed',
      render: (q: Quote) => (
        <div className="flex items-center gap-1.5">
          {q.is_signed ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600">{q.signed_at ? format(q.signed_at) : 'Yes'}</span>
            </>
          ) : (
            <StatusBadge status="pending" />
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (q: Quote) => <span className="text-slate-500">{format(q.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotes"
        description="Manage and track all quotes"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Quotes</p>
              <p className="text-xl font-bold">{demoQuotes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Send className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Signature</p>
              <p className="text-xl font-bold">{demoQuotes.filter((q) => !q.is_signed).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Signed</p>
              <p className="text-xl font-bold">{demoQuotes.filter((q) => q.is_signed).length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={quotesWithLeads}
            keyExtractor={(q) => q.id}
            emptyMessage="No quotes yet"
          />
        </CardContent>
      </Card>
    </div>
  );
}
