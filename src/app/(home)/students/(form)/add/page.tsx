import { listAllTrainingCentersInfo } from '@/http/training-centers'
import type { TrainingCenterSimpleInfo } from '@/types'
import { redirect } from 'next/navigation'
import { AddStudentForm } from './_components/add-student-form'

export default async function AddStudentPage() {
  const trainingCenterInfoList: TrainingCenterSimpleInfo[] =
    await listAllTrainingCentersInfo()

  if (!trainingCenterInfoList) redirect('/students')
  return (
    <>
      <h2 className='font-bold'>Cadastrar Aluno</h2>
      <AddStudentForm trainingCenters={trainingCenterInfoList} />
    </>
  )
}
