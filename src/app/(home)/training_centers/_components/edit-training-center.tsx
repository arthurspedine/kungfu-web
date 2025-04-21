'use client'
import { Label } from '@/components/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getTrainingCenterInfo,
  handleUpdateTrainingCenter,
} from '@/http/training-centers'
import {
  type EditTrainingCenterType,
  editTrainingCenterSchema,
} from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Pen, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { listAllTeachers } from '@/http/teacher'
import { TeacherCombobox } from '../add/_components/teacher-combobox'
import type { TrainingCenterData } from './columns'

export function EditTrainingCenterDialog({
  trainingCenterId,
}: { trainingCenterId: string }) {
  const [trainingCenter, setTrainingCenter] = useState<TrainingCenterData>(
    {} as TrainingCenterData
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teacherList, setTeacherList] = useState<
    { id: string; name: string }[]
  >([])
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null)

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useForm<EditTrainingCenterType>({
    resolver: zodResolver(editTrainingCenterSchema),
  })

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

      const loadingToast = toast.loading('Atualizado informações...', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })

      const result = await handleUpdateTrainingCenter(trainingCenter.id, {
        ...data,
        zipCode: formattedZipCode,
      })

      if (result.success) {
        toast.dismiss(loadingToast)
        toast.success('Núcleo atualizado com sucesso!', {
          position: 'top-center',
          style: { filter: 'none', zIndex: 10 },
        })
        dialogCloseRef.current?.click()
      } else {
        toast.dismiss(loadingToast)
        toast.error(result.message, {
          position: 'top-center',
          style: { filter: 'none', zIndex: 10 },
        })
      }
    } else {
      toast.info('Nenhuma alteração detectada.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      dialogCloseRef.current?.click()
    }
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-6'>
          <DialogTrigger className='w-full'>
            <DropdownMenuItem onClick={fetchTrainingCenterInfo}>
              Editar
              <DropdownMenuShortcut>
                <Pen size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        onOpenAutoFocus={e => {
          e.preventDefault()
        }}
      >
        <div className='flex flex-col gap-6 h-full justify-end'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Editar Núcleo</DialogTitle>
              <DialogClose ref={dialogCloseRef}>
                <X className='size-5 text-zinc-600' />
              </DialogClose>
            </div>

            <DialogDescription asChild>
              {isLoading ? (
                <div>
                  <Skeleton className='w-full h-12' />
                </div>
              ) : (
                <p>Editar informações do núcleo {getValues('name')}</p>
              )}
            </DialogDescription>
          </div>

          <form
            className='flex-1 flex flex-col justify-between'
            onSubmit={handleSubmit(handleEditSubmit)}
          >
            {isLoading ? (
              <div className='w-full space-y-2'>
                <div>
                  <Label>Nome do Núcleo</Label>
                  <Skeleton className='h-9 w-full' />
                </div>
                <div>
                  <Label>CEP</Label>
                  <Skeleton className='h-9 w-full' />
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Skeleton className='h-9 w-full' />
                </div>
                <div className='flex space-x-4 w-full'>
                  <div className='w-1/3'>
                    <Label>Número</Label>
                    <Skeleton className='h-9 w-full' />
                  </div>
                  <div className='w-2/3'>
                    <Label>Complemento</Label>
                    <Skeleton className='h-9 w-full' />
                  </div>
                </div>
                <div className='flex space-x-4 w-full'>
                  <div className='w-1/2'>
                    <Label>Cidade</Label>
                    <Skeleton className='h-9 w-full' />
                  </div>
                  <div className='w-1/2'>
                    <Label>Estado</Label>
                    <Skeleton className='h-9 w-full' />
                  </div>
                </div>
                <div>
                  <Label>Professor Docente</Label>
                  <Skeleton className='h-9 w-full' />
                </div>
                <div>
                  <Label>Data de Inauguração</Label>
                  <Skeleton className='h-9 w-40' />
                </div>
              </div>
            ) : (
              <div className='w-full space-y-2'>
                <div>
                  <Label>Nome do Núcleo</Label>
                  <Input {...register('name')} />
                  {errors.name && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>CEP</Label>
                  <Input {...register('zipCode')} />
                  {errors.zipCode && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input {...register('street')} />
                  {errors.street && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div className='flex space-x-4 w-full'>
                  <div className='w-1/3'>
                    <Label>Número</Label>
                    <Input
                      {...register('number', { valueAsNumber: true })}
                      type='number'
                    />
                    {errors.number && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.number.message}
                      </p>
                    )}
                  </div>
                  <div className='w-2/3'>
                    <Label>Complemento</Label>
                    <Input
                      placeholder='Digite o complemento do núcleo'
                      {...register('additionalAddress')}
                    />
                    {errors.additionalAddress && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.additionalAddress.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex space-x-4 w-full'>
                  <div className='w-1/2'>
                    <Label>Cidade</Label>
                    <Input {...register('city')} />
                    {errors.city && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className='w-1/2'>
                    <Label>Estado</Label>
                    <Input {...register('state')} />
                    {errors.state && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Professor Docente</Label>
                  <TeacherCombobox
                    setValue={setValue}
                    clearErrors={clearErrors}
                    teachersList={teacherList}
                    initialValue={getValues('teacherId')}
                  />
                  {errors.teacherId && (
                    <p className='text-destructive text-sm pt-0.5'>
                      {errors.teacherId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Data de Inauguração</Label>
                  <Input
                    type='date'
                    className='w-40'
                    {...register('openingDate')}
                  />
                  {errors.openingDate && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.openingDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Data de Fechamento (opcional)</Label>
                  <Input
                    type='date'
                    className='w-40'
                    {...register('closingDate')}
                  />
                  {errors.closingDate && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.closingDate.message}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className='flex items-center gap-3'>
              <DialogClose asChild>
                <Button type='button' className='flex-1' variant='secondary'>
                  Fechar
                </Button>
              </DialogClose>
              <Button className='flex-1'>Salvar</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
