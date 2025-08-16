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
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { mapBeltValueToKey } from '@/helper/belts'
import { listAllBelts } from '@/http/belts'
import { handleUpdateStudent } from '@/http/students'
import { type FormStudentType, formStudentSchema } from '@/schemas'
import type {
  RequestBeltType,
  StudentDetails,
  TrainingCenterSimpleInfo,
} from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarFold, Trash } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TrainingCenterCombobox } from '../../../_components/training-center-combobox'
import { validateBeltSequence } from '../../../validate-belt-sequence'

export function EditStudentForm({
  studentData,
  trainingCenters,
}: {
  studentData: StudentDetails
  trainingCenters: TrainingCenterSimpleInfo[]
}) {
  const [beltTypes, setBeltTypes] = useState<RequestBeltType[]>([])

  const formattedBelts = studentData.belts.map(belt => ({
    type: mapBeltValueToKey(belt.name)?.toLocaleUpperCase(),
    achievedDate: belt.achievedDate,
  }))

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
    getValues,
    watch,
    clearErrors,
  } = useForm<FormStudentType>({
    resolver: zodResolver(formStudentSchema),
    defaultValues: {
      student: {
        name: studentData.student.name,
        birthDate: studentData.student.birthDate,
        sex: studentData.student.sex as 'M' | 'F',
      },
      belts:
        formattedBelts.length > 0
          ? formattedBelts
          : [{ type: '', achievedDate: '' }],
      trainingCenterId: '',
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

  function handleFormSubmit(data: FormStudentType) {
    const validationResult = validateBeltSequence(data.belts, beltTypes)
    if (!validationResult.isValid) {
      toast.error(validationResult.message, {
        position: 'top-center',
        duration: 10 * 1000, // 10 seconds
        style: { filter: 'none', zIndex: 10 },
      })
      return
    }
    const handleRequest = handleUpdateStudent(studentData.id, data)
    toast.promise(handleRequest, {
      loading: 'Atualizando informações...',
      success: () => {
        setTimeout(() => {
          redirect('/students')
        }, 500)
        return 'Aluno atualizado com sucesso!'
      },
      error: 'Algo deu errado. Por favor, tente novamente.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <form
      className='flex flex-col w-full space-y-2'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4 w-full'>
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
            defaultValue={studentData.student.sex}
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
        <div className='w-full'>
          <Label className='text-nowrap'>Núcleo</Label>
          <TrainingCenterCombobox
            setValue={setValue}
            clearErrors={clearErrors}
            trainingCenterList={trainingCenters}
            initialValue={studentData.trainingCenter.id}
          />
          {errors.trainingCenterId && (
            <p className='text-destructive text-sm pt-0.5 text-nowrap'>
              {errors.trainingCenterId.message}
            </p>
          )}
        </div>
      </div>
      <h2 className='font-bold'>Faixas</h2>
      {/* FAIXA CARD */}
      {fields.map((field, index) => (
        <div key={field.id}>
          {/* BELT INPUTS */}
          <div className='flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between mb-2'>
            {/* BELT AND ACHIEVED DATE */}
            <div className='flex flex-col gap-2 lg:flex-row lg:gap-4'>
              <div>
                <Label>Faixa</Label>
                <Select
                  onValueChange={value => {
                    setValue(`belts.${index}.type`, value)
                    clearErrors(`belts.${index}.type`)
                  }}
                  value={watch(`belts.${index}.type`) || ''}
                >
                  <SelectTrigger className='w-full lg:w-60'>
                    <SelectValue placeholder='Selecione a faixa' />
                  </SelectTrigger>
                  <SelectContent>
                    {beltTypes.map(belt => {
                      const beltType = Object.keys(belt)[0]
                      const beltLabel = belt[beltType]

                      const isAlreadySelected = getValues('belts').some(
                        (selectedBelt, i) =>
                          selectedBelt.type === beltType && i !== index
                      )

                      if (
                        !isAlreadySelected ||
                        watch(`belts.${index}.type`) === beltType
                      ) {
                        return (
                          <SelectItem key={beltType} value={beltType}>
                            {beltLabel}
                          </SelectItem>
                        )
                      }
                      return null
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
                  className='w-full lg:w-fit'
                  {...register(`belts.${index}.achievedDate`)}
                />
                {errors.belts?.[index]?.achievedDate && (
                  <p className='text-destructive text-sm pt-0.5'>
                    {errors.belts?.[index].achievedDate?.message}
                  </p>
                )}
              </div>
            </div>
            {/* END BELT TIME + DELETE BUTTON */}
            <div className='flex justify-between lg:justify-normal gap-4'>
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
                      <p>A data de término da faixa definido pelo </p>
                      <p>início da próxima faixa se for seguido</p>
                      <p>a sequência correta.</p>
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
          <Separator />
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
        onClick={() => append({ type: '', achievedDate: '' })}
      >
        Novo cadastro de faixa
      </Button>
      <div className='flex flex-col-reverse gap-2 sm:gap-4 sm:flex-row'>
        <Button
          variant={'outline'}
          className='grow'
          type='button'
          onClick={() => redirect('/students')}
        >
          Cancelar
        </Button>
        <Button variant={'green'} className='grow'>
          Atualizar Aluno
        </Button>
      </div>
    </form>
  )
}
