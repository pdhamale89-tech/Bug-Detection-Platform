import { cn, confidenceColor } from '@/lib/utils'

export function ConfidenceIndicator({ confidence, className }: { confidence: number; className?: string }) {
  const dotColor = confidence >= 90 ? 'bg-emerald-400' : confidence >= 70 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', confidenceColor(confidence), className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />
      {confidence}% confidence
    </span>
  )
}
