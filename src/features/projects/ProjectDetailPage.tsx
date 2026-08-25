import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExternalLink, PlayCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { HealthScoreRing } from '@/components/shared/HealthScoreRing'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { getProjectById, getTestRunsByProject, getBugsByProject } from '@/data/mock-data'
import { formatRelativeTime } from '@/lib/utils'

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id ?? '')

  if (!project) {
    return <EmptyState title="Project not found" description="This project may have been removed." />
  }

  const runs = getTestRunsByProject(project.id)
  const openBugs = getBugsByProject(project.id).filter((b) => b.status !== 'resolved' && b.status !== 'false-positive')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline">{project.environment}</Badge>
          </div>
          <a href={project.url} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            {project.url} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <Button onClick={() => navigate(`/projects/${project.id}/test`)}>
          <PlayCircle className="h-4 w-4" /> Run Test
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
            <HealthScoreRing score={project.healthScore.overall} size={80} />
            <span className="text-xs text-muted-foreground">Health Score</span>
          </CardContent>
        </Card>
        {[
          { label: 'Total Runs', value: project.totalTestRuns },
          { label: 'Total Bugs', value: project.totalBugs },
          { label: 'Open Bugs', value: project.openBugs },
          { label: 'Resolved', value: project.resolvedBugs },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col items-center justify-center gap-1 p-6">
              <span className="text-3xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {runs.length === 0 ? (
              <EmptyState title="No test runs yet" description="Run your first AI test to see results here." />
            ) : (
              runs.map((run) => (
                <Link
                  key={run.id}
                  to={`/test-runs/${run.id}`}
                  className="flex items-center justify-between rounded-md border border-border p-3 hover:border-primary/40 hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium">{run.pagesTested} pages · {run.testCasesTotal} tests</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(run.startedAt)}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{run.bugsFound} bugs</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Bugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {openBugs.length === 0 ? (
              <EmptyState title="No open bugs" description="Everything found so far has been resolved." />
            ) : (
              openBugs.map((bug) => (
                <Link
                  key={bug.id}
                  to={`/bugs/${bug.id}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3 hover:border-primary/40 hover:bg-accent"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{bug.title}</p>
                    <p className="text-xs text-muted-foreground">{bug.displayId}</p>
                  </div>
                  <SeverityBadge severity={bug.severity} className="shrink-0" />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
