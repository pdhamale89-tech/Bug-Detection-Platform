import { Link } from 'react-router-dom'
import { FolderKanban, PlayCircle, Bug as BugIcon, Flame, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/shared/StatCard'
import { HealthScoreRing } from '@/components/shared/HealthScoreRing'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { mockProjects, mockTestRuns, mockBugs } from '@/data/mock-data'
import { formatRelativeTime, categoryLabel } from '@/lib/utils'
import type { BugCategory } from '@/types'

const PIE_COLORS = ['#f87171', '#fb923c', '#fbbf24', '#60a5fa']

export function DashboardPage() {
  const totalBugs = mockProjects.reduce((sum, p) => sum + p.totalBugs, 0)
  const criticalCount = mockBugs.filter((b) => b.severity === 'critical').length
  const avgHealth = Math.round(mockProjects.reduce((sum, p) => sum + p.healthScore.overall, 0) / mockProjects.length)

  const categoryCounts = mockBugs.reduce<Record<string, number>>((acc, b) => {
    acc[b.category] = (acc[b.category] ?? 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
    category: categoryLabel(category as BugCategory),
    count,
  }))

  const severityData = [
    { name: 'Critical', value: mockBugs.filter((b) => b.severity === 'critical').length },
    { name: 'High', value: mockBugs.filter((b) => b.severity === 'high').length },
    { name: 'Medium', value: mockBugs.filter((b) => b.severity === 'medium').length },
    { name: 'Low', value: mockBugs.filter((b) => b.severity === 'low').length },
  ].filter((d) => d.value > 0)

  const recentRuns = [...mockTestRuns].sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt))
  const recentBugs = [...mockBugs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)

  const healthBreakdown = [
    { label: 'Functional', value: mockProjects[0].healthScore.functional },
    { label: 'UI', value: mockProjects[0].healthScore.ui },
    { label: 'Accessibility', value: mockProjects[0].healthScore.accessibility },
    { label: 'Performance', value: mockProjects[0].healthScore.performance },
    { label: 'Reliability', value: mockProjects[0].healthScore.reliability },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Your workspace health across all projects.</p>
        </div>
        <Link to="/projects/new">
          <Button>
            <Plus className="h-4 w-4" /> New Test
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Projects" value={mockProjects.length} icon={FolderKanban} description="Across production & staging" />
        <StatCard title="Test Runs" value={mockTestRuns.length} icon={PlayCircle} description="Completed this month" />
        <StatCard title="Bugs Found" value={totalBugs} icon={BugIcon} description="All projects combined" />
        <StatCard title="Critical Issues" value={criticalCount} icon={Flame} description="Require immediate attention" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <HealthScoreRing score={avgHealth} size={110} label="Average across projects" />
            <div className="w-full space-y-2">
              {healthBreakdown.map((h) => (
                <div key={h.label} className="flex items-center gap-2">
                  <span className="w-24 text-xs text-muted-foreground">{h.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${h.value}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-medium">{h.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bugs by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="category" width={110} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {severityData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentRuns.map((run) => (
              <Link
                key={run.id}
                to={`/test-runs/${run.id}`}
                className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <div>
                  <p className="text-sm font-medium">{run.projectName}</p>
                  <p className="text-xs text-muted-foreground">{run.pagesTested} pages · {run.bugsFound} bugs found</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatRelativeTime(run.startedAt)}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentBugs.map((bug) => (
              <Link
                key={bug.id}
                to={`/bugs/${bug.id}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{bug.title}</p>
                  <p className="text-xs text-muted-foreground">{bug.displayId} · {formatRelativeTime(bug.createdAt)}</p>
                </div>
                <SeverityBadge severity={bug.severity} className="shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
