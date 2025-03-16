'use client'

import { Dialog } from '@/components/ui/dialog'
import { columns, type TrainingCenterData } from './columns'
import { DataTable } from '@/components/datatable'
import { EditTrainingCenterDialog } from './edit-training-center'
import { useState } from 'react'

export function TrainingCentersContent({
  trainingCenters,
}: { trainingCenters: TrainingCenterData[] }) {
  const [selectedTrainingCenterId, setSelectedTrainingCenterId] =
    useState<string>('')

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

  function resetTrainingCenterId() {
    setSelectedTrainingCenterId('')
  }

  return (
    <Dialog>
      <DataTable<TrainingCenterData, unknown>
        columns={columns(setSelectedTrainingCenterId)}
        data={trainingCenters}
        buttonConfig={buttonConfig}
        filterHeaders={filterHeaders}
      />
      <EditTrainingCenterDialog
        resetTrainingCenterId={resetTrainingCenterId}
        trainingCenterId={selectedTrainingCenterId}
      />
    </Dialog>
  )
}
