import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import type { BugSeverity, BugStatus, TestCaseStatus, BugCategory, TestScope } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy')
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy, h:mm a')
}

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true })
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

let idCounter = 0
export function generateId(prefix = 'id'): string {
  idCounter += 1
  return `${prefix}_${idCounter}_${Math.floor(1000 + (idCounter * 37) % 9000)}`
}

export function severityColor(severity: BugSeverity): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/15 text-red-400 border-red-500/30'
    case 'high':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    case 'medium':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    case 'low':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    case 'info':
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  }
}

export function statusColor(status: BugStatus): string {
  switch (status) {
    case 'confirmed':
      return 'bg-red-500/15 text-red-400 border-red-500/30'
    case 'potential':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    case 'observation':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    case 'resolved':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    case 'false-positive':
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
    case 'duplicate':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  }
}

export function testStatusColor(status: TestCaseStatus): string {
  switch (status) {
    case 'passed':
      return 'text-emerald-400'
    case 'failed':
      return 'text-red-400'
    case 'warning':
      return 'text-amber-400'
    case 'running':
      return 'text-blue-400'
    case 'skipped':
      return 'text-slate-400'
    default:
      return 'text-muted-foreground'
  }
}

export function categoryLabel(category: BugCategory): string {
  const map: Record<BugCategory, string> = {
    functional: 'Functional',
    ui: 'UI / Visual',
    accessibility: 'Accessibility',
    performance: 'Performance',
    navigation: 'Navigation',
    security: 'Security',
    'console-error': 'Console Error',
    'network-error': 'Network Error',
  }
  return map[category] ?? category
}

export function scopeLabel(scope: TestScope): string {
  const map: Record<TestScope, string> = {
    functional: 'Functional Testing',
    'ui-ux': 'UI / UX Review',
    accessibility: 'Accessibility (WCAG)',
    performance: 'Performance',
    responsive: 'Responsive Design',
    navigation: 'Navigation & Links',
    forms: 'Forms & Validation',
    authentication: 'Authentication Flows',
    'api-network': 'API / Network',
    'console-errors': 'Console Errors',
  }
  return map[scope] ?? scope
}

export function healthColor(score: number): string {
  if (score >= 80) return '#34d399'
  if (score >= 60) return '#fbbf24'
  return '#f87171'
}

export function confidenceColor(confidence: number): string {
  if (confidence >= 90) return 'text-emerald-400'
  if (confidence >= 70) return 'text-amber-400'
  return 'text-red-400'
}
