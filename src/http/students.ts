'use server'

import type { Page } from '@/components/datatable/interfaces'
import { getToken } from '@/helper/getToken'
import type { FormStudentType } from '@/schemas'
import type { StudentInfo } from '@/types'
import { revalidateTag } from 'next/cache'

export async function listAllStudents(
  queryString = ''
): Promise<Page<StudentInfo>> {
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/list/all?${queryString}`,
      {
        cache: 'no-cache',
        credentials: 'include',
        next: {
          tags: ['students-all'],
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

export async function handleAddStudent(data: FormStudentType) {
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/register`,
      {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/details/${studentId}`,
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
      throw new Error('Houve um erro ao buscar as informações do aluno.')
    }

    return await response.json()
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function handleUpdateStudent(
  studentId: string,
  data: FormStudentType
) {
  const accessToken = await getToken()
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/student/edit/${studentId}`,
      {
        method: 'PUT',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error('Houve um erro ao editar o aluno.')
    }

    revalidateTag('student-all')
  } catch (e) {
    console.error(e)
    throw new Error('Houve um erro ao editar o aluno.')
  }
}
