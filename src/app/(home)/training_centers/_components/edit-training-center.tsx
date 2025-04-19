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
import { getTrainingCenterInfo } from '@/http/training-centers'
import {
  type EditTrainingCenterType,
  editTrainingCenterSchema,
} from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Pen, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { TrainingCenterData } from './columns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function EditTrainingCenterDialog({
  trainingCenterId,
}: { trainingCenterId: string }) {
  const [trainingCenter, setTrainingCenter] = useState<TrainingCenterData>(
    {} as TrainingCenterData
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<EditTrainingCenterType>({
    resolver: zodResolver(editTrainingCenterSchema),
  })

  async function fetchTrainingCenterInfo() {
    setIsLoading(true)
    clearErrors()
    reset()

    const data = await getTrainingCenterInfo(trainingCenterId)
    if (data) {
      // biome-ignore lint/complexity/noForEach: use forEach
      Object.keys(data).forEach(key => {
        const k = key as keyof EditTrainingCenterType
        const value = data[key as keyof TrainingCenterData]
        console.log(k)
        console.log(value)

        setValue(k, value)
      })
      toast.info('A funcionalidade de edição ainda não está disponível.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      setTrainingCenter(data)
      setIsLoading(false)
    } else {
      toast.error('Você não tem permissão para atualizar este núcleo.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      setIsLoading(true)
    }
  }

  function handleEditSubmit(data: EditTrainingCenterType) {
    console.log(data)
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
      <DialogContent>
        <div className='flex flex-col gap-6 h-full justify-end'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Editar Núcleo</DialogTitle>
              <DialogClose>
                <X className='size-5 text-zinc-600' />
              </DialogClose>
            </div>

            <DialogDescription>
              {isLoading ? (
                <div>
                  <Skeleton className='w-full h-12' />
                </div>
              ) : (
                <> Editar informações do núcleo {getValues('name')}</>
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
                  <Input />
                </div>
                <div>
                  <Label>CEP</Label>
                  <Input />
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input />
                </div>
                <div className='flex space-x-4 w-full'>
                  <div className='w-1/3'>
                    <Label>Número</Label>
                    <Input />
                  </div>
                  <div className='w-2/3'>
                    <Label>Complemento</Label>
                    <Input />
                  </div>
                </div>
                <div className='flex space-x-4 w-full'>
                  <div className='w-1/2'>
                    <Label>Cidade</Label>
                    <Input />
                  </div>
                  <div className='w-1/2'>
                    <Label>Estado</Label>
                    <Input />
                  </div>
                </div>
                <div>
                  <Label>Professor Docente</Label>
                  <Input />
                </div>
                <div>
                  <Label>Data de Inauguração</Label>
                  <Input type='date' className='w-40' />
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
