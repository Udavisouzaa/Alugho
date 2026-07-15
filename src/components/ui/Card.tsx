export function Card({
  children,
  className = '',
  as: Component = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}) {
  return (
    <Component
      className={`bg-white dark:bg-gray-800 rounded-[1.5rem] border border-slate-200/80 dark:border-gray-700 shadow-[var(--shadow-sm)] transition-colors ${className}`}
    >
      {children}
    </Component>
  )
}
