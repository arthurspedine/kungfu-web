'use server'
import type { TrainingCenterData } from '@/app/(home)/training_centers/_components/columns'
import type { Page } from '@/components/datatable/interfaces'
import { getToken } from '@/helper/getToken'
import type { AddTrainingCenterType, EditTrainingCenterType } from '@/schemas'
import type { ActionResponse, TrainingCenterDetailsResponse } from '@/types'
import { revalidateTag } from 'next/cache'

export async function getTrainingCentersList(
  queryString = ''
): Promise<Page<TrainingCenterData>> {
  const accessToken = await getToken()

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/all?${queryString}`,
      {
        next: {
          tags: ['training-center-all'],
        },
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/register`,
      {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const responseData = await response.json()
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
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/info/${trainingCenterId}`,
      {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export async function listAllTrainingCentersInfo() {
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/all/info`,
      {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Houve um erro ao listar todos os núcleos.')
    }

    return await response.json()
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function handleUpdateTrainingCenter(
  trainingCenterId: string,
  data: EditTrainingCenterType
): Promise<ActionResponse> {
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/edit/${trainingCenterId}`,
      {
        method: 'PUT',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const responseData = await response.json()
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
        message: 'Houve um erro ao atualizado o núcleo.',
      }
    }
    revalidateTag('training-center-all')
    return { success: true }
  } catch (e) {
    console.error('Server action error:', e)
    return {
      success: false,
      message: 'Houve um erro ao atualizado o núcleo.',
    }
  }
}

export async function getTrainingCenterDetails(
  id: string
): Promise<TrainingCenterDetailsResponse> {
  const accessToken = await getToken()

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/details/${id}`,
      {
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
    throw new Error('Houve um erro ao buscar os detalhes do núcleo.')
  }
}
