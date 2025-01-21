'use server'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function getToken(req?: NextRequest) {
  if (req) {
    return req.cookies.get('kungfu_access_token')?.value
  }
  const c = await cookies()
  return c.get('kungfu_access_token')?.value
}
