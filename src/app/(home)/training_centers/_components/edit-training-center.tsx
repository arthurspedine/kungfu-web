'use client'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { TrainingCenterData } from './columns'
import { getTrainingCenterInfo } from '@/http/training-centers'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Label } from '@/components/label'
import { Input } from '@/components/ui/input'

export function EditTrainingCenterDialong({
  trainingCenterId,
}: { trainingCenterId: string }) {
  const [trainingCenter, setTrainingCenter] =
    useState<TrainingCenterData | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpenRef = useRef<boolean>(false)

  useEffect(() => {
    isOpenRef.current = true

    setTrainingCenter(null)

    const fetchTrainingCenterInfo = async () => {
      if (trainingCenterId && isOpenRef.current) {
        const data = await getTrainingCenterInfo(trainingCenterId)
        if (isOpenRef.current) {
          if (data) {
            setTrainingCenter(data)
          } else {
            closeRef.current?.click()
            toast.error('Você não tem permissão para atualizar este núcleo', {
              position: 'top-center',
              style: { filter: 'none', zIndex: 10 },
            })
            setTrainingCenter(null)
          }
        }
      }
    }

    fetchTrainingCenterInfo()

    return () => {
      isOpenRef.current = false
    }
  }, [trainingCenterId])

  return (
    <>
      <DialogClose ref={closeRef} className='hidden' />
      <DialogContent
        onOpenAutoFocus={() => {
          isOpenRef.current = true
          setTrainingCenter(null)
        }}
        onPointerDownOutside={() => {
          isOpenRef.current = false
        }}
      >
        <div className='flex flex-col gap-6 h-full justify-end'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Editar Núcleo</DialogTitle>
              <DialogClose
                onClick={() => {
                  isOpenRef.current = false
                }}
              >
                <X className='size-5 text-zinc-600' />
              </DialogClose>
            </div>

            <DialogDescription>
              {trainingCenter ? (
                <> Editar informações do núcleo {trainingCenter.name}</>
              ) : (
                <></>
              )}
            </DialogDescription>
            {!trainingCenter && <Skeleton className='w-full h-12' />}
          </div>

          <form className='flex-1 flex flex-col justify-between'>
            {trainingCenter ? (
              <div className='w-full space-y-2'>
                <div>
                  <Label>Nome do Núcleo</Label>
                  <Input />
                </div>
                <div>
                  <Label>Código Postal</Label>
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
            ) : (
              <div className='w-full space-y-2'>
                <div>
                  <Label>Nome do Núcleo</Label>
                  <Skeleton className='h-9 w-full' />
                </div>
                <div>
                  <Label>Código Postal</Label>
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
            )}
            <div className='flex items-center gap-3'>
              <DialogClose
                asChild
                onClick={() => {
                  isOpenRef.current = false
                }}
              >
                <Button type='button' className='flex-1' variant='secondary'>
                  Fechar
                </Button>
              </DialogClose>
              <Button className='flex-1'>Salvar</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </>
  )
}
