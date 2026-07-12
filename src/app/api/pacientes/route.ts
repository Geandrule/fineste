import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  nome: z.string().min(2).max(150),
  cpf: z.string().optional(),
  dataNasc: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  alergias: z.string().optional(),
  obs: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const busca = searchParams.get('busca') || ''

  const pacientes = await prisma.paciente.findMany({
    where: {
      clinicaId: session.clinicaId,
      ativo: true,
      ...(busca ? {
        OR: [
          { nome: { contains: busca, mode: 'insensitive' } },
          { cpf: { contains: busca } },
          { telefone: { contains: busca } },
        ]
      } : {})
    },
    include: {
      _count: { select: { evolucoes: true, termos: true } }
    },
    orderBy: { nome: 'asc' },
  })

  return NextResponse.json(pacientes)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const paciente = await prisma.paciente.create({
      data: {
        clinicaId: session.clinicaId,
        nome: data.nome,
        cpf: data.cpf || null,
        dataNasc: data.dataNasc ? new Date(data.dataNasc) : null,
        telefone: data.telefone || null,
        email: data.email || null,
        alergias: data.alergias || null,
        obs: data.obs || null,
      }
    })

    return NextResponse.json(paciente, { status: 201 })
  } catch (e) {
    console.error('[paciente POST]', e)
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
