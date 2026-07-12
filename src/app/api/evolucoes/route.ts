import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  pacienteId: z.string(),
  procedimento: z.string().min(1),
  data: z.string(),
  queixa: z.string().optional(),
  produto: z.string().optional(),
  lote: z.string().optional(),
  validade: z.string().optional(),
  diluicao: z.number().optional(),
  unidades: z.number().optional(),
  mapaAplicacao: z.array(z.object({
    regiao: z.string(),
    dir: z.string(),
    esq: z.string(),
    obs: z.string(),
  })).optional(),
  tcle: z.boolean().optional(),
  orientacao: z.boolean().optional(),
  semIntercorrencias: z.boolean().optional(),
  obsS1: z.string().optional(),
  avEstatica: z.string().optional(),
  avDinamica: z.string().optional(),
  simetria: z.string().optional(),
  intercorrencias: z.string().optional(),
  intercorrenciasDesc: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const pacienteId = searchParams.get('pacienteId')

  const evolucoes = await prisma.evolucao.findMany({
    where: {
      clinicaId: session.clinicaId,
      ...(pacienteId ? { pacienteId } : {}),
    },
    include: { paciente: { select: { nome: true, cpf: true } } },
    orderBy: { data: 'desc' },
  })

  return NextResponse.json(evolucoes)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const evolucao = await prisma.evolucao.create({
      data: {
        clinicaId: session.clinicaId,
        usuarioId: session.usuarioId,
        pacienteId: data.pacienteId,
        procedimento: data.procedimento,
        data: new Date(data.data),
        queixa: data.queixa || null,
        produto: data.produto || null,
        lote: data.lote || null,
        validade: data.validade ? new Date(data.validade) : null,
        diluicao: data.diluicao || null,
        unidades: data.unidades || null,
        mapaAplicacao: data.mapaAplicacao || undefined,
        tcle: data.tcle ?? true,
        orientacao: data.orientacao ?? true,
        semIntercorrencias: data.semIntercorrencias ?? true,
        obsS1: data.obsS1 || null,
        avEstatica: data.avEstatica || null,
        avDinamica: data.avDinamica || null,
        simetria: data.simetria || null,
        intercorrencias: data.intercorrencias || 'nao',
        intercorrenciasDesc: data.intercorrenciasDesc || null,
      }
    })

    return NextResponse.json(evolucao, { status: 201 })
  } catch (e) {
    console.error('[evolucao POST]', e)
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
