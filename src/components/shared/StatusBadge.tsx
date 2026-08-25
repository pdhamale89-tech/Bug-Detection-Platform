import type { BugStatus } from '@/types'
import { statusColor, cn } from '@/lib/utils'

const labels: Record<BugStatus, string> = {
  confirmed: 'Confirmed',
  potential: 'Potential',
  observation: 'Observation',
  resolved: 'Resolved',
  'false-positive': 'False Positive',
  duplicate: 'Duplicate',
}

export function StatusBadge({ status, className }: { status: BugStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusColor(status),
        className
      )}
    >
      {labels[status]}
    </span>
  )
}
