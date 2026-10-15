import { FolderKanban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader } from '../components/shared/PageHeader';
import { demoProjects } from '../data/demo';

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Track all active projects" />

      <div className="space-y-4">
        {demoProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FolderKanban className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <p className="text-xs text-slate-500">{project.description}</p>
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Progress</span>
                    <span className="text-sm font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Current Phase</p>
                    <p className="text-sm font-medium">{project.current_phase}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Next Action</p>
                    <p className="text-sm font-medium">{project.next_action}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.deliverables.map((del) => (
                    <div
                      key={del.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs"
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          del.status === 'completed' ? 'bg-emerald-500' : del.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'
                        }`}
                      />
                      {del.title}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
