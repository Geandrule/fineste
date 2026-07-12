import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export default async function PacientePerfilPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return null

  const paciente = await prisma.paciente.findFirst({
    where: { id: params.id, clinicaId: session.clinicaId },
    include: {
      evolucoes: { orderBy: { data: 'desc' } },
      termos: { orderBy: { criadoEm: 'desc' } },
    }
  })

  if (!paciente) notFound()

  const iniciais = paciente.nome.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()

  return (
    <div style={{ padding: '1.75rem' }}>
      <a href="/pacientes" style={{ fontSize: '.8rem', color: 'var(--g500)', display: 'inline-flex', alignItems: 'center', gap: '.3rem', marginBottom: '1.25rem' }}>← Voltar para pacientes</a>

      <div style={{ background: 'linear-gradient(135deg, var(--g800), var(--g700))', borderRadius: 'var(--r-xl)', padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--g500), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--white)', flexShrink: 0 }}>
          {iniciais}
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--white)', fontFamily: "'Cormorant Garamond', serif" }}>{paciente.nome}</div>
          <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', marginTop: '.2rem' }}>
            {[paciente.cpf, paciente.telefone, paciente.email].filter(Boolean).join(' · ')}
          </div>
          {paciente.alergias && <div style={{ fontSize: '.72rem', color: 'rgba(255,200,100,.8)', marginTop: '.2rem' }}>⚠️ {paciente.alergias}</div>}
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 500, color: 'var(--white)' }}>{paciente.evolucoes.length}</div>
          <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.06em' }}>sessões</div>
        </div>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '.85rem' }}>📋 Histórico de evoluções</div>
        {paciente.evolucoes.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--faint)', fontSize: '.82rem' }}>Nenhuma evolução registrada.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Data','Procedimento','Produto','Unidades','Simetria','Status'].map(h => (
                  <th key={h} style={{ padding: '.6rem .9rem', textAlign: 'left', fontSize: '.7rem', fontWeight: 700, color: 'var(--faint)', letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paciente.evolucoes.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '.7rem .9rem', color: 'var(--faint)', fontSize: '.78rem' }}>{formatDate(e.data)}</td>
                  <td style={{ padding: '.7rem .9rem', fontWeight: 600 }}>{e.procedimento}</td>
                  <td style={{ padding: '.7rem .9rem', fontSize: '.78rem' }}>{e.produto || '—'}</td>
                  <td style={{ padding: '.7rem .9rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '.78rem' }}>{e.unidades ? `${e.unidades}U` : '—'}</td>
                  <td style={{ padding: '.7rem .9rem' }}>
                    <span style={{ background: e.simetria === 'adequada' ? 'var(--g100)' : 'var(--goldt)', color: e.simetria === 'adequada' ? 'var(--g700)' : '#7A5A00', padding: '.2rem .5rem', borderRadius: 6, fontSize: '.7rem', fontWeight: 700 }}>
                      {e.simetria === 'adequada' ? '✅ Adequada' : e.simetria || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '.7rem .9rem' }}>
                    <span style={{ background: e.intercorrencias === 'nao' ? 'var(--g100)' : 'var(--roset)', color: e.intercorrencias === 'nao' ? 'var(--g700)' : '#A03030', padding: '.2rem .5rem', borderRadius: 6, fontSize: '.7rem', fontWeight: 700 }}>
                      {e.intercorrencias === 'nao' ? '✅ OK' : '⚠️ Interc.'}
                    </span>
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
