import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.usuarioId },
    include: { clinica: true }
  })

  if (!usuario) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })

  return NextResponse.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    clinica: {
      id: usuario.clinica.id,
      nome: usuario.clinica.nome,
      plano: usuario.clinica.plano,
    }
  })
}
