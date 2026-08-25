import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfidenceIndicator } from '@/components/shared/ConfidenceIndicator'
import { mockBugs } from '@/data/mock-data'
import { categoryLabel, formatRelativeTime } from '@/lib/utils'
import type { BugSeverity, BugStatus, BugCategory } from '@/types'

const severities: BugSeverity[] = ['critical', 'high', 'medium', 'low', 'info']
const statuses: BugStatus[] = ['confirmed', 'potential', 'observation', 'resolved', 'false-positive', 'duplicate']
const categories: BugCategory[] = ['functional', 'ui', 'accessibility', 'performance', 'navigation', 'security', 'console-error', 'network-error']
const severityRank: Record<BugSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 }

export function BugsPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [severity, setSeverity] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<'severity' | 'confidence' | 'newest'>('severity')

  const filtered = useMemo(() => {
    let bugs = mockBugs.filter((b) => {
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.displayId.toLowerCase().includes(search.toLowerCase())) return false
      if (severity !== 'all' && b.severity !== severity) return false
      if (status !== 'all' && b.status !== status) return false
      if (category !== 'all' && b.category !== category) return false
      return true
    })
    bugs = [...bugs].sort((a, b) => {
      if (sort === 'severity') return severityRank[b.severity] - severityRank[a.severity]
      if (sort === 'confidence') return b.confidence - a.confidence
      return +new Date(b.createdAt) - +new Date(a.createdAt)
    })
    return bugs
  }, [search, severity, status, category, sort])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bugs</h1>
        <p className="text-sm text-muted-foreground">All issues detected by the AI agent across your projects.</p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search bugs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select className="w-auto" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="all">All severities</option>
            {severities.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
          <Select className="w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1).replace('-', ' ')}</option>
            ))}
          </Select>
          <Select className="w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </Select>
          <Select className="w-auto" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="severity">Sort: Severity</option>
            <option value="confidence">Sort: Confidence</option>
            <option value="newest">Sort: Newest</option>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No bugs match your filters" description="Try adjusting your search or filter criteria." />
      ) : (
        <div className="space-y-2">
          {filtered.map((bug) => (
            <Link key={bug.id} to={`/bugs/${bug.id}`}>
              <Card hover>
                <CardContent className="flex flex-wrap items-center gap-3 p-4">
                  <span className="w-20 shrink-0 text-xs font-mono text-muted-foreground">{bug.displayId}</span>
                  <SeverityBadge severity={bug.severity} />
                  <StatusBadge status={bug.status} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{bug.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{categoryLabel(bug.category)} · {bug.url}</p>
                  </div>
                  <ConfidenceIndicator confidence={bug.confidence} />
                  <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(bug.createdAt)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
