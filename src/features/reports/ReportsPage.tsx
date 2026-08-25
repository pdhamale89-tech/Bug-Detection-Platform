import { useParams } from 'react-router-dom'
import { FileDown, FileJson } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { HealthScoreRing } from '@/components/shared/HealthScoreRing'
import { mockTestRuns } from '@/data/mock-data'
import { formatDate } from '@/lib/utils'
import { useAppStore } from '@/stores/app-store'

export function ReportsPage() {
  const { id } = useParams()
  const showToast = useAppStore((s) => s.showToast)
  const highlighted = mockTestRuns.find((r) => r.id === id)
  const runs = highlighted ? [highlighted, ...mockTestRuns.filter((r) => r.id !== id)] : mockTestRuns

  if (mockTestRuns.length === 0) {
    return <EmptyState title="No reports yet" description="Run a test to generate your first report." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Downloadable summaries for every completed test run.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {runs.map((run) => (
          <Card key={run.id} className={run.id === id ? 'border-primary/40' : ''}>
            <CardHeader>
              <CardTitle className="text-base">{run.projectName}</CardTitle>
              <p className="text-xs text-muted-foreground">{formatDate(run.startedAt)}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <HealthScoreRing score={run.healthScore.overall} size={64} strokeWidth={6} />
                <div className="grid flex-1 grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-sm font-semibold">{run.pagesTested}</p>
                    <p className="text-[10px] text-muted-foreground">Pages</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{run.bugsFound}</p>
                    <p className="text-[10px] text-muted-foreground">Bugs</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">{run.testCasesPassed}</p>
                    <p className="text-[10px] text-muted-foreground">Passed</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-400">{run.testCasesFailed}</p>
                    <p className="text-[10px] text-muted-foreground">Failed</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => showToast({ title: 'PDF export started', variant: 'default' })}
                >
                  <FileDown className="h-3.5 w-3.5" /> PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => showToast({ title: 'JSON export started', variant: 'default' })}
                >
                  <FileJson className="h-3.5 w-3.5" /> JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
