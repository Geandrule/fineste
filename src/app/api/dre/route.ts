import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const anoParam = searchParams.get('ano')
  const ano = anoParam ? parseInt(anoParam) : new Date().getFullYear()

  const lancamentos = await prisma.lancamento.findMany({
    where: {
      clinicaId: session.clinicaId,
      data: {
        gte: new Date(ano, 0, 1),
        lt:  new Date(ano + 1, 0, 1),
      }
    },
    orderBy: { data: 'asc' },
  })

  // Agrupar por mês
  const meses: Record<string, {
    mes: string
    anoMes: string
    entradas: number
    saidas: Record<string, number>
    total: number
  }> = {}

  for (const l of lancamentos) {
    const d = new Date(l.data)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })

    if (!meses[key]) meses[key] = { mes: label, anoMes: key, entradas: 0, saidas: {}, total: 0 }

    const v = Math.abs(Number(l.valor))
    if (l.tipo === 'entrada') {
      meses[key].entradas += v
      meses[key].total += v
    } else {
      meses[key].saidas[l.categoria] = (meses[key].saidas[l.categoria] || 0) + v
      meses[key].total -= v
    }
  }

  const resultado = Object.values(meses).sort((a, b) => a.anoMes.localeCompare(b.anoMes))

  // Totais gerais
  const totais = resultado.reduce((acc, m) => ({
    entradas: acc.entradas + m.entradas,
    saidas: acc.saidas + Object.values(m.saidas).reduce((s, v) => s + v, 0),
    lucro: acc.lucro + m.total,
  }), { entradas: 0, saidas: 0, lucro: 0 })

  return NextResponse.json({ meses: resultado, totais, ano })
}
