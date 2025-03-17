'use server'

import { cookies } from 'next/headers'

export async function listAllStudents() {
  const c = await cookies()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/list/all`,
      {
        cache: 'no-cache',
        credentials: 'include',
        next: {
          revalidate: 5,
          tags: ['students-all'],
        },
        headers: {
          Cookie: c.toString(),
        },
      }
    )

    if (!response.ok) {
      throw new Error('Houve um erro ao listar os alunos.')
    }
    return await response.json()
  } catch (e) {
    console.error(e)
    throw new Error('Houve um erro ao listar os alunos.')
  }
}
