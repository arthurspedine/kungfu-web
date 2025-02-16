'use client'

import { EllipsisVertical } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

export type TrainingCenterData = {
  id: string
  teacher: {
    name: string
  }
  studentsNumber: number
  name: string
  fullAddress: string
  city: string
  state: string
  zipCode: string
  openingDate: string
  closingDate: string | null
}

export const columns: ColumnDef<TrainingCenterData>[] = [
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
  },
  {
    accessorKey: 'teacher.name',
    header: 'Professor Docente',
  },
  {
    accessorKey: 'fullAddress',
    header: 'Endereço',
  },
  {
    accessorKey: 'city',
    header: 'Cidade',
  },
  {
    accessorKey: 'state',
    header: 'Estado',
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
        <button type='button' onClick={() => console.log(trainingCenter.id)}>
          <EllipsisVertical />
        </button>
      )
    },
  },
]
