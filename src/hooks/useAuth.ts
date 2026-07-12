'use client'
import { useState, useEffect, useCallback } from 'react'

type UsuarioAuth = {
  id: string
  nome: string
  email: string
  role: string
  clinica: { id: string; nome: string; plano: string }
}

export function useAuth() {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { setUsuario(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }, [])

  return { usuario, loading, logout }
}
