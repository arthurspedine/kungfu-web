import { DataTable } from '@/components/datatable/data-table'
import type { StudentInfo } from '@/types'
import { columns } from './columns'

export function StudentsContent({ students }: { students: StudentInfo[] }) {
  const buttonConfig = {
    label: 'Adicionar Aluno',
    redirectTo: '/students/add',
  }

  return (
    <DataTable
      columns={columns}
      data={students}
      buttonConfig={buttonConfig}
      filterColumns={[]}
    />
  )
}
