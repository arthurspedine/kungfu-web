'use client'
import { type TrainingCenterData, columns } from './columns'
import type { DataTableState, Page } from '@/components/datatable/interfaces'
import { useDataTableState } from '@/hooks/use-datatable-state'
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { getTrainingCentersList } from '@/http/training-centers'
import { DataTable } from '@/components/datatable/data-table'

const RefreshContext = createContext<(() => void) | null>(null)

export const useRefreshTrainingCenters = () => {
  const refresh = useContext(RefreshContext)
  if (!refresh) {
    throw new Error(
      'useRefreshTrainingCenters must be used within RefreshContext'
    )
  }
  return refresh
}

export function TrainingCentersContent({
  initialData,
}: { initialData: Page<TrainingCenterData> }) {
  const { state, updateState } = useDataTableState()
  const [data, setData] = useState<Page<TrainingCenterData>>(initialData)
  const [isPending, setIsPending] = useTransition()

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

      const result = await getTrainingCentersList(params.toString())
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

  const refreshData = useCallback(() => {
    startTransition(() => {
      fetchData(state)
    })
  }, [fetchData, state])

  return (
    <RefreshContext.Provider value={refreshData}>
      <DataTable
        columns={columns}
        data={data}
        buttonConfig={buttonConfig}
        filterColumns={filterColumns}
        onStateChange={handleStateChange}
        loading={isPending}
      />
    </RefreshContext.Provider>
  )
}
