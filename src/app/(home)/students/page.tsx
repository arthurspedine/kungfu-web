import { Title } from '@/components/title'
import { StudentsContent } from './_components/students-content'
import { listAllStudents } from '@/http/students'
import type { StudentInfo } from '@/types'

export default async function StudentsPage() {
  const studentsList: StudentInfo[] = await listAllStudents()

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-[#D1D1D1] pb-4 w-full'>
        Alunos
      </Title>
      <StudentsContent students={studentsList} />
    </div>
  )
}
