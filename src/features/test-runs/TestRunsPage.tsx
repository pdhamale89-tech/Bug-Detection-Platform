import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { mockTestRuns } from '@/data/mock-data'
import { formatDuration, formatRelativeTime } from '@/lib/utils'
import type { TestRunStatus } from '@/types'

const statusIcon: Record<TestRunStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  failed: XCircle,
  running: Clock,
  queued: Clock,
  cancelled: XCircle,
}

const statusColorMap: Record<TestRunStatus, string> = {
  completed: 'text-emerald-400',
  failed: 'text-red-400',
  running: 'text-blue-400',
  queued: 'text-muted-foreground',
  cancelled: 'text-muted-foreground',
}

export function TestRunsPage() {
  const runs = [...mockTestRuns].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test Runs</h1>
        <p className="text-sm text-muted-foreground">Every AI-driven test execution across your projects.</p>
      </div>

      <div className="space-y-3">
        {runs.map((run) => {
          const Icon = statusIcon[run.status]
          return (
            <Link key={run.id} to={`/test-runs/${run.id}`}>
              <Card hover>
                <CardContent className="flex flex-wrap items-center gap-4 p-5">
                  <Icon className={`h-5 w-5 shrink-0 ${statusColorMap[run.status]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{run.projectName}</p>
                    <p className="truncate text-xs text-muted-foreground">{run.url}</p>
                  </div>
                  <div className="hidden gap-6 sm:flex">
                    <div className="text-center">
                      <p className="text-sm font-semibold">{run.pagesTested}</p>
                      <p className="text-[11px] text-muted-foreground">Pages</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-emerald-400">{run.testCasesPassed}</p>
                      <p className="text-[11px] text-muted-foreground">Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-red-400">{run.testCasesFailed}</p>
                      <p className="text-[11px] text-muted-foreground">Failed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold">{run.bugsFound}</p>
                      <p className="text-[11px] text-muted-foreground">Bugs</p>
                    </div>
                  </div>
                  {run.criticalCount > 0 && <Badge className="bg-red-500/15 text-red-400">{run.criticalCount} critical</Badge>}
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{formatDuration(run.durationSeconds)}</p>
                    <p>{formatRelativeTime(run.startedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
