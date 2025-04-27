'use server'

import { getToken } from '@/helper/getToken'

export async function getUserInfo() {
  const accessToken = await getToken()
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/info`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Houve um erro ao requisitar os dados.')
    }

    const data = await response.json()
    return data
  } catch (e) {
    console.error(e)
    throw new Error('Houve um erro ao buscar suas informações.')
  }
}
