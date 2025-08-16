'use client'
import { Label } from '@/components/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { listAllTeachers } from '@/http/teacher'
import {
  getTrainingCenterInfo,
  handleUpdateTrainingCenter,
} from '@/http/training-centers'
import {
  type EditTrainingCenterType,
  editTrainingCenterSchema,
} from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TeacherCombobox } from '../add/_components/teacher-combobox'
import type { TrainingCenterData } from './columns'

interface EditTrainingCenterFormProps {
  trainingCenterId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function EditTrainingCenterForm({
  trainingCenterId,
  onSuccess,
  onCancel,
}: EditTrainingCenterFormProps) {
  const [trainingCenter, setTrainingCenter] = useState<TrainingCenterData>(
    {} as TrainingCenterData
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teacherList, setTeacherList] = useState<
    { id: string; name: string }[]
  >([])
  const [closingDateValue, setClosingDateValue] = useState<string>('')

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm<EditTrainingCenterType>({
    resolver: zodResolver(editTrainingCenterSchema),
  })

  useEffect(() => {
    fetchTrainingCenterInfo()
  }, [])

  async function fetchTrainingCenterInfo() {
    setIsLoading(true)
    clearErrors()
    reset()

    const [trainingCenterData, teacherList] = await Promise.all([
      getTrainingCenterInfo(trainingCenterId).catch(() => null),
      listAllTeachers(),
    ])

    if (teacherList.length === 0) {
      setIsLoading(true)
      toast.error('Houve um erro ao listar todos os professores docentes.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      return
    }

    setTeacherList(teacherList)

    if (trainingCenterData) {
      let formattedZipCode = trainingCenterData.zipCode
      if (trainingCenterData.zipCode.length > 5) {
        formattedZipCode = `${trainingCenterData.zipCode.slice(0, 5)}-${trainingCenterData.zipCode.slice(5)}`
      }

      setValue('name', trainingCenterData.name)
      setValue('street', trainingCenterData.street)
      setValue('number', trainingCenterData.number)
      setValue('additionalAddress', trainingCenterData.additionalAddress || '')
      setValue('city', trainingCenterData.city)
      setValue('state', trainingCenterData.state)
      setValue('zipCode', formattedZipCode)
      setValue('openingDate', trainingCenterData.openingDate)
      setValue('closingDate', trainingCenterData.closingDate)
      setValue('teacherId', trainingCenterData.teacher.id)

      setClosingDateValue(trainingCenterData.closingDate || '')
      setTrainingCenter(trainingCenterData)
      setIsLoading(false)
    } else {
      toast.error('Você não tem permissão para atualizar este núcleo.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      setIsLoading(true)
    }
  }

  function clearClosingDate() {
    setClosingDateValue('')
    setValue('closingDate', null)
    clearErrors('closingDate')
  }

  async function handleEditSubmit(data: EditTrainingCenterType) {
    if (data.closingDate) {
      const openingDate = new Date(data.openingDate)
      const closingDate = new Date(data.closingDate)
      if (openingDate >= closingDate) {
        setError('closingDate', {
          message:
            'A data de fechamento deve ser posterior a data de inauguração.',
        })
        return
      }
    }

    const hasChanges =
      data.name !== trainingCenter.name ||
      data.street !== trainingCenter.street ||
      data.number !== trainingCenter.number ||
      data.additionalAddress !== (trainingCenter.additionalAddress || '') ||
      data.city !== trainingCenter.city ||
      data.state !== trainingCenter.state ||
      data.zipCode.replace('-', '') !== trainingCenter.zipCode ||
      data.openingDate !== trainingCenter.openingDate ||
      data.closingDate !== trainingCenter.closingDate ||
      data.teacherId !== trainingCenter.teacher.id

    if (hasChanges) {
      let formattedZipCode = data.zipCode.slice(0, 8)
      if (data.zipCode.length > 5) {
        formattedZipCode = `${data.zipCode.slice(0, 5)}-${data.zipCode.slice(5)}`
      }

      const loadingToast = toast.loading('Atualizando informações...', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })

      // Envia null se a data de fechamento estiver vazia
      const dataToSubmit = {
        ...data,
        zipCode: formattedZipCode,
        closingDate: data.closingDate || null,
      }

      const result = await handleUpdateTrainingCenter(
        trainingCenter.id,
        dataToSubmit
      )

      toast.dismiss(loadingToast)

      if (result.success) {
        toast.success('Núcleo atualizado com sucesso!', {
          position: 'top-center',
          style: { filter: 'none', zIndex: 10 },
        })
        onSuccess?.()
      } else {
        toast.error(result.message, {
          position: 'top-center',
          style: { filter: 'none', zIndex: 10 },
        })
      }
    } else {
      toast.info('Nenhuma alteração foi feita.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      onCancel?.()
    }
  }

  if (isLoading) {
    return <EditTrainingCenterFormSkeleton />
  }

  return (
    <form onSubmit={handleSubmit(handleEditSubmit)}>
      <div className='space-y-4 pr-2'>
        {/* Nome */}
        <div>
          <Label>Nome do Núcleo</Label>
          <Input placeholder='Digite o nome do núcleo' {...register('name')} />
          {errors.name && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Endereço */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2'>
            <Label>Rua</Label>
            <Input placeholder='Nome da rua' {...register('street')} />
            {errors.street && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.street.message}
              </p>
            )}
          </div>
          <div>
            <Label>Número</Label>
            <Input
              type='number'
              placeholder='Nº'
              {...register('number', { valueAsNumber: true })}
            />
            {errors.number && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.number.message}
              </p>
            )}
          </div>
        </div>

        {/* Complemento */}
        <div>
          <Label>Complemento (Opcional)</Label>
          <Input
            placeholder='Apartamento, sala, etc.'
            {...register('additionalAddress')}
          />
        </div>

        {/* Cidade e Estado */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label>Cidade</Label>
            <Input placeholder='Cidade' {...register('city')} />
            {errors.city && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.city.message}
              </p>
            )}
          </div>
          <div>
            <Label>Estado</Label>
            <Input placeholder='Estado' {...register('state')} />
            {errors.state && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        {/* CEP */}
        <div>
          <Label>CEP</Label>
          <Input placeholder='00000-000' {...register('zipCode')} />
          {errors.zipCode && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.zipCode.message}
            </p>
          )}
        </div>

        {/* Datas */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label>Data de Inauguração</Label>
            <Input type='date' {...register('openingDate')} />
            {errors.openingDate && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.openingDate.message}
              </p>
            )}
          </div>
          <div>
            <Label>Data de Fechamento (Opcional)</Label>
            <div className='relative'>
              <Input
                type='date'
                value={closingDateValue}
                onChange={e => {
                  setClosingDateValue(e.target.value)
                  setValue('closingDate', e.target.value)
                  clearErrors('closingDate')
                }}
                placeholder='Data de fechamento'
              />
              {closingDateValue && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={clearClosingDate}
                  className='absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100'
                >
                  <XCircle className='h-4 w-4 text-gray-500' />
                </Button>
              )}
            </div>
            {errors.closingDate && (
              <p className='text-destructive text-sm pt-0.5'>
                {errors.closingDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Professor */}
        <div>
          <Label>Professor Docente</Label>
          <TeacherCombobox
            setValue={setValue}
            clearErrors={clearErrors}
            teachersList={teacherList}
            initialValue={trainingCenter.teacher?.id}
          />
          {errors.teacherId && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.teacherId.message}
            </p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
        <DialogClose asChild>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type='submit'>Salvar Alterações</Button>
      </div>
    </form>
  )
}

function EditTrainingCenterFormSkeleton() {
  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 space-y-4 pr-2'>
        {/* Nome */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>

        {/* Endereço */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2 space-y-2'>
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>

        {/* Complemento */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-10 w-full' />
        </div>

        {/* Cidade e Estado */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-14' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>

        {/* CEP */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-10 w-full' />
        </div>

        {/* Datas */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>

        {/* Professor */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      {/* Botões */}
      <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
        <Skeleton className='h-10 w-20' />
        <Skeleton className='h-10 w-32' />
      </div>
    </div>
  )
}
