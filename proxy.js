import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const adminOnlyRoutes = ['/reports', '/admin']

export async function proxy(request) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route))
  
  if (isAdminRoute) {
    try {
      const refreshToken = request.cookies.get('refreshToken')?.value
      
      if (!refreshToken) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(refreshToken, secret)
      
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
      
    } catch (error) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/reports/:path*', '/admin/:path*']
}