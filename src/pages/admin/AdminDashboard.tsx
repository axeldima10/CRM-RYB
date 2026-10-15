import {
  Users,
  Target,
  Calendar,
  FileText,
  CheckCircle,
  DollarSign,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { KPICard } from '../../components/shared/KPICard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ActivityTimeline } from '../../components/shared/ActivityTimeline';
import { PageHeader } from '../../components/shared/PageHeader';
import { useFormatCurrency } from '../../hooks/useFormatCurrency';
import { demoAdminKPIs, demoLeads, demoActivityLog, demoMeetings } from '../../data/demo';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { month: 'Oct', revenue: 2500000 },
  { month: 'Nov', revenue: 1800000 },
  { month: 'Dec', revenue: 3200000 },
  { month: 'Jan', revenue: 2100000 },
  { month: 'Feb', revenue: 4000000 },
  { month: 'Mar', revenue: 3500000 },
];

const pipelineData = [
  { name: 'New', value: 1, color: '#3b82f6' },
  { name: 'In Progress', value: 2, color: '#6366f1' },
  { name: 'Quote Sent', value: 1, color: '#f59e0b' },
  { name: 'Signed', value: 1, color: '#10b981' },
  { name: 'Paid', value: 1, color: '#059669' },
  { name: 'Lost', value: 1, color: '#ef4444' },
];

export function AdminDashboard() {
  const formatCurrency = useFormatCurrency();
  const kpis = demoAdminKPIs;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of all business activities"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active BDs" value={kpis.total_bds} icon={Users} color="blue" />
        <KPICard title="Active Leads" value={kpis.active_leads} icon={Target} color="purple" />
        <KPICard title="Meetings This Week" value={kpis.meetings_this_week} icon={Calendar} color="amber" />
        <KPICard
          title="Conversion Rate"
          value={`${kpis.conversion_rate}%`}
          icon={TrendingUp}
          color="green"
          trend={{ value: 5, label: 'vs last month' }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Quotes Pending" value={kpis.quotes_pending} icon={FileText} color="amber" />
        <KPICard title="Deals Signed" value={kpis.deals_signed} icon={CheckCircle} color="green" />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpis.revenue_total)}
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Commissions Due"
          value={formatCurrency(kpis.commissions_due)}
          icon={Award}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {pipelineData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoLeads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{lead.project_title}</p>
                    <p className="text-xs text-slate-500">{lead.client_name} · {lead.bd?.full_name}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity + Upcoming Meetings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoMeetings
                  .filter((m) => m.status === 'scheduled')
                  .map((meeting) => (
                    <div key={meeting.id} className="flex items-start gap-3 py-2">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Calendar className="h-4 w-4 text-blue-600" />
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
                          {' · '}{meeting.duration_minutes} min · {meeting.location}
                        </p>
                      </div>
                      <StatusBadge status={meeting.status} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={demoActivityLog} maxItems={4} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
