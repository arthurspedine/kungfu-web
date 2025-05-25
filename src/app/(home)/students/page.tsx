import { Title } from '@/components/title'
import { StudentsContent } from './_components/students-content'

export default async function StudentsPage() {
  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-input pb-4 w-full'>
        Alunos
      </Title>

      <StudentsContent />
    </div>
  )
}
