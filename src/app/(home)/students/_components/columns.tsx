'use client'

import { Button } from '@/components/ui/button'
import { beltMap } from '@/helper/belts'
import type { StudentInfo } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'

export const columns: ColumnDef<StudentInfo>[] = [
  {
    id: 'id',
    cell: ({ row }) => {
      return <div className='w-12'>{row.index + 1000}</div>
    },
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'birthDate',
    header: 'Data de Nascimento',
    cell: ({ row }) => {
      return <div className='w-20'>{row.getValue('birthDate')}</div>
    },
  },
  {
    accessorKey: 'age',
    header: 'Idade',
    cell: ({ row }) => {
      return <div className='w-20'>{row.getValue('age')} anos</div>
    },
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => {
      return row.getValue('sex') === 'M' ? 'Masculino' : 'Feminino'
    },
  },
  {
    accessorKey: 'currentBelt',
    header: 'Faixa',
    cell: ({ row }) => {
      const value: string = row.getValue('currentBelt')
      const mappedKey: keyof typeof beltMap = value
        .toLowerCase()
        .replace(/(\d)([A-Z])/g, '$1$2'.toLowerCase())
        .replace(/_/g, '') as keyof typeof beltMap
      const currentBelt = beltMap[mappedKey]
      return (
        <div
          style={{
            backgroundColor: currentBelt.color,
            color: currentBelt.textColor,
            borderColor: currentBelt.color,
          }}
          className='text-xs rounded-xl text-center py-1 px-2'
        >
          {currentBelt.label}
        </div>
      )
    },
  },
  {
    accessorKey: 'beltAgeMonths',
    header: 'Tempo de Faixa',
    cell: ({ row }) => {
      const value: number = row.getValue('beltAgeMonths')
      const years = Math.floor(value / 12)
      const months = value % 12

      const yearsPlural = years === 1 ? 'ano' : 'anos'
      const monthsPlural = months === 1 ? 'mês' : 'meses'
      let finalMessage = ''

      if (years > 0) {
        // "mês" se for 1, "meses" se for maior que 1

        finalMessage =
          months > 0
            ? `${years} ${yearsPlural} e ${months} ${monthsPlural}`
            : `${years} ${yearsPlural}`
      } else {
        finalMessage = `${months} ${monthsPlural}`
      }
      return <div>{finalMessage}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original
      return (
        <div className='text-right'>
          <Button variant={'ghost'}>
            <EllipsisVertical />
          </Button>
        </div>
      )
    },
  },
]
