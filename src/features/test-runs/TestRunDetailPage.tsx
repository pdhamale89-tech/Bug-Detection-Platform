import { Link, useNavigate, useParams } from 'react-router-dom'
import { Download, RotateCcw, CheckCircle2, XCircle, AlertTriangle, MinusCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { HealthScoreRing } from '@/components/shared/HealthScoreRing'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { getTestRunById, getBugsByProject } from '@/data/mock-data'
import { formatDate, formatDuration, testStatusColor } from '@/lib/utils'
import { useAppStore } from '@/stores/app-store'
import type { TestCaseStatus } from '@/types'

const statusIcons: Record<TestCaseStatus, typeof CheckCircle2> = {
  passed: CheckCircle2,
  failed: XCircle,
  warning: AlertTriangle,
  skipped: MinusCircle,
  pending: MinusCircle,
  running: MinusCircle,
}

const RESULT_COLORS = ['#34d399', '#f87171', '#fbbf24', '#94a3b8']

export function TestRunDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useAppStore((s) => s.showToast)
  const run = getTestRunById(id ?? '')

  if (!run) {
    return <EmptyState title="Test run not found" description="This test run may have been removed." />
  }

  const bugs = getBugsByProject(run.projectId).filter((b) => b.testRunId === run.id)
  const resultData = [
    { name: 'Passed', value: run.testCasesPassed },
    { name: 'Failed', value: run.testCasesFailed },
    { name: 'Warning', value: run.testCasesWarning },
    { name: 'Skipped', value: run.testCasesSkipped },
  ].filter((d) => d.value > 0)

  const healthRings = [
    { label: 'Functional', value: run.healthScore.functional },
    { label: 'UI', value: run.healthScore.ui },
    { label: 'Accessibility', value: run.healthScore.accessibility },
    { label: 'Performance', value: run.healthScore.performance },
    { label: 'Reliability', value: run.healthScore.reliability },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{run.projectName}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(run.startedAt)} · {formatDuration(run.durationSeconds)} · <Badge variant="outline">{run.environment}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => showToast({ title: 'Export started', description: 'Preparing PDF export...', variant: 'default' })}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={() => navigate(`/projects/${run.projectId}/test`)}>
            <RotateCcw className="h-4 w-4" /> Run Again
          </Button>
        </div>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{run.executiveSummary}</p>
          <h4 className="mt-4 text-sm font-semibold">Recommended Actions</h4>
          <ol className="mt-2 space-y-1.5">
            {run.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-1 p-4">
            <HealthScoreRing score={run.healthScore.overall} size={64} strokeWidth={6} />
          </CardContent>
        </Card>
        {[
          { label: 'Pages', value: run.pagesTested },
          { label: 'Test Cases', value: run.testCasesTotal },
          { label: 'Passed', value: run.testCasesPassed },
          { label: 'Failed', value: run.testCasesFailed },
          { label: 'Bugs', value: run.bugsFound },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col items-center justify-center gap-1 p-4">
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resultData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {resultData.map((entry, i) => (
                    <Cell key={entry.name} fill={RESULT_COLORS[i % RESULT_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            {healthRings.map((h) => (
              <HealthScoreRing key={h.label} score={h.value} size={72} strokeWidth={6} label={h.label} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bugs Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bugs.length === 0 ? (
            <EmptyState title="No bugs found" description="This test run completed without detecting any issues." />
          ) : (
            bugs.map((bug) => (
              <Link
                key={bug.id}
                to={`/bugs/${bug.id}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3 hover:border-primary/40 hover:bg-accent"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{bug.title}</p>
                  <p className="text-xs text-muted-foreground">{bug.displayId} · {bug.url}</p>
                </div>
                <SeverityBadge severity={bug.severity} className="shrink-0" />
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {run.testCases.map((tc) => {
            const Icon = statusIcons[tc.status]
            return (
              <div key={tc.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${testStatusColor(tc.status)}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{tc.name}</p>
                  <p className="text-xs text-muted-foreground">{tc.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{(tc.durationMs / 1000).toFixed(1)}s</span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
