'use client'
import { formatBRL, formatDate } from '@/lib/utils'

type Props = {
  nome: string
  kpis: { entradas: number; saidas: number; lucro: number; pctMeta: number; contLancamentos: number; contPacientes: number }
  ultimos: Array<{ id: string; tipo: string; descricao: string; categoria: string; valor: number; data: string }>
  pendencias: Array<{ id: string; descricao: string; valor: number; data: string }>
}

export default function DashboardClient({ nome, kpis, ultimos, pendencias }: Props) {
  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--g800)' }}>
            {saudacao}, {nome.split(' ')[0]} ✦
          </h1>
          <p style={{ fontSize: '.8rem', color: 'var(--faint)', marginTop: '.2rem' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: '📈 Faturamento do mês', value: formatBRL(kpis.entradas), change: `${kpis.contLancamentos} lançamentos`, color: 'var(--g500)' },
          { label: '📉 Total de saídas', value: formatBRL(kpis.saidas), change: 'este mês', color: 'var(--rose)' },
          { label: '💰 Lucro líquido', value: formatBRL(kpis.lucro), change: kpis.lucro >= 0 ? '✅ Positivo' : '⚠️ Negativo', color: kpis.lucro >= 0 ? 'var(--g500)' : 'var(--rose)' },
          { label: '🎯 Meta atingida', value: `${kpis.pctMeta.toFixed(0)}%`, change: 'meta R$ 27.000', color: kpis.pctMeta >= 100 ? 'var(--g500)' : 'var(--gold)' },
        ].map((kpi, i) => (
          <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.25rem', borderTop: `3px solid ${kpi.color}` }}>
            <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--faint)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.6rem' }}>{kpi.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.4rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '.3rem' }}>{kpi.value}</div>
            <div style={{ fontSize: '.72rem', color: kpi.color, fontWeight: 600 }}>{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Alertas de pendências */}
      {pendencias.length > 0 && (
        <div style={{ marginBottom: '1rem', padding: '1rem 1.25rem', background: 'var(--goldt)', border: '1px solid #F0D080', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#7A5A00' }}>{pendencias.length} lançamento(s) pendente(s)</div>
            <div style={{ fontSize: '.75rem', color: '#8A6A10', marginTop: '.1rem' }}>
              {pendencias[0].descricao} — {formatBRL(pendencias[0].valor)} em {formatDate(pendencias[0].data)}
            </div>
          </div>
          <a href="/lancamentos?filtro=pendente" style={{ fontSize: '.75rem', padding: '.4rem .75rem', border: '1px solid #F0D080', borderRadius: 'var(--r-sm)', color: '#7A5A00', background: 'transparent', cursor: 'pointer', textDecoration: 'none' }}>
            Resolver →
          </a>
        </div>
      )}

      {/* Últimos lançamentos */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '.85rem', fontWeight: 700 }}>🕐 Últimos lançamentos</div>
          <a href="/lancamentos" style={{ fontSize: '.72rem', color: 'var(--g500)' }}>Ver todos →</a>
        </div>
        {ultimos.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)', fontSize: '.82rem' }}>
            Nenhum lançamento ainda. <a href="/lancamentos" style={{ color: 'var(--g500)' }}>Criar primeiro →</a>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <tbody>
              {ultimos.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '.75rem 1.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{l.descricao}</div>
                    <div style={{ fontSize: '.7rem', color: 'var(--faint)' }}>{formatDate(l.data)}</div>
                  </td>
                  <td style={{ padding: '.75rem .5rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.25rem', padding: '.2rem .55rem', borderRadius: 20, fontSize: '.67rem', fontWeight: 700, background: l.tipo === 'entrada' ? 'var(--g100)' : 'var(--roset)', color: l.tipo === 'entrada' ? 'var(--g700)' : '#A03030' }}>
                      {l.tipo === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                    </span>
                  </td>
                  <td style={{ padding: '.75rem 1.25rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: l.tipo === 'entrada' ? 'var(--g500)' : '#C62828' }}>
                    {l.tipo === 'entrada' ? '+' : '-'} {formatBRL(l.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
