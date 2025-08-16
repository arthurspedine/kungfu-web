import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function BeltsSkeleton() {
  return (
    <div className='space-y-4'>
      <div>
        {/* BELT INPUTS SKELETON */}
        <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between mb-2'>
          {/* BELT AND ACHIEVED DATE SKELETON */}
          <div className='flex flex-col gap-2 lg:flex-row lg:gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-10 w-full lg:w-60' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-10 w-full lg:w-fit' />
            </div>
          </div>
          {/* END BELT TIME + DELETE BUTTON SKELETON */}
          <div className='flex justify-between lg:justify-normal gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-10' />
            </div>
            <Skeleton className='h-10 w-10 mt-5' />
          </div>
        </div>
        <Separator />
      </div>

      <Skeleton className='h-6 w-40' />
      <div className='flex flex-col-reverse gap-2 sm:gap-4 sm:flex-row'>
        <Skeleton className='h-10 grow' />
        <Skeleton className='h-10 grow' />
      </div>
    </div>
  )
}
