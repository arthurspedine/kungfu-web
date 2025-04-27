'use server'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function getToken(req?: NextRequest) {
  const cookieName = process.env.COOKIE_NAME || 'kungfu_access_token'
  if (req) {
    return req.cookies.get(cookieName)?.value
  }
  const c = await cookies()
  return c.get('kungfu_access_token')?.value
}
