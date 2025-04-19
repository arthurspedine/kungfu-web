'use client'

import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, Pen } from 'lucide-react'

export type TrainingCenterData = {
  id: string
  teacher: {
    id: string
    name: string
  }
  studentsNumber: number
  name: string
  street: string
  number: number
  additionalAddress: null | string
  city: string
  state: string
  zipCode: string
  openingDate: string
  closingDate: string | null
}

export const columns = (
  setSelectedTrainingCenterId: (id: string) => void
): ColumnDef<TrainingCenterData>[] => [
  {
    id: 'id',
    cell: ({ row }) => {
      return row.index + 1
    },
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'teacher.name',
    header: 'Professor Docente',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'fullAddress',
    header: 'Endereço Completo',
    cell: ({ row }) => {
      const { street, number, additionalAddress } = row.original
      const additionalAddressStr =
        additionalAddress != null ? `, ${additionalAddress}` : ''
      return `${street} ${number}${additionalAddressStr}`
    },
  },
  {
    accessorKey: 'city',
    header: 'Cidade',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'openingDate',
    header: 'Inauguração',
    cell: ({ row }) => {
      const value: string | null = row.getValue('openingDate')
      const stripped = value?.split('-')
      if (!stripped || stripped?.length < 2) return value
      return `${stripped[2]}/${stripped[1]}/${stripped[0]}`
    },
  },
  {
    accessorKey: 'closingDate',
    cell: ({ row }) => {
      const value = row.getValue('closingDate')
      return value ? (
        value
      ) : (
        <div className='bg-[#EAEAEA] border border-[#CACACA] text-xs rounded-xl text-center max-w-20 py-1'>
          Sem dados
        </div>
      )
    },
    header: 'Fechamento',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const trainingCenter = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='text-right'>
              <Button variant={'ghost'}>
                <EllipsisVertical />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-6'>
            <DialogTrigger className='w-full'>
              <DropdownMenuItem
                onClick={() => setSelectedTrainingCenterId(trainingCenter.id)}
              >
                Editar
                <DropdownMenuShortcut>
                  <Pen size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
