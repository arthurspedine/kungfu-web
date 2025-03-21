'use server'

import { cookies } from 'next/headers'

export async function getUserInfo() {
  const c = await cookies()
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/info`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: c.toString(),
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
