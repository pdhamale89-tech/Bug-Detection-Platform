import { Link } from 'react-router-dom'
import { Plus, ExternalLink, PlayCircle, Bug as BugIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HealthScoreRing } from '@/components/shared/HealthScoreRing'
import { mockProjects } from '@/data/mock-data'
import { formatRelativeTime } from '@/lib/utils'

const envColor: Record<string, string> = {
  production: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  staging: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  development: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
}

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Applications under continuous AI-driven testing.</p>
        </div>
        <Link to="/projects/new">
          <Button>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card hover className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">{project.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      {project.url} <ExternalLink className="h-3 w-3 shrink-0" />
                    </p>
                  </div>
                  <HealthScoreRing score={project.healthScore.overall} size={56} strokeWidth={5} />
                </div>

                <Badge variant="outline" className={`mt-4 ${envColor[project.environment]}`}>
                  {project.environment}
                </Badge>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <BugIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">{project.openBugs}</p>
                      <p className="text-[11px] text-muted-foreground">Open bugs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold">{project.totalTestRuns}</p>
                      <p className="text-[11px] text-muted-foreground">Test runs</p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Last tested {formatRelativeTime(project.lastTestedAt)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
