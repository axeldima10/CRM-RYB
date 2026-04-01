import { FileText, Video, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/shared/PageHeader';
import { demoTrainingResources } from '../data/demo';

const typeIcons = {
  pdf: FileText,
  video: Video,
  link: ExternalLink,
};

const typeColors = {
  pdf: 'bg-red-50 text-red-600',
  video: 'bg-purple-50 text-purple-600',
  link: 'bg-blue-50 text-blue-600',
};

export function TrainingPage() {
  const categories = [...new Set(demoTrainingResources.map((r) => r.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Kit"
        description="Resources to help you succeed as a Business Developer"
      />

      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoTrainingResources
              .filter((r) => r.category === category)
              .map((resource) => {
                const Icon = typeIcons[resource.type];
                const colorClass = typeColors[resource.type];
                return (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${colorClass}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-slate-900">{resource.title}</h3>
                            <Badge variant="secondary" className="text-xs uppercase">
                              {resource.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 mb-3">{resource.description}</p>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="h-3.5 w-3.5" />
                            {resource.type === 'video' ? 'Watch' : 'Open'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
