'use client'
import { Label } from '@/components/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { listAllBelts } from '@/http/belts'
import { addStudentSchema, type AddStudentType } from '@/schemas'
import type { RequestBeltType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarFold, Trash } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function AddStudentForm() {
  const [studentBelts, setStudentBelts] = useState()
  const [beltTypes, setBeltTypes] = useState<RequestBeltType[]>([])

  useEffect(() => {
    const fetchBeltTypes = async () => {
      try {
        const response = await listAllBelts()
        setBeltTypes(response)
      } catch (e) {
        toast.error('Houve um erro, por favor tente novamente mais tarde.')
        redirect('/students')
      }
    }
    fetchBeltTypes()
  }, [])

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    clearErrors,
  } = useForm<AddStudentType>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      belts: [{ type: '', acquisitionDate: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'belts',
  })

  function setSexValue(value: string) {
    setValue('student.sex', (value as 'M') || 'F')
    clearErrors('student.sex')
  }

  function handleFormSubmit(data: AddStudentType) {
    console.log(data)
  }

  useEffect(() => {
    console.log(errors.belts)
  }, [errors])

  return (
    <form
      className='flex flex-col w-full space-y-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className='grid grid-cols-2 gap-4 w-full'>
        <div className='w-full'>
          <Label>Nome Completo</Label>
          <Input
            placeholder='Digite o nome completo do aluno'
            {...register('student.name')}
          />
          {errors.student?.name && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.student?.name.message}
            </p>
          )}
        </div>
        <div className='w-full'>
          <Label>Sexo</Label>
          <Select
            onValueChange={setSexValue}
            value={watch('student.sex') || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione o sexo do aluno' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='M'>Masculino</SelectItem>
              <SelectItem value='F'>Feminino</SelectItem>
            </SelectContent>
          </Select>
          {errors.student?.sex && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.student?.sex.message}
            </p>
          )}
        </div>
        <div className='w-full'>
          <Label className='text-nowrap'>Data de Nascimento</Label>
          <Input
            type='date'
            placeholder='Digite a data de nascimento do aluno'
            {...register('student.birthDate')}
          />
          {errors.student?.birthDate && (
            <p className='text-destructive text-sm pt-0.5 text-nowrap'>
              {errors.student?.birthDate.message}
            </p>
          )}
        </div>
      </div>
      <h2 className='font-bold'>Faixas</h2>
      {/* FAIXA CARD */}
      {fields.map((field, index) => (
        <div key={field.id} className='flex justify-between mb-2'>
          <div className='flex gap-4'>
            <div>
              <Label>Faixa</Label>
              <Select
                onValueChange={value => {
                  setValue(`belts.${index}.type`, value)
                  clearErrors(`belts.${index}.type`)
                }}
                value={watch(`belts.${index}.type`) || ''}
              >
                <SelectTrigger className='w-60'>
                  <SelectValue placeholder='Selecione a faixa' />
                </SelectTrigger>
                <SelectContent>
                  {beltTypes.map(belt => {
                    const beltType = Object.keys(belt)[0]
                    const beltLabel = belt[beltType]
                    return (
                      <SelectItem key={beltType} value={beltType}>
                        {beltLabel}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.belts?.[index]?.type && (
                <p className='text-destructive text-sm pt-0.5'>
                  {typeof errors.belts[index]?.type === 'object'
                    ? errors.belts[index].type?.message
                    : null}
                </p>
              )}
            </div>
            <div>
              <Label className='text-nowrap'>Data de início da faixa</Label>
              <Input
                type='date'
                placeholder='Digite a data de nascimento do aluno'
                {...register(`belts.${index}.acquisitionDate`)}
              />
              {errors.belts?.[index]?.acquisitionDate && (
                <p className='text-destructive text-sm pt-0.5 text-nowrap'>
                  {errors.belts?.[index].acquisitionDate?.message}
                </p>
              )}
            </div>
          </div>
          <div className='flex gap-4'>
            <div>
              <Label className='text-nowrap'>Data do fim da faixa</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='outline' className='self-end'>
                      <CalendarFold />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>
                      A data de término da faixa é definida a partir do início
                      da próxima faixa.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {fields.length > 1 && (
              <Button
                type='button'
                variant={'destructive'}
                onClick={() => remove(index)}
                className='mt-5'
              >
                <Trash />
              </Button>
            )}
          </div>
        </div>
      ))}
      {errors.belts && !Array.isArray(errors.belts) && (
        <p className='text-destructive text-sm pt-0.5'>
          {errors.belts.message}
        </p>
      )}
      <Button
        variant={'link'}
        className='w-fit text-blue-600 underline p-0'
        type='button'
        onClick={() => append({ type: '', acquisitionDate: '' })}
      >
        Novo cadastro de faixa
      </Button>
      <Button variant={'green'}>Salvar Aluno</Button>
    </form>
  )
}
