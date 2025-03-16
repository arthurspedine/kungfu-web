'use server'
import type { AddTrainingCenterType } from '@/schemas'
import type { ActionResponse } from '@/types'
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

export async function handleAddTrainingCenter(
  data: AddTrainingCenterType
): Promise<ActionResponse> {
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

    const responseData = await response.json()

    if (!response.ok) {
      if (Array.isArray(responseData)) {
        return {
          success: false,
          message: responseData.map(err => err.message).join('\n'),
        }
      }

      if (responseData.error) {
        return {
          success: false,
          message: responseData.error,
        }
      }

      return {
        success: false,
        message: 'Houve um erro ao cadastrar o núcleo.',
      }
    }
    revalidateTag('training-center-all')
    return { success: true }
  } catch (e) {
    console.error('Server action error:', e)
    return {
      success: false,
      message: 'Houve um erro ao cadastrar o núcleo.',
    }
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
