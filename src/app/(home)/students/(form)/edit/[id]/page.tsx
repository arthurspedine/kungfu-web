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
    <>
      <h2 className='font-bold'>Editar Aluno</h2>
      <EditStudentForm
        studentData={studentData}
        trainingCenters={trainingCenterInfoList}
      />
    </>
  )
}
