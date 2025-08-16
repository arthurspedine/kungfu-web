'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, Pen } from 'lucide-react'
import { useRef } from 'react'
import { EditTrainingCenterForm } from './edit-training-center-form'
import { useRefreshTrainingCenters } from './training-centers-content'

export function EditTrainingCenterDialog({
  trainingCenterId,
}: { trainingCenterId: string }) {
  const refreshContext = useRefreshTrainingCenters()
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null)

  function handleSuccess() {
    refreshContext()
    dialogCloseRef.current?.click()
  }

  function handleCancel() {
    dialogCloseRef.current?.click()
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Abrir menu</span>
            <EllipsisVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DialogTrigger asChild>
            <DropdownMenuItem className='cursor-pointer'>
              <Pen />
              Editar
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col'>
        <DialogTitle>Editar Núcleo</DialogTitle>
        <DialogDescription>
          Atualize as informações do núcleo de treinamento.
        </DialogDescription>

        <div className='overflow-y-auto max-h-[90vh] pt-4 pb-4'>
          <EditTrainingCenterForm
            trainingCenterId={trainingCenterId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        <DialogClose ref={dialogCloseRef} className='hidden' />
      </DialogContent>
    </Dialog>
  )
}

// Standalone component that can be used on the details page
export function EditTrainingCenterStandalone({
  trainingCenterId,
  onSuccess,
}: {
  trainingCenterId: string
  onSuccess?: () => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Pen className='h-4 w-4 mr-2' />
          Editar Núcleo
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
        <DialogTitle>Editar Núcleo</DialogTitle>
        <DialogDescription>
          Atualize as informações do núcleo de treinamento.
        </DialogDescription>

        <div className='overflow-y-auto max-h-[90vh] pt-4 pb-4'>
          <EditTrainingCenterForm
            trainingCenterId={trainingCenterId}
            onSuccess={onSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
