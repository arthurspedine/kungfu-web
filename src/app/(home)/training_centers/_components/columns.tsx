'use client'
import {} from '@/components/ui/dropdown-menu'
import type { ColumnDef } from '@tanstack/react-table'
import {} from 'lucide-react'
import { EditTrainingCenterDialog } from './edit-training-center'

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
        <div className='bg-muted border border-input text-xs rounded-xl text-center max-w-20 py-1'>
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
        <div className='text-right'>
          <EditTrainingCenterDialog trainingCenterId={trainingCenter.id} />
        </div>
      )
    },
  },
]
