import { Title } from '@/components/title'
import { AddTrainingCenterForm } from './_components/add-training-center-form'

export default async function AddTrainingCentersPage() {
  const listAllTeachers = await fetch(
    `${process.env.BACKEND_URL}/user/list/all`,
    {
      cache: 'no-cache',
    }
  )
  const data: { id: string; name: string }[] = await listAllTeachers.json()

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-input pb-4 w-full'>
        Núcleo
      </Title>
      <section className='bg-secondary h-full w-full rounded-xl border border-input p-4 sm:p-12'>
        <h2 className='font-bold'>Cadastrar Núcleo</h2>
        <AddTrainingCenterForm teachers={data} />
      </section>
    </div>
  )
}
