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
import Loading from '../../loading'

export function StudentsContent() {
  const { state, updateState } = useDataTableState()
  const [data, setData] = useState<Page<StudentInfo> | null>(null)
  const [isPending, setIsPending] = useTransition()

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
    fetchData(state)
  }, [fetchData, state])

  return !data ? (
    <Loading />
  ) : (
    <DataTable
      columns={columns}
      data={data}
      buttonConfig={{
        label: 'Adicionar Aluno',
        redirectTo: '/students/add',
      }}
      filterColumns={[
        { id: 'trainingCenter', label: 'Núcleo' },
        { id: 'name', label: 'Aluno' },
        { id: 'sex', label: 'Sexo', mapFunction: mapStudentSex },
        { id: 'currentBelt', label: 'Faixa', mapFunction: mapBeltKeyToValue },
      ]}
      onStateChange={handleStateChange}
      loading={isPending}
    />
  )
}
