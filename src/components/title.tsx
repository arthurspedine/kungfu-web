import { cn } from '@/lib/utils'

export function Title({
  className,
  children,
}: { className?: string; children: React.ReactNode }) {
  return (
    <h1 className={cn('font-bold text-2xl text-foreground', className)}>
      {children}
    </h1>
  )
}
