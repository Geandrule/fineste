'use client'
import { useState } from 'react'
import { useAPI } from '@/hooks/useAPI'
import { formatBRL, formatDate } from '@/lib/utils'

export default function LancamentosPage() {
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ tipo: 'entrada', valor: '', descricao: '', data: new Date().toISOString().split('T')[0], conta: '', categoria: '', obs: '' })

  const { data, loading, refetch } = useAPI<{ lancamentos: Array<{ id: string; tipo: string; descricao: string; categoria: string; conta: string; valor: number; data: string }> }>('/api/lancamentos?limit=200')

  const lancamentos = data?.lancamentos || []
  const filtrados = lancamentos.filter(l => filtroTipo === 'todos' || l.tipo === filtroTipo || (filtroTipo === 'pendente' && l.categoria.includes('Pendente')))

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/lancamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, valor: parseFloat(form.valor.replace(',', '.')) }),
      })
      if (res.ok) { setModalAberto(false); refetch(); setForm({ tipo: 'entrada', valor: '', descricao: '', data: new Date().toISOString().split('T')[0], conta: '', categoria: '', obs: '' }) }
    } finally { setSaving(false) }
  }

  return (
    <div style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--g800)' }}>Lançamentos</h1>
          <p style={{ fontSize: '.8rem', color: 'var(--faint)' }}>Todas as entradas e saídas financeiras</p>
        </div>
        <button onClick={() => setModalAberto(true)} style={{ background: 'var(--g800)', color: 'var(--white)', padding: '.55rem 1.1rem', borderRadius: 'var(--r-sm)', fontSize: '.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          ＋ Novo lançamento
        </button>
      </div>

      {/* Filtros */}
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '.5rem' }}>
        {['todos','entrada','saida','pendente'].map(f => (
          <button key={f} onClick={() => setFiltroTipo(f)}
            style={{ padding: '.4rem .85rem', borderRadius: 'var(--r-sm)', fontSize: '.78rem', fontWeight: 600, border: '1.5px solid', cursor: 'pointer', transition: 'all .15s',
              borderColor: filtroTipo === f ? 'var(--g800)' : 'var(--border)',
              background: filtroTipo === f ? 'var(--g800)' : 'transparent',
              color: filtroTipo === f ? 'var(--white)' : 'var(--mid)' }}>
            {f === 'todos' ? 'Todos' : f === 'entrada' ? '💚 Entradas' : f === 'saida' ? '🔴 Saídas' : '⚠️ Pendentes'}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)' }}>Carregando…</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)', fontSize: '.82rem' }}>
            Nenhum lançamento encontrado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Data','Descrição','Categoria','Conta','Tipo','Valor'].map(h => (
                  <th key={h} style={{ padding: '.65rem .9rem', textAlign: h === 'Valor' ? 'right' : 'left', fontSize: '.7rem', fontWeight: 700, color: 'var(--faint)', letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)', background: l.categoria.includes('Pendente') ? 'var(--goldt)' : 'transparent' }}>
                  <td style={{ padding: '.75rem .9rem', color: 'var(--faint)', fontSize: '.78rem' }}>{formatDate(l.data)}</td>
                  <td style={{ padding: '.75rem .9rem', fontWeight: 600 }}>{l.descricao}</td>
                  <td style={{ padding: '.75rem .9rem' }}>
                    <span style={{ background: 'var(--bg)', padding: '.2rem .5rem', borderRadius: 6, fontSize: '.7rem' }}>{l.categoria}</span>
                  </td>
                  <td style={{ padding: '.75rem .9rem', fontSize: '.78rem' }}>{l.conta}</td>
                  <td style={{ padding: '.75rem .9rem' }}>
                    <span style={{ display: 'inline-flex', padding: '.2rem .55rem', borderRadius: 20, fontSize: '.67rem', fontWeight: 700, background: l.tipo === 'entrada' ? 'var(--g100)' : 'var(--roset)', color: l.tipo === 'entrada' ? 'var(--g700)' : '#A03030' }}>
                      {l.tipo === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                    </span>
                  </td>
                  <td style={{ padding: '.75rem .9rem', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: l.tipo === 'entrada' ? 'var(--g500)' : '#C62828' }}>
                    {l.tipo === 'entrada' ? '+' : '-'} {formatBRL(l.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div onClick={e => e.target === e.currentTarget && setModalAberto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', width: '100%', maxWidth: 520, boxShadow: '0 12px 40px rgba(0,0,0,.12)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--g800)' }}>Novo Lançamento</h3>
              <button onClick={() => setModalAberto(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--bg)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={salvar}>
              <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  {['entrada','saida'].map(t => (
                    <button type="button" key={t} onClick={() => setForm(f => ({ ...f, tipo: t, categoria: '' }))}
                      style={{ flex: 1, padding: '.5rem', borderRadius: 'var(--r-sm)', border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', transition: 'all .15s',
                        background: form.tipo === t ? (t === 'entrada' ? 'var(--g100)' : 'var(--roset)') : 'transparent',
                        borderColor: form.tipo === t ? (t === 'entrada' ? 'var(--g500)' : 'var(--rose)') : 'var(--border)',
                        color: form.tipo === t ? (t === 'entrada' ? 'var(--g700)' : '#A03030') : 'var(--faint)' }}>
                      {t === 'entrada' ? '💚 Entrada' : '🔴 Saída'}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>Valor (R$)</label>
                    <input required value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="0,00" inputMode="decimal" style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}/>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>Data</label>
                    <input required type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}/>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>Descrição</label>
                  <input required value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder={form.tipo === 'entrada' ? 'Ex: Maria Silva — Botox' : 'Ex: Merco Sul Soluções'} style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>Conta</label>
                    <select required value={form.conta} onChange={e => setForm(f => ({ ...f, conta: e.target.value }))} style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none', appearance: 'none' }}>
                      <option value="">Selecione</option>
                      <option>Santander</option>
                      <option>PagBank</option>
                      <option>Dinheiro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>Categoria</label>
                    <select required value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none', appearance: 'none' }}>
                      <option value="">Selecione</option>
                      {form.tipo === 'entrada' ? (
                        <>
                          <option>Receita · PIX</option>
                          <option>Receita · Cartão Crédito</option>
                          <option>Receita · Cartão Débito</option>
                          <option>Receita · Dinheiro</option>
                        </>
                      ) : (
                        <>
                          <option>Suprimentos / Insumos</option>
                          <option>Aluguel</option>
                          <option>Marketing</option>
                          <option>Despesa Fixa / Operacional</option>
                          <option>Gestão / Contabilidade</option>
                          <option>Fornecedor Clínica</option>
                          <option>Pró-labore / Retirada</option>
                          <option>Pessoal / Casa</option>
                          <option>⚠️ Pendente · Verificar</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '.5rem 1rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '.8rem', cursor: 'pointer', color: 'var(--mid)' }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ padding: '.5rem 1.1rem', background: 'var(--g800)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-sm)', fontSize: '.82rem', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
                  {saving ? 'Salvando…' : 'Salvar lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
