'use server'
import type { LoginDataInput } from '@/schemas'
import { cookies } from 'next/headers'

export async function loginUser(data: LoginDataInput) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('Falha ao logar.')

    const { token } = await response.json()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const cookie_name = process.env.COOKIE_NAME
    if (!cookie_name) throw new Error('Configurar o nome do cookie.')
    ;(await cookies()).set(cookie_name, token, {
      expires,
      httpOnly: true,
    })
    return
  } catch (error) {
    console.error('Login error: ', error)
    throw new Error('Houve um erro ao logar.')
  }
}

export async function logout() {
  const cookie_name = process.env.COOKIE_NAME
  if (!cookie_name) throw new Error('Configurar o nome do cookie.')
  ;(await cookies()).set(cookie_name, '', {
    expires: new Date(),
  })
}
