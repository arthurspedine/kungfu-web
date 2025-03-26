import { Label } from '@/components/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AddStudentForm() {
  return (
    <form className='flex flex-col w-full space-y-2'>
      <div className='grid grid-cols-2 gap-4 w-full'>
        <div className='w-full'>
          <Label>Nome Completo</Label>
          <Input placeholder='Digite o nome completo do aluno' />
        </div>
        <div className='w-full'>
          <Label>Sexo</Label>
          <Input placeholder='Selecione o sexo do aluno' />
        </div>
        <div className='w-full'>
          <Label>Data de Nascimento</Label>
          <Input
            type='date'
            placeholder='Digite a data de nascimento do aluno'
          />
        </div>
      </div>
      <h2 className='font-bold'>Faixas</h2>
      <div className='flex gap-8'>
        <div>
          <Label>Faixa</Label>
          <Input placeholder='Selecione a faixa' />
        </div>

        <div>
          <Label>Data de início da faixa</Label>
          <Input
            type='date'
            placeholder='Digite a data de nascimento do aluno'
          />
        </div>
        <div>
          <Label>Data do fim da faixa</Label>
          <Input
            type='date'
            placeholder='Digite a data de nascimento do aluno'
          />
        </div>
      </div>
      <Button
        variant={'link'}
        className='w-fit text-blue-600 underline p-0'
        type='button'
      >
        Novo cadastro de faixa
      </Button>
    </form>
  )
}
