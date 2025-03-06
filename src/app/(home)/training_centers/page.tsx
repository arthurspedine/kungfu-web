import { Title } from '@/components/title'
import { getTrainingCentersList } from '@/http/training-centers'
import { type TrainingCenterData, columns } from './_components/columns'
import { DataTable } from '@/components/datatable'

export default async function TrainingCentersPage() {
  const trainingCenters: TrainingCenterData[] = await getTrainingCentersList()
  const filterHeaders = [
    { headerName: 'name', selectHeader: 'Núcleo' },
    { headerName: 'teacher_name', selectHeader: 'Professor Docente' },
    { headerName: 'city', selectHeader: 'Cidade' },
    { headerName: 'state', selectHeader: 'Estado' },
  ]

  const buttonConfig = {
    label: 'Cadastrar Núcleo',
    redirectTo: '/training_centers/add',
  }

  return (
    <div className='flex flex-col flex-grow w-full space-y-6'>
      <Title className='text-4xl border-b border-[#D1D1D1] pb-4 w-full'>
        Núcleos
      </Title>
      <DataTable<TrainingCenterData, unknown>
        columns={columns}
        data={trainingCenters}
        buttonConfig={buttonConfig}
        filterHeaders={filterHeaders}
      />
    </div>
  )
}
