'use client'
import { calculateBeltDuration, mapBeltKeyToValue } from '@/helper/belts'
import { mapStudentSex } from '@/helper/studentSex'
import type { StudentInfo } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { EditStudentDialog } from './edit-student-dialog'

export const columns: ColumnDef<StudentInfo>[] = [
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
      return <div className='w-14'>{row.getValue('age')} anos</div>
    },
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => {
      return mapStudentSex(row.getValue('sex')).label
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'currentBelt',
    header: 'Faixa',
    cell: ({ row }) => {
      const value: string = row.getValue('currentBelt')
      const currentBelt = mapBeltKeyToValue(value)
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'beltAgeMonths',
    header: 'Tempo de Faixa',
    cell: ({ row }) => {
      const value: number = row.getValue('beltAgeMonths')
      return <div>{calculateBeltDuration(value)}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original
      return (
        <div className='text-right'>
          <EditStudentDialog studentId={student.id} />
        </div>
      )
    },
  },
  {
    accessorKey: 'trainingCenter',
    id: 'trainingCenter',
    meta: { hidden: true },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
