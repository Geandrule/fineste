'use client'
import { useState } from 'react'
import { useAPI } from '@/hooks/useAPI'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Paciente = { id: string; nome: string; cpf: string | null; telefone: string | null; criadoEm: string; _count: { evolucoes: number } }

export default function PacientesPage() {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: '', cpf: '', dataNasc: '', telefone: '', email: '', alergias: '' })

  const { data, loading, refetch } = useAPI<Paciente[]>(`/api/pacientes${busca ? `?busca=${busca}` : ''}`, [busca])
  const pacientes = data || []

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/pacientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setModal(false); refetch(); setForm({ nome: '', cpf: '', dataNasc: '', telefone: '', email: '', alergias: '' }) }
    } finally { setSaving(false) }
  }

  const iniciais = (nome: string) => nome.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()

  return (
    <div style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--g800)' }}>Pacientes</h1>
          <p style={{ fontSize: '.8rem', color: 'var(--faint)' }}>{pacientes.length} cadastrado(s)</p>
        </div>
        <button onClick={() => setModal(true)} style={{ background: 'var(--g800)', color: 'var(--white)', padding: '.55rem 1.1rem', borderRadius: 'var(--r-sm)', fontSize: '.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          ＋ Novo paciente
        </button>
      </div>

      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="🔍 Buscar por nome, CPF ou telefone…"
        style={{ width: '100%', maxWidth: 380, marginBottom: '1rem', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--faint)' }}>Carregando…</div>
        ) : pacientes.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem', opacity: .4 }}>👤</div>
            <div style={{ fontWeight: 600, color: 'var(--mid)' }}>Nenhum paciente cadastrado</div>
            <div style={{ fontSize: '.78rem', marginTop: '.3rem' }}>Clique em "Novo paciente" para começar</div>
          </div>
        ) : pacientes.map(p => (
          <div key={p.id} onClick={() => router.push(`/pacientes/${p.id}`)}
            style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'border-color .15s' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--g500), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--white)', flexShrink: 0 }}>
              {iniciais(p.nome)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.88rem', fontWeight: 600 }}>{p.nome}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--faint)', marginTop: '.1rem' }}>
                {[p.cpf, p.telefone].filter(Boolean).join(' · ')} · cadastro em {formatDate(p.criadoEm)}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '.9rem', fontWeight: 500 }}>{p._count.evolucoes}</div>
              <div style={{ fontSize: '.65rem', color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '.06em' }}>sessões</div>
            </div>
            <span style={{ color: 'var(--border)', fontSize: '1rem', marginLeft: '.5rem' }}>›</span>
          </div>
        ))}
      </div>

      {/* Modal novo paciente */}
      {modal && (
        <div onClick={e => e.target === e.currentTarget && setModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', width: '100%', maxWidth: 520, boxShadow: '0 12px 40px rgba(0,0,0,.12)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--g800)' }}>Novo Paciente</h3>
              <button onClick={() => setModal(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--bg)', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={salvar}>
              <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Nome completo *', key: 'nome', placeholder: 'Nome do paciente', type: 'text', required: true },
                  { label: 'CPF', key: 'cpf', placeholder: '000.000.000-00', type: 'text', required: false },
                  { label: 'WhatsApp', key: 'telefone', placeholder: '(41) 9 ____-____', type: 'tel', required: false },
                  { label: 'E-mail', key: 'email', placeholder: 'email@exemplo.com', type: 'email', required: false },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>{f.label}</label>
                    <input required={f.required} type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}/>
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>Alergias / Histórico</label>
                  <textarea value={form.alergias} onChange={e => setForm(f => ({ ...f, alergias: e.target.value }))} placeholder="Alergias conhecidas, medicamentos em uso…"
                    style={{ width: '100%', minHeight: 80, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none', resize: 'vertical' }}/>
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '.75rem' }}>
                <button type="button" onClick={() => setModal(false)} style={{ padding: '.5rem 1rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '.8rem', cursor: 'pointer', color: 'var(--mid)' }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ padding: '.5rem 1.1rem', background: 'var(--g800)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-sm)', fontSize: '.82rem', fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
                  {saving ? 'Salvando…' : 'Salvar paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
