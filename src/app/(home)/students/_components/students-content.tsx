'use client'
import { DataTable } from '@/components/datatable/data-table'
import type { StudentInfo } from '@/types'
import { columns } from './columns'
import { mapBeltValue } from '@/helper/belts'
import { mapStudentSex } from '@/helper/studentSex'

export function StudentsContent({ students }: { students: StudentInfo[] }) {
  const buttonConfig = {
    label: 'Adicionar Aluno',
    redirectTo: '/students/add',
  }

  const filterColumns = [
    { id: 'trainingCenter', label: 'Núcleo' },
    { id: 'name', label: 'Aluno' },
    { id: 'sex', label: 'Sexo', mapFunction: mapStudentSex },
    { id: 'currentBelt', label: 'Faixa', mapFunction: mapBeltValue },
  ]

  return (
    <DataTable
      columns={columns}
      data={students}
      buttonConfig={buttonConfig}
      filterColumns={filterColumns}
    />
  )
}
