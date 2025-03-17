import { Title } from '@/components/title'
import { AddTrainingCenterForm } from './_components/add-training-center-form'
import { cookies } from 'next/headers'

export default async function AddTrainingCentersPage() {
  const c = await cookies()
  const listAllTeachers = await fetch(
    `${process.env.BACKEND_URL}/user/list/all`,
    {
      credentials: 'include',
      headers: {
        Cookie: c.toString(),
      },
    }
  )
  const data: { id: string; name: string }[] = await listAllTeachers.json()

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-[#D1D1D1] pb-4 w-full'>
        Núcleo
      </Title>
      <section className='bg-[#F5F7F9] h-full w-full rounded-xl border border-[#CACACA] p-12'>
        <h2 className='font-bold'>Cadastrar Núcleo</h2>
        <AddTrainingCenterForm teachers={data} />
      </section>
    </div>
  )
}
