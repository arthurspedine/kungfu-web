import { Title } from '@/components/title'
import { getTrainingCentersList } from '@/http/training-centers'
import { TrainingCentersContent } from './_components/training-centers-content'
import { Suspense } from 'react'

interface SearchParams {
  page?: string
  size?: string
}

export default async function TrainingCentersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedSearchParams = await searchParams

  const page = Number.parseInt(resolvedSearchParams.page ?? '0')
  const size = Number.parseInt(resolvedSearchParams.size ?? '10')

  const params = new URLSearchParams()
  params.set('page', page.toString())
  params.set('size', size.toString())

  const initialData = await getTrainingCentersList(params.toString())

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-input pb-4 w-full'>
        Núcleos
      </Title>
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
            <span className='ml-2'>Carregando...</span>
          </div>
        }
      >
        <TrainingCentersContent initialData={initialData} />
      </Suspense>
    </div>
  )
}
