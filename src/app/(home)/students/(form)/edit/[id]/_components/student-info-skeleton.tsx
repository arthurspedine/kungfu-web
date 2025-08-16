import { Skeleton } from '@/components/ui/skeleton'

export function StudentInfoSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4 w-full'>
      <div className='w-full space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='w-full space-y-2'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='w-full space-y-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-10 w-full' />
      </div>
      <div className='w-full space-y-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-10 w-full' />
      </div>
    </div>
  )
}
