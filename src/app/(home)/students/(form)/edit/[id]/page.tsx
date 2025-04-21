import { Title } from '@/components/title'
import { listAllTrainingCentersInfo } from '@/http/training-centers'
import { getStudentDetails } from '@/http/students'
import { redirect } from 'next/navigation'
import { EditStudentForm } from './_components/edit-student-form'

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [studentData, trainingCenterInfoList] = await Promise.all([
    getStudentDetails(id).catch(() => null),
    listAllTrainingCentersInfo(),
  ])

  if (!trainingCenterInfoList || !studentData) redirect('/students')

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-input pb-4 w-full'>
        Alunos
      </Title>
      <section className='bg-secondary h-full w-full rounded-xl border border-input p-12'>
        <h2 className='font-bold'>Editar Aluno</h2>
        <EditStudentForm
          studentData={studentData}
          trainingCenters={trainingCenterInfoList}
        />
      </section>
    </div>
  )
}
