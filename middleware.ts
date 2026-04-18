import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const session = req.cookies.get('ss_admin_session')
    if (!session?.value) {
      return NextResponse.redirect(new URL('/secret-gate', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
