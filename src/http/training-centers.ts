'use server'
import type { AddTrainingCenterType } from '@/schemas'
import { cookies } from 'next/headers'

export async function getTrainingCentersList() {
  const c = await cookies()

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/all`,
      {
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Cookie: c.toString(),
        },
      }
    )

    if (!response.ok) {
      throw new Error('Houve um erro ao requisitar os dados.')
    }

    const data = await response.json()
    return data
  } catch (e) {
    console.error(e)
    throw new Error('Houve um erro ao buscar os núcleos.')
  }
}

export async function handleAddTrainingCenter(data: AddTrainingCenterType) {
  const c = await cookies()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/register`,
      {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Cookie: c.toString(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const errorResponse = await response.text()
      return Promise.reject(new Error(JSON.parse(errorResponse).error))
    }
  } catch (e) {
    return Promise.reject(new Error('Houve um erro ao cadastrar o núcleo.'))
  }
}
