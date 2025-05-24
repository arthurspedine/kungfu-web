'use client'
import { DataTable } from '@/components/datatable/data-table'
import type { StudentInfo } from '@/types'
import { columns } from './columns'
import { mapBeltKeyToValue } from '@/helper/belts'
import { mapStudentSex } from '@/helper/studentSex'
import type { DataTableState, Page } from '@/components/datatable/interfaces'
import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { useDataTableState } from '@/hooks/use-datatable-state'
import { listAllStudents } from '@/http/students'

export function StudentsContent({
  initialData,
}: { initialData: Page<StudentInfo> }) {
  const { state, updateState } = useDataTableState()
  const [data, setData] = useState<Page<StudentInfo>>(initialData)
  const [isPending, setIsPending] = useTransition()

  const buttonConfig = {
    label: 'Adicionar Aluno',
    redirectTo: '/students/add',
  }

  const filterColumns = [
    { id: 'trainingCenter', label: 'Núcleo' },
    { id: 'name', label: 'Aluno' },
    { id: 'sex', label: 'Sexo', mapFunction: mapStudentSex },
    { id: 'currentBelt', label: 'Faixa', mapFunction: mapBeltKeyToValue },
  ]

  const fetchData = useCallback(async (tableState: DataTableState) => {
    try {
      const params = new URLSearchParams()
      params.set('page', String(tableState.page))
      params.set('size', String(tableState.size))

      // Add filters
      for (const [key, values] of Object.entries(tableState.filters)) {
        if (values && values.length > 0) {
          for (const value of values) {
            params.append(key, value)
          }
        }
      }

      const result = await listAllStudents(params.toString())
      setData(result)
    } catch (error) {
      console.error('Erro:', error)
    }
  }, [])

  const handleStateChange = useCallback(
    (newState: Partial<DataTableState>) => {
      const updatedState: DataTableState = {
        page: newState.page ?? state.page,
        size: newState.size ?? state.size,
        filters: newState.filters ?? state.filters,
      }
      updateState(newState)

      startTransition(() => {
        fetchData(updatedState)
      })
    },
    [state, updateState, fetchData]
  )

  useEffect(() => {
    const initialState = {
      page: initialData.page,
      size: initialData.size,
      filters: {},
    }

    if (JSON.stringify(state) !== JSON.stringify(initialState)) {
      startTransition(() => {
        fetchData(state)
      })
    }
  }, [state, fetchData, initialData])

  return (
    <DataTable
      columns={columns}
      data={data}
      buttonConfig={buttonConfig}
      filterColumns={filterColumns}
      onStateChange={handleStateChange}
      loading={isPending}
    />
  )
}
