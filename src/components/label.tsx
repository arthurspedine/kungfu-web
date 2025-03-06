import { cn } from '@/lib/utils'

export function Label({
  className,
  children,
}: { className?: string; children: React.ReactNode }) {
  return <h1 className={cn('text-primary text-sm', className)}>{children}</h1>
}
