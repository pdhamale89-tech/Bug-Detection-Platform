import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bot,
  Square,
  FileBarChart,
  Globe,
  MousePointer2,
  FileSearch,
  FlaskConical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bug as BugIcon,
  Accessibility,
  Gauge,
  Flag,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { getProjectById, generateMockEvents, mockBugs } from '@/data/mock-data'
import { formatDuration } from '@/lib/utils'
import type { AgentEvent } from '@/types'

const eventIcons: Record<AgentEvent['type'], { icon: typeof Globe; color: string }> = {
  'page-loaded': { icon: Globe, color: 'text-blue-400' },
  navigation: { icon: Globe, color: 'text-blue-400' },
  'element-discovered': { icon: FileSearch, color: 'text-slate-400' },
  interaction: { icon: MousePointer2, color: 'text-violet-400' },
  'form-detected': { icon: FileSearch, color: 'text-slate-400' },
  'test-generated': { icon: FlaskConical, color: 'text-indigo-400' },
  'test-passed': { icon: CheckCircle2, color: 'text-emerald-400' },
  'test-failed': { icon: XCircle, color: 'text-red-400' },
  'console-error': { icon: AlertTriangle, color: 'text-amber-400' },
  'network-error': { icon: AlertTriangle, color: 'text-amber-400' },
  'bug-suspected': { icon: AlertTriangle, color: 'text-amber-400' },
  'bug-reproduced': { icon: BugIcon, color: 'text-orange-400' },
  'bug-confirmed': { icon: BugIcon, color: 'text-red-400' },
  'accessibility-issue': { icon: Accessibility, color: 'text-amber-400' },
  'performance-issue': { icon: Gauge, color: 'text-amber-400' },
  'phase-change': { icon: Flag, color: 'text-primary' },
  completed: { icon: Sparkles, color: 'text-emerald-400' },
}

const ALL_EVENTS = generateMockEvents()

export function TestExecutionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProjectById(id ?? 'proj_01')

  const [events, setEvents] = useState<AgentEvent[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [pagesExplored, setPagesExplored] = useState(0)
  const [testsRun, setTestsRun] = useState(0)
  const [bugsFound, setBugsFound] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let eventIndex = 0
    const eventTimer = setInterval(() => {
      if (eventIndex >= ALL_EVENTS.length) {
        clearInterval(eventTimer)
        setDone(true)
        return
      }
      const evt = ALL_EVENTS[eventIndex]
      setEvents((prev) => [...prev, evt])

      if (evt.type === 'page-loaded' || evt.type === 'navigation') setPagesExplored((v) => v + 1)
      if (evt.type === 'test-passed' || evt.type === 'test-failed') setTestsRun((v) => v + 1)
      if (evt.type === 'bug-confirmed') {
        const match = evt.message.match(/BUG-\d+/)
        if (match) setBugsFound((prev) => [...prev, match[0]])
      }

      eventIndex += 1
    }, 500)

    const timeTimer = setInterval(() => setElapsed((v) => v + 1), 1000)

    return () => {
      clearInterval(eventTimer)
      clearInterval(timeTimer)
    }
  }, [])

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [events])

  const progress = Math.round((events.length / ALL_EVENTS.length) * 100)
  const foundBugs = mockBugs.filter((b) => bugsFound.includes(b.displayId))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {!done && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
            <span className={`relative inline-flex h-3 w-3 rounded-full ${done ? 'bg-emerald-500' : 'bg-emerald-500'}`} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{done ? 'Test Complete' : 'AI Agent Running'}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{project?.name} · {project?.url}</p>
          </div>
        </div>
        {done ? (
          <Button onClick={() => navigate('/test-runs/run_01')}>
            <FileBarChart className="h-4 w-4" /> View Full Report
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setDone(true)}>
            <Square className="h-4 w-4" /> Stop Test
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{done ? 'Completed' : 'Exploring & testing...'}</span>
            <span className="text-muted-foreground">Elapsed: {formatDuration(elapsed)}</span>
          </div>
          <Progress value={progress} className="mt-3" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Pages Explored', value: pagesExplored },
              { label: 'Tests Run', value: testsRun },
              { label: 'Bugs Found', value: bugsFound.length },
              { label: 'Critical', value: foundBugs.filter((b) => b.severity === 'critical').length },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-border bg-muted/30 p-3 text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 flex-1 truncate rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                {events.length > 0 && (events[events.length - 1].message.match(/https?:\/\/\S+/)?.[0] ?? project?.url) || project?.url}
              </span>
            </div>
            <div className="relative h-[420px] overflow-hidden bg-muted/20 p-4">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 rounded bg-muted" style={{ width: `${90 - i * 8}%` }} />
                ))}
              </div>
              {!done && (
                <div className="animate-cursor absolute left-8 top-16 flex flex-col items-center">
                  <MousePointer2 className="h-6 w-6 fill-primary text-primary" />
                  <span className="mt-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    AI Agent
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Activity Feed</span>
              {!done && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />}
            </div>
            <div ref={feedRef} className="scrollbar-thin h-[420px] space-y-2 overflow-y-auto p-3">
              {events.map((evt) => {
                const { icon: Icon, color } = eventIcons[evt.type]
                return (
                  <div key={evt.id} className="animate-fade-in-up flex items-start gap-2 text-xs">
                    <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${color}`} />
                    <span className="text-muted-foreground">{evt.message}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {foundBugs.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-3 text-sm font-semibold">Bugs Detected Live</h3>
            <div className="space-y-2">
              {foundBugs.map((bug) => (
                <div key={bug.id} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{bug.title}</p>
                    <p className="text-xs text-muted-foreground">{bug.displayId}</p>
                  </div>
                  <SeverityBadge severity={bug.severity} className="shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
