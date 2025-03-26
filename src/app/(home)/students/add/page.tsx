import { Title } from '@/components/title'
import { AddStudentForm } from './_components/add-student-form'

export default function AddStudentPage() {
  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-[#D1D1D1] pb-4 w-full'>
        Alunos
      </Title>
      <section className='bg-[#F5F7F9] h-full w-full rounded-xl border border-[#CACACA] p-12'>
        <h2 className='font-bold'>Cadastrar Aluno</h2>
        <AddStudentForm />
      </section>
    </div>
  )
}
