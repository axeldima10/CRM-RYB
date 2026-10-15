import { useState } from 'react';
import { ClipboardList, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { ActivityTimeline } from '../components/shared/ActivityTimeline';
import { PageHeader } from '../components/shared/PageHeader';
import { demoActivityLog } from '../data/demo';

export function AuditLogPage() {
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = demoActivityLog.filter((log) => {
    if (entityFilter !== 'all' && log.entity_type !== entityFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Complete activity trail — who did what and when"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
                <option value="all">All entities</option>
                <option value="lead">Leads</option>
                <option value="meeting">Meetings</option>
                <option value="quote">Quotes</option>
                <option value="payment">Payments</option>
                <option value="commission">Commissions</option>
                <option value="project">Projects</option>
              </Select>
            </div>
            <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
              <option value="all">All actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="status_changed">Status Changed</option>
            </Select>
          </div>

          <ActivityTimeline activities={filteredLogs} />

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No matching activity found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
