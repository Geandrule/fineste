import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Liberar rotas públicas e arquivos estáticos
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Verificar token
  const token = req.cookies.get('finestai_token')?.value
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const payload = verifyToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Passar clinicaId e usuarioId nos headers para Server Components
  const res = NextResponse.next()
  res.headers.set('x-clinica-id', payload.clinicaId)
  res.headers.set('x-usuario-id', payload.usuarioId)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
