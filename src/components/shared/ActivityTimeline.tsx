import { Clock, FileText, Users, Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import type { ActivityLog } from '../../types/database';
import { useFormatDate } from '../../hooks/useFormatDate';

const actionIcons: Record<string, React.ElementType> = {
  created: FileText,
  updated: FileText,
  status_changed: CheckCircle,
  meeting: Calendar,
  payment: CreditCard,
  user: Users,
};

const actionColors: Record<string, string> = {
  created: 'bg-blue-100 text-blue-600',
  updated: 'bg-slate-100 text-slate-600',
  status_changed: 'bg-emerald-100 text-emerald-600',
  meeting: 'bg-purple-100 text-purple-600',
  payment: 'bg-amber-100 text-amber-600',
};

interface ActivityTimelineProps {
  activities: ActivityLog[];
  maxItems?: number;
}

export function ActivityTimeline({ activities, maxItems }: ActivityTimelineProps) {
  const { formatRelative } = useFormatDate();
  const items = maxItems ? activities.slice(0, maxItems) : activities;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((activity, index) => {
        const Icon = actionIcons[activity.action] || Clock;
        const colorClass = actionColors[activity.action] || 'bg-slate-100 text-slate-600';
        return (
          <div key={activity.id} className="flex gap-3 py-3">
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${colorClass}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              {index < items.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-2" />}
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <p className="text-sm text-slate-700">{activity.details}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  {activity.user?.full_name}
                </span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">
                  {formatRelative(activity.created_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
