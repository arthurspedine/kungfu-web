'use server'
export async function listAllBelts() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/belt/all`, {
      cache: 'no-cache',
    })
    return response.json()
  } catch (e) {
    console.error('Falha ao buscar as faixas: ', e)
  }
}
