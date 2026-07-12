'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setErro(data.error || 'Credenciais inválidas.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--g800)', display: 'flex' }}>
      {/* Esquerda */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 600, color: 'var(--white)', letterSpacing: '.05em', marginBottom: '.5rem' }}>
          FinEstet
        </div>
        <div style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.5)', maxWidth: 340, textAlign: 'center', lineHeight: 1.6, marginBottom: '3rem' }}>
          Sistema completo de gestão financeira e clínica para enfermeiras estetas
        </div>

        {[
          { icon: '📊', text: 'DRE automática com cada lançamento' },
          { icon: '👤', text: 'Evolução de pacientes com mapa de aplicação' },
          { icon: '📄', text: 'Termos TCLE para 11 procedimentos' },
          { icon: '📱', text: 'Acesse pelo celular, tablet ou computador' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.9rem', fontSize: '.82rem', color: 'rgba(255,255,255,.65)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
              {f.icon}
            </div>
            {f.text}
          </div>
        ))}
      </div>

      {/* Direita — formulário */}
      <div style={{ width: 480, background: 'var(--white)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 600, color: 'var(--g800)', marginBottom: '.4rem', alignSelf: 'flex-start' }}>
          Entrar
        </h2>
        <p style={{ fontSize: '.8rem', color: 'var(--faint)', marginBottom: '2rem', alignSelf: 'flex-start' }}>
          Acesse o painel da sua clínica
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>
              E-mail
            </label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="paloma@clinica.com.br"
              style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.74rem', fontWeight: 700, color: 'var(--mid)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '.35rem' }}>
              Senha
            </label>
            <input
              type="password" required value={senha} onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.85rem', outline: 'none' }}
            />
          </div>

          {erro && (
            <div style={{ background: 'var(--roset)', border: '1px solid #FFCDD2', borderRadius: 'var(--r-sm)', padding: '.6rem .8rem', fontSize: '.78rem', color: '#C62828' }}>
              ⚠️ {erro}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '.85rem', background: loading ? 'var(--faint)' : 'var(--g800)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-sm)', fontSize: '.88rem', fontWeight: 700, letterSpacing: '.04em', cursor: loading ? 'wait' : 'pointer', marginTop: '.5rem', transition: 'background .15s' }}>
            {loading ? 'Entrando…' : 'Entrar no painel'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '.75rem', color: 'var(--faint)', textAlign: 'center' }}>
          Não tem conta? <a href="/planos" style={{ color: 'var(--g500)', fontWeight: 600 }}>Ver planos</a>
        </div>
      </div>
    </div>
  )
}
