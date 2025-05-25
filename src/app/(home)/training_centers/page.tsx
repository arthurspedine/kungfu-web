import { Title } from '@/components/title'
import { TrainingCentersContent } from './_components/training-centers-content'

export default async function TrainingCentersPage() {
  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-input pb-4 w-full'>
        Núcleos
      </Title>
      <TrainingCentersContent />
    </div>
  )
}
