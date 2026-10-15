import {
  Target,
  Calendar,
  FileText,
  CheckCircle,
  Award,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { KPICard } from '../../components/shared/KPICard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ActivityTimeline } from '../../components/shared/ActivityTimeline';
import { PageHeader } from '../../components/shared/PageHeader';
import { useFormatCurrency } from '../../hooks/useFormatCurrency';
import { demoBDKPIs, demoLeads, demoActivityLog, demoMeetings } from '../../data/demo';

export function BDDashboard() {
  const formatCurrency = useFormatCurrency();
  const kpis = demoBDKPIs;
  const bdLeads = demoLeads.filter((l) => l.bd_id === 'bd-001');
  const bdMeetings = demoMeetings.filter((m) => m.bd_id === 'bd-001');
  const bdActivity = demoActivityLog.filter((a) => a.user_id === 'bd-001');

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Dashboard"
        description="Your sales pipeline at a glance"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Lead
          </Button>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Leads" value={kpis.total_leads} icon={Target} color="blue" />
        <KPICard title="Meetings Scheduled" value={kpis.meetings_scheduled} icon={Calendar} color="purple" />
        <KPICard title="Quotes Sent" value={kpis.quotes_sent} icon={FileText} color="amber" />
        <KPICard
          title="Conversion Rate"
          value={`${kpis.conversion_rate}%`}
          icon={TrendingUp}
          color="green"
          trend={{ value: 8, label: 'vs last month' }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          title="Commissions Due"
          value={formatCurrency(kpis.commissions_due)}
          icon={Award}
          color="amber"
        />
        <KPICard
          title="Commissions Paid"
          value={formatCurrency(kpis.commissions_paid)}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Content Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Leads</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bdLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{lead.project_title}</p>
                    <p className="text-xs text-slate-500">
                      {lead.client_name}
                      {lead.estimated_value ? ` · ${formatCurrency(lead.estimated_value)}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings + Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">My Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bdMeetings
                  .filter((m) => m.status === 'scheduled')
                  .map((meeting) => (
                    <div key={meeting.id} className="flex items-start gap-3 py-2">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">{meeting.title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(meeting.scheduled_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' · '}{meeting.location}
                        </p>
                      </div>
                    </div>
                  ))}
                {bdMeetings.filter((m) => m.status === 'scheduled').length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No upcoming meetings</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">My Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={bdActivity} maxItems={4} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
