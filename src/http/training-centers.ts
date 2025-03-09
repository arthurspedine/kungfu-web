'use server'
import type { AddTrainingCenterType } from '@/schemas'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export async function getTrainingCentersList() {
  const c = await cookies()

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/all`,
      {
        next: {
          tags: ['training-center-all'],
        },
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
      const errorResponse:
        | { error: string }
        | { field: string; message: string }[] = await response.json()

      if (Array.isArray(errorResponse)) {
        let finalMessage = ''

        for (let index = 0; index < errorResponse.length; index++) {
          const element = errorResponse[index]
          finalMessage += `${element.message}\n`
        }

        return Promise.reject(new Error(finalMessage))
      }

      return Promise.reject(new Error(errorResponse.error))
    }
    revalidateTag('training-center-all')
  } catch (e) {
    return Promise.reject(new Error('Houve um erro ao cadastrar o núcleo.'))
  }
}

export async function getTrainingCenterInfo(trainingCenterId: string) {
  const c = await cookies()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/info/${trainingCenterId}`,
      {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Cookie: c.toString(),
        },
      }
    )

    if (!response.ok) {
      throw new Error('Houve um erro ao buscar as informações do núcleo.')
    }

    return await response.json()
  } catch (e) {
    console.error(e)
    return null
  }
}
