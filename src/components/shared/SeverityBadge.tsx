import { Flame, TriangleAlert, CircleAlert, ArrowDownCircle, Info } from 'lucide-react'
import type { BugSeverity } from '@/types'
import { severityColor, cn } from '@/lib/utils'

const config: Record<BugSeverity, { icon: typeof Flame; label: string }> = {
  critical: { icon: Flame, label: 'Critical' },
  high: { icon: TriangleAlert, label: 'High' },
  medium: { icon: CircleAlert, label: 'Medium' },
  low: { icon: ArrowDownCircle, label: 'Low' },
  info: { icon: Info, label: 'Info' },
}

export function SeverityBadge({ severity, className }: { severity: BugSeverity; className?: string }) {
  const { icon: Icon, label } = config[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        severityColor(severity),
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
