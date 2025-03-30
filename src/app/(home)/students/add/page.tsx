import { Title } from '@/components/title'
import { listAllTrainingCentersInfo } from '@/http/training-centers'
import type { TrainingCenterSimpleInfo } from '@/types'
import { redirect } from 'next/navigation'
import { AddStudentForm } from './_components/add-student-form'

export default async function AddStudentPage() {
  const trainingCenterInfoList: TrainingCenterSimpleInfo[] =
    await listAllTrainingCentersInfo()

  if (!trainingCenterInfoList) redirect('/students')
  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-[#D1D1D1] pb-4 w-full'>
        Alunos
      </Title>
      <section className='bg-[#F5F7F9] h-full w-full rounded-xl border border-[#CACACA] p-12'>
        <h2 className='font-bold'>Cadastrar Aluno</h2>
        <AddStudentForm trainingCenters={trainingCenterInfoList} />
      </section>
    </div>
  )
}
