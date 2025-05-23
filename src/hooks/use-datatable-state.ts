'use client'

import type { DataTableState } from '@/types/datatable'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useDataTableState() {
  const router = useRouter()
  const searchParam = useSearchParams()

  const state = useMemo((): DataTableState => {
    const page = Number.parseInt(searchParam.get('page') || '0')
    const size = Number.parseInt(searchParam.get('size') || '10')

    const filters: Record<string, string[]> = {}
    searchParam.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '')
        // Filters out any falsy values (such as empty strings) from the array
        filters[filterKey] = value.split(',').filter(Boolean)
      }
    })

    const sortParam = searchParam.get('sort')
    let sorting: DataTableState['sorting'] = {} as DataTableState['sorting']
    if (sortParam) {
      const [field, direction] = sortParam.split(':')
      sorting = { field, direction: direction as 'asc' | 'desc' }
    }

    return { page, size, filters, sorting }
  }, [searchParam])

  const updateState = useCallback(
    (newState: Partial<DataTableState>) => {
      const params = new URLSearchParams()

      params.set('page', String(newState.page ?? state.page))
      params.set('size', String(newState.size ?? state.size))

      const filters = { ...state.filters, ...newState.filters }
      for (const [key, values] of Object.entries(filters)) {
        if (values && values.length > 0) {
          params.set(`filter_${key}`, values.join(','))
        }
      }

      const sorting = newState.sorting || state.sorting
      if (sorting.field) {
        params.set('sort', `${sorting.field}:${sorting.direction}`)
      }

      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, state]
  )

  return { state, updateState }
}
