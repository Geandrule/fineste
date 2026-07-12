import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatBRL } from '@/lib/utils'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const now = new Date()
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
  const fimMes    = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [totalEntradas, totalSaidas, contLancamentos, contPacientes, ultimos, pendencias] =
    await Promise.all([
      // Entradas do mês
      prisma.lancamento.aggregate({
        where: { clinicaId: session.clinicaId, tipo: 'entrada', data: { gte: inicioMes, lt: fimMes } },
        _sum: { valor: true }
      }),
      // Saídas do mês
      prisma.lancamento.aggregate({
        where: { clinicaId: session.clinicaId, tipo: 'saida', data: { gte: inicioMes, lt: fimMes } },
        _sum: { valor: true }
      }),
      // Total lançamentos do mês
      prisma.lancamento.count({
        where: { clinicaId: session.clinicaId, data: { gte: inicioMes, lt: fimMes } }
      }),
      // Total pacientes ativos
      prisma.paciente.count({ where: { clinicaId: session.clinicaId, ativo: true } }),
      // Últimos 5 lançamentos
      prisma.lancamento.findMany({
        where: { clinicaId: session.clinicaId },
        orderBy: { data: 'desc' },
        take: 5,
      }),
      // Pendências
      prisma.lancamento.findMany({
        where: { clinicaId: session.clinicaId, categoria: { contains: 'Pendente' } },
        orderBy: { data: 'desc' },
      }),
    ])

  const entradas = Number(totalEntradas._sum.valor || 0)
  const saidas   = Number(totalSaidas._sum.valor || 0)
  const lucro    = entradas - saidas
  const meta     = 27000
  const pctMeta  = entradas > 0 ? (entradas / meta) * 100 : 0

  return (
    <DashboardClient
      nome={session.nome}
      kpis={{ entradas, saidas, lucro, pctMeta, contLancamentos, contPacientes }}
      ultimos={ultimos.map(l => ({ ...l, valor: Number(l.valor), data: l.data.toISOString() }))}
      pendencias={pendencias.map(l => ({ ...l, valor: Number(l.valor), data: l.data.toISOString() }))}
    />
  )
}
