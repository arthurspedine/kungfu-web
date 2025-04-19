import { DataTable } from '@/components/datatable/data-table'
import { type TrainingCenterData, columns } from './columns'

export function TrainingCentersContent({
  trainingCenters,
}: { trainingCenters: TrainingCenterData[] }) {
  const buttonConfig = {
    label: 'Cadastrar Núcleo',
    redirectTo: '/training_centers/add',
  }

  const filterColumns = [
    { id: 'name', label: 'Núcleo' },
    { id: 'teacher_name', label: 'Professor Docente' },
    { id: 'city', label: 'Cidade' },
    { id: 'state', label: 'Estado' },
  ]

  return (
    <DataTable
      columns={columns}
      data={trainingCenters}
      buttonConfig={buttonConfig}
      filterColumns={filterColumns}
    />
  )
}
