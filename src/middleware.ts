import { jwtVerify } from 'jose'
import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from './helper/getToken'

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isAuthRoute = path.startsWith('/auth/')

  const token = await getToken(req)
  const isValidToken = token ? await verifyJWT(token) : null

  if (isValidToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/training_centers', req.nextUrl))
  }

  if (!isValidToken && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
