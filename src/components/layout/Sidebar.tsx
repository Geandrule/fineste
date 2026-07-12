'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { section: 'Principal' },
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/lancamentos', icon: '💰', label: 'Lançamentos' },
  { href: '/dre', icon: '📊', label: 'DRE / Relatórios' },
  { section: 'Clínica' },
  { href: '/pacientes', icon: '👤', label: 'Pacientes' },
  { href: '/evolucoes', icon: '📋', label: 'Evoluções' },
  { href: '/termos', icon: '📄', label: 'Termos / TCLE' },
  { section: 'Sistema' },
  { href: '/configuracoes', icon: '⚙️', label: 'Configurações' },
  { href: '/planos', icon: '⭐', label: 'Meu Plano' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { usuario, logout } = useAuth()

  const iniciais = usuario?.nome?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') || '?'

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--g800)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: 'var(--white)' }}>
          FinEstet
        </div>
        <div style={{ fontSize: '.68rem', fontWeight: 500, color: 'rgba(255,255,255,.4)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '.25rem' }}>
          Gestão Clínica
        </div>
      </div>

      {/* Clínica */}
      {usuario && (
        <div style={{ padding: '.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: '.7rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--g500), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '.9rem', fontWeight: 600, color: 'var(--white)', flexShrink: 0 }}>
            {usuario.clinica.nome.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'rgba(255,255,255,.9)' }}>{usuario.clinica.nome}</div>
            <div style={{ fontSize: '.64rem', color: 'var(--gold)', fontWeight: 500 }}>✦ Plano {usuario.clinica.plano}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '.75rem 0', overflowY: 'auto' }}>
        {navItems.map((item, i) => {
          if ('section' in item) {
            return (
              <div key={i} style={{ fontSize: '.62rem', fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.12em', textTransform: 'uppercase', padding: '.75rem 1.25rem .3rem' }}>
                {item.section}
              </div>
            )
          }
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <div key={item.href} onClick={() => router.push(item.href!)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.7rem',
                padding: '.6rem 1.25rem', fontSize: '.82rem', fontWeight: 500,
                color: active ? 'var(--white)' : 'rgba(255,255,255,.55)',
                background: active ? 'rgba(255,255,255,.08)' : 'transparent',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: 'pointer', transition: 'all .15s',
              }}>
              <span style={{ width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '.75rem 1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.5rem', borderRadius: 'var(--r-sm)', cursor: 'pointer' }}
          onClick={logout}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 700, color: 'rgba(255,255,255,.7)', flexShrink: 0 }}>
            {iniciais}
          </div>
          <div style={{ fontSize: '.75rem', fontWeight: 500, color: 'rgba(255,255,255,.6)' }}>
            {usuario?.nome || 'Carregando…'}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '.8rem', color: 'rgba(255,255,255,.3)' }}>→</div>
        </div>
      </div>
    </aside>
  )
}
