'use client'
import { useAPI } from '@/hooks/useAPI'
import { formatBRL } from '@/lib/utils'

type DREData = {
  meses: Array<{ mes: string; anoMes: string; entradas: number; saidas: Record<string, number>; total: number }>
  totais: { entradas: number; saidas: number; lucro: number }
  ano: number
}

export default function DREPage() {
  const { data, loading } = useAPI<DREData>('/api/dre')

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)' }}>Carregando DRE…</div>
  if (!data || data.meses.length === 0) return (
    <div style={{ padding: '1.75rem' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--g800)', marginBottom: '.5rem' }}>DRE — Resultado Gerencial</h1>
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
        Nenhum lançamento registrado ainda.
      </div>
    </div>
  )

  const cats = ['Suprimentos / Insumos','Aluguel','Marketing','Despesa Fixa / Operacional','Gestão / Contabilidade','Fornecedor Clínica','Pró-labore / Retirada']

  return (
    <div style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--g800)' }}>DRE — Resultado Gerencial</h1>
          <p style={{ fontSize: '.8rem', color: 'var(--faint)' }}>Demonstração de Resultado · Simples Nacional · {data.ano}</p>
        </div>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
          <thead>
            <tr style={{ background: 'var(--g800)' }}>
              <th style={{ padding: '.75rem 1.25rem', textAlign: 'left', color: 'var(--white)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.05em' }}>Descrição</th>
              {data.meses.map(m => (
                <th key={m.anoMes} style={{ padding: '.75rem .9rem', textAlign: 'right', color: 'var(--white)', fontSize: '.75rem', fontWeight: 700 }}>{m.mes.toUpperCase()}</th>
              ))}
              <th style={{ padding: '.75rem .9rem', textAlign: 'right', color: 'var(--gold)', fontSize: '.75rem', fontWeight: 700 }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {/* Faturamento */}
            <tr style={{ background: 'var(--g050)' }}>
              <td style={{ padding: '.75rem 1.25rem', fontWeight: 700, color: 'var(--g800)' }}>FATURAMENTO BRUTO</td>
              {data.meses.map(m => <td key={m.anoMes} style={{ padding: '.75rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--g700)' }}>{formatBRL(m.entradas)}</td>)}
              <td style={{ padding: '.75rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--g700)' }}>{formatBRL(data.totais.entradas)}</td>
            </tr>

            {cats.map(cat => {
              const total = data.meses.reduce((s, m) => s + (m.saidas[cat] || 0), 0)
              if (total === 0) return null
              return (
                <tr key={cat} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '.65rem 1.25rem .65rem 2rem', color: 'var(--mid)', fontSize: '.78rem' }}>(-) {cat}</td>
                  {data.meses.map(m => <td key={m.anoMes} style={{ padding: '.65rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '.78rem', color: '#C62828' }}>{m.saidas[cat] ? `- ${formatBRL(m.saidas[cat])}` : '—'}</td>)}
                  <td style={{ padding: '.65rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '.78rem', color: '#C62828' }}>- {formatBRL(total)}</td>
                </tr>
              )
            })}

            {/* Lucro */}
            <tr style={{ background: '#E8F5E9', borderTop: '2px solid var(--g500)' }}>
              <td style={{ padding: '.85rem 1.25rem', fontWeight: 700, fontSize: '.9rem', color: 'var(--g800)' }}>✦ LUCRO LÍQUIDO</td>
              {data.meses.map(m => (
                <td key={m.anoMes} style={{ padding: '.85rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: m.total >= 0 ? 'var(--g500)' : '#C62828' }}>
                  {formatBRL(m.total)}
                </td>
              ))}
              <td style={{ padding: '.85rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: data.totais.lucro >= 0 ? 'var(--g500)' : '#C62828' }}>
                {formatBRL(data.totais.lucro)}
              </td>
            </tr>

            {/* % Meta */}
            <tr style={{ background: 'var(--goldt)' }}>
              <td style={{ padding: '.65rem 1.25rem', fontSize: '.78rem', fontWeight: 700, color: '#7A5A00' }}>🎯 % Meta (R$ 27.000)</td>
              {data.meses.map(m => {
                const pct = m.entradas > 0 ? (m.entradas / 27000) * 100 : 0
                return <td key={m.anoMes} style={{ padding: '.65rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '.78rem', fontWeight: 700, color: pct >= 100 ? 'var(--g500)' : '#7A5A00' }}>{pct >= 100 ? '✅ ' : ''}{pct.toFixed(0)}%</td>
              })}
              <td style={{ padding: '.65rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '.78rem', fontWeight: 700, color: 'var(--g700)' }}>
                {((data.totais.entradas / 27000 / Math.max(data.meses.length, 1)) * 100).toFixed(0)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
