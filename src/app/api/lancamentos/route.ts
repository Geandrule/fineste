import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  tipo: z.enum(['entrada', 'saida']),
  valor: z.number().positive(),
  descricao: z.string().min(1).max(200),
  categoria: z.string().min(1),
  conta: z.string().min(1),
  procedimento: z.string().optional(),
  obs: z.string().optional(),
  metodo: z.string().optional(),
  data: z.string(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tipo    = searchParams.get('tipo')
  const mes     = searchParams.get('mes')       // formato: 2026-06
  const limit   = parseInt(searchParams.get('limit') || '100')
  const page    = parseInt(searchParams.get('page') || '1')
  const skip    = (page - 1) * limit

  const where: Record<string, unknown> = { clinicaId: session.clinicaId }
  if (tipo) where.tipo = tipo
  if (mes) {
    const [ano, m] = mes.split('-').map(Number)
    where.data = {
      gte: new Date(ano, m - 1, 1),
      lt:  new Date(ano, m, 1),
    }
  }

  const [lancamentos, total] = await Promise.all([
    prisma.lancamento.findMany({
      where,
      orderBy: { data: 'desc' },
      take: limit,
      skip,
    }),
    prisma.lancamento.count({ where }),
  ])

  return NextResponse.json({ lancamentos, total, page, limit })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const lancamento = await prisma.lancamento.create({
      data: {
        clinicaId: session.clinicaId,
        usuarioId: session.usuarioId,
        tipo: data.tipo,
        valor: data.valor,
        descricao: data.descricao,
        categoria: data.categoria,
        conta: data.conta,
        procedimento: data.procedimento || null,
        obs: data.obs || null,
        metodo: data.metodo || 'manual',
        data: new Date(data.data),
      }
    })

    return NextResponse.json(lancamento, { status: 201 })
  } catch (e) {
    console.error('[lancamento POST]', e)
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
