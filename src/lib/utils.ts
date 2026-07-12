export function formatBRL(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(n)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

export function parseValorBR(raw: string): number {
  const s = raw.replace(/[^\d.,-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  return parseFloat(s) || 0
}

export function calcularDRE(lancamentos: Array<{tipo: string; valor: number; categoria: string; data: Date}>) {
  const meses: Record<string, {
    entradas: number
    saidas: Record<string, number>
    total: number
  }> = {}

  for (const l of lancamentos) {
    const mes = new Date(l.data).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
    if (!meses[mes]) meses[mes] = { entradas: 0, saidas: {}, total: 0 }
    const v = Math.abs(Number(l.valor))
    if (l.tipo === 'entrada') {
      meses[mes].entradas += v
      meses[mes].total += v
    } else {
      meses[mes].saidas[l.categoria] = (meses[mes].saidas[l.categoria] || 0) + v
      meses[mes].total -= v
    }
  }
  return meses
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
