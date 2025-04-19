'use server'

import type { AddStudentType } from '@/schemas'
import { revalidateTag } from 'next/cache'
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

export async function handleAddStudent(data: AddStudentType) {
  const c = await cookies()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/register`,
      {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Cookie: c.toString(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error('Houve um erro ao cadastrar o aluno.')
    }

    revalidateTag('student-all')
  } catch (e) {
    console.error(e)
    throw new Error('Houve um erro ao cadastrar o aluno.')
  }
}

export async function getStudentDetails(studentId: string) {
  const c = await cookies()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/details/${studentId}`,
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
      throw new Error('Houve um erro ao buscar as informações do aluno.')
    }

    return await response.json()
  } catch (e) {
    console.error(e)
    return null
  }
}
