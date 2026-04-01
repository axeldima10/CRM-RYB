import { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader } from '../components/shared/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { demoMeetings } from '../data/demo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';

export function MeetingsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const isAdmin = user?.role === 'admin';
  const meetings = demoMeetings.filter((m) => {
    if (!isAdmin && m.bd_id !== user?.id) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        description={isAdmin ? 'All scheduled meetings' : 'Your meetings'}
        actions={
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" /> Schedule Meeting
          </Button>
        }
      />

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </Select>
      </div>

      {/* Meeting Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{meeting.title}</CardTitle>
                <StatusBadge status={meeting.status} />
              </div>
              {meeting.description && (
                <p className="text-sm text-slate-500">{meeting.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {new Date(meeting.scheduled_at).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {new Date(meeting.scheduled_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' · '}{meeting.duration_minutes} min
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {meeting.meeting_url ? (
                    <Video className="h-4 w-4 text-slate-400" />
                  ) : (
                    <MapPin className="h-4 w-4 text-slate-400" />
                  )}
                  {meeting.location}
                </div>
                {meeting.lead && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <p className="text-xs text-slate-500">
                      Lead: <span className="font-medium text-slate-700">{meeting.lead.project_title}</span>
                    </p>
                  </div>
                )}
                {meeting.outcome_notes && (
                  <div className="p-3 rounded-lg bg-slate-50 mt-2">
                    <p className="text-xs font-medium text-slate-500 mb-1">Outcome</p>
                    <p className="text-sm text-slate-700">{meeting.outcome_notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meetings.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No meetings found</p>
          </CardContent>
        </Card>
      )}

      {/* Create Meeting Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>Schedule a new meeting with a lead</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateDialog(false); }}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Meeting title" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Meeting agenda" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date & Time</label>
                <Input type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (min)</label>
                <Input type="number" defaultValue={30} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="Zoom, Google Meet, Office..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
