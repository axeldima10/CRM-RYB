import { Target, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { PageHeader } from '../components/shared/PageHeader';
import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { demoProfiles, demoLeads, demoCommissions } from '../data/demo';

export function BDsPage() {
  const formatCurrency = useFormatCurrency();
  const bds = demoProfiles.filter((p) => p.role === 'bd');

  return (
    <div className="space-y-6">
      <PageHeader title="Business Developers" description="Manage and monitor your BD team" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bds.map((bd) => {
          const bdLeads = demoLeads.filter((l) => l.bd_id === bd.id);
          const bdCommissions = demoCommissions.filter((c) => c.bd_id === bd.id);
          const totalCommPaid = bdCommissions
            .filter((c) => c.status === 'paid')
            .reduce((s, c) => s + c.amount, 0);
          const totalCommDue = bdCommissions
            .filter((c) => c.status !== 'paid')
            .reduce((s, c) => s + c.amount, 0);
          const wonLeads = bdLeads.filter((l) =>
            ['quote_signed', 'deposit_received', 'in_progress', 'delivered', 'paid'].includes(l.status)
          );
          const conversionRate = bdLeads.length > 0 ? Math.round((wonLeads.length / bdLeads.length) * 100) : 0;
          const initials = bd.full_name.split(' ').map((n) => n[0]).join('');

          return (
            <Card key={bd.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{bd.full_name}</CardTitle>
                    <p className="text-sm text-slate-500">{bd.email}</p>
                  </div>
                  <Badge variant={bd.is_active ? 'success' : 'secondary'} className="ml-auto">
                    {bd.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-slate-500">Leads</span>
                    </div>
                    <p className="text-lg font-bold">{bdLeads.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs text-slate-500">Conversion</span>
                    </div>
                    <p className="text-lg font-bold">{conversionRate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-xs text-slate-500">Comm. Paid</span>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(totalCommPaid)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-slate-500">Comm. Due</span>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(totalCommDue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
