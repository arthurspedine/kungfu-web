import { Title } from '@/components/title'
import { getTrainingCentersList } from '@/http/training-centers'
import type { TrainingCenterData } from './_components/columns'
import { TrainingCentersContent } from './_components/training-centers-content'

export default async function TrainingCentersPage() {
  const trainingCenters: TrainingCenterData[] = await getTrainingCentersList()

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-[#D1D1D1] pb-4 w-full'>
        Núcleos
      </Title>
      <TrainingCentersContent trainingCenters={trainingCenters} />
    </div>
  )
}
