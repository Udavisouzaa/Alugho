type BadgeTone = 'emerald' | 'rose' | 'amber' | 'slate'

const toneClasses: Record<BadgeTone, string> = {
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  slate: 'bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-gray-300',
}

export function Badge({
  tone = 'slate',
  children,
  className = '',
}: {
  tone?: BadgeTone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
