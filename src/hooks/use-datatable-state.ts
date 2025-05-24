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

    return { page, size, filters }
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

      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, state]
  )

  return { state, updateState }
}
