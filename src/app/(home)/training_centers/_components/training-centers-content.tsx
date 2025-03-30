'use client'

import { DataTable } from '@/components/datatable/data-table'
import { Dialog } from '@/components/ui/dialog'
import { useState } from 'react'
import { type TrainingCenterData, columns } from './columns'
import { EditTrainingCenterDialog } from './edit-training-center'

export function TrainingCentersContent({
  trainingCenters,
}: { trainingCenters: TrainingCenterData[] }) {
  const [selectedTrainingCenterId, setSelectedTrainingCenterId] =
    useState<string>('')

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

  function resetTrainingCenterId() {
    setSelectedTrainingCenterId('')
  }

  return (
    <Dialog>
      <DataTable
        columns={columns(setSelectedTrainingCenterId)}
        data={trainingCenters}
        buttonConfig={buttonConfig}
        filterColumns={filterColumns}
      />
      <EditTrainingCenterDialog
        resetTrainingCenterId={resetTrainingCenterId}
        trainingCenterId={selectedTrainingCenterId}
      />
    </Dialog>
  )
}
