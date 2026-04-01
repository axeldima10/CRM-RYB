import { Badge } from '../ui/badge';
import type { LeadStatus, MeetingStatus, PaymentStatus, CommissionStatus } from '../../types/database';

type AllStatus = LeadStatus | MeetingStatus | PaymentStatus | CommissionStatus | string;

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline' }> = {
  // Lead statuses
  new: { label: 'New', variant: 'info' },
  contacted: { label: 'Contacted', variant: 'secondary' },
  meeting_scheduled: { label: 'Meeting Scheduled', variant: 'info' },
  meeting_done: { label: 'Meeting Done', variant: 'secondary' },
  quote_sent: { label: 'Quote Sent', variant: 'warning' },
  quote_signed: { label: 'Quote Signed', variant: 'success' },
  deposit_received: { label: 'Deposit Received', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'info' },
  delivered: { label: 'Delivered', variant: 'success' },
  paid: { label: 'Paid', variant: 'success' },
  lost: { label: 'Lost', variant: 'destructive' },
  // Meeting statuses
  scheduled: { label: 'Scheduled', variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
  // Payment statuses
  pending: { label: 'Pending', variant: 'warning' },
  partial: { label: 'Partial', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'destructive' },
  // Commission statuses
  approved: { label: 'Approved', variant: 'info' },
  // Project statuses
  planning: { label: 'Planning', variant: 'secondary' },
  review: { label: 'Review', variant: 'warning' },
  on_hold: { label: 'On Hold', variant: 'outline' },
};

interface StatusBadgeProps {
  status: AllStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
