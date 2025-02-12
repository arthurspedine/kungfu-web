'use server'
import { cookies } from 'next/headers'

export async function getTrainingCentersList() {
  const c = await cookies()
  const url = `${process.env.BACKEND_URL}/training-center/all`
  console.log(url)

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/training-center/all`,
      {
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
