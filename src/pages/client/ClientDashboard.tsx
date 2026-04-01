import { FolderKanban, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { KPICard } from '../../components/shared/KPICard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Progress } from '../../components/ui/progress';
import { PageHeader } from '../../components/shared/PageHeader';
import { demoClientKPIs, demoProjects } from '../../data/demo';

export function ClientDashboard() {
  const kpis = demoClientKPIs;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="Track the progress of your projects in real time"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Projects" value={kpis.project_count} icon={FolderKanban} color="blue" />
        <KPICard title="Active" value={kpis.active_projects} icon={Clock} color="amber" />
        <KPICard title="Completed" value={kpis.completed_projects} icon={CheckCircle} color="green" />
        <KPICard
          title="Next Milestone"
          value={kpis.next_milestone || 'N/A'}
          icon={ArrowRight}
          color="purple"
        />
      </div>

      {/* Projects */}
      <div className="space-y-6">
        {demoProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{project.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm font-bold text-slate-900">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2.5" />
              </div>

              {/* Current Phase & Next Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50">
                  <p className="text-xs font-medium text-blue-600 mb-1">Current Phase</p>
                  <p className="text-sm font-semibold text-blue-900">{project.current_phase}</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50">
                  <p className="text-xs font-medium text-amber-600 mb-1">Next Action</p>
                  <p className="text-sm font-semibold text-amber-900">{project.next_action}</p>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Deliverables</h4>
                <div className="space-y-2">
                  {project.deliverables.map((del) => (
                    <div
                      key={del.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            del.status === 'completed'
                              ? 'bg-emerald-500'
                              : del.status === 'in_progress'
                              ? 'bg-blue-500'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span className="text-sm text-slate-700">{del.title}</span>
                      </div>
                      <StatusBadge status={del.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {project.start_date && project.end_date && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Started: {new Date(project.start_date).toLocaleDateString('fr-FR')}</span>
                  <span>Deadline: {new Date(project.end_date).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
