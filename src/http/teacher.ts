'use server'

export async function listAllTeachers(): Promise<
  { id: string; name: string }[]
> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/list/all`, {
      cache: 'no-cache',
    })
    return await response.json()
  } catch (e) {
    console.error('Falha ao listar os professores: ', e)
    return []
  }
}
