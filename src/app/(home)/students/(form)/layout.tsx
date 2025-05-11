import { Title } from '@/components/title'

export default function StudentFormLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-input pb-4 w-full'>
        Alunos
      </Title>
      <section className='bg-secondary h-full w-full rounded-xl border border-input p-4 sm:p-12'>
        {children}
      </section>
    </div>
  )
}
