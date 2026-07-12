import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verificarSenha, signToken, COOKIE_NAME_EXPORT } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, senha } = schema.parse(body)

    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      include: { clinica: true }
    })

    if (!usuario || !usuario.ativo) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 })
    }

    const senhaOk = await verificarSenha(senha, usuario.senhaHash)
    if (!senhaOk) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 })
    }

    const token = signToken({
      usuarioId: usuario.id,
      clinicaId: usuario.clinicaId,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    })

    const res = NextResponse.json({
      ok: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        clinica: { id: usuario.clinica.id, nome: usuario.clinica.nome, plano: usuario.clinica.plano }
      }
    })

    res.cookies.set(COOKIE_NAME_EXPORT, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    return res
  } catch (e) {
    console.error('[login]', e)
    return NextResponse.json({ error: 'Erro ao processar o login.' }, { status: 400 })
  }
}
